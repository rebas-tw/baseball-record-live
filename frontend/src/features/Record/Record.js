import React, { useReducer, useEffect, useState } from 'react';
import { Divider, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { findIndex } from 'ramda';
import styled from 'styled-components';
import { TABLET_WIDTH } from '~~elements/Const';
import Button from '~~elements/Button';
import Checkbox from '~~elements/Checkbox';
import { ROOM_RECORD } from '~~utils/LocalStorage';
import LineUp from './components/LineUp';
import Registry from './components/Registry';
import BattingResult from './components/BattingResult';
import { getInGamePlayerKey, getPlayerNumberName } from './Const';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20rem;
  font-size: 0.8rem;

  .error-msg {
    color: red;
  }

  .section {
    &--title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.2rem 0;
      &.around {
        justify-content: space-around;
      }
    }
    &--input-group {
      display: flex;
      align-items: center;
      > .gap {
        padding: 0 0.5rem;
      }
    }
  }

  @media (max-width: ${TABLET_WIDTH}) {
    width: 100%;
  }
`;

const initTeam = {
  name: '尚未設定',
  players: [],
  inGamePlayers: Array.from({ length: 10 }, () => ({})),
  currentPlayerIndex: 0,
  scores: 0,
};
const initState = {
  away: { ...JSON.parse(JSON.stringify(initTeam)) },
  home: { ...JSON.parse(JSON.stringify(initTeam)) },
  reviewPlayerIndex: -1,
  editingLineUpSide: 'away',
  strikes: 0,
  balls: 0,
  outs: 0,
  bases: [false, false, false],
  innings: 1,
  inningFrame: '上',
  broadcast: null,
  roomID: '',
};

function recordReducer(state, action) {
  const getLocalStorage = (roomID) => {
    let localRecord = {};
    try {
      localRecord = JSON.parse(localStorage.getItem(ROOM_RECORD));
    } catch (e) {}
    localRecord = !!localRecord ? localRecord : {};

    return localRecord[roomID] ? localRecord[roomID][0] : initState;
  };

  const updateSideData = (side, payload) => {
    delete payload.side;
    return {
      ...state,
      [side]: { ...state[side], ...payload },
    };
  };

  const saveLocalStorage = (newState) => {
    let localRecord = {};
    try {
      localRecord = JSON.parse(localStorage.getItem(ROOM_RECORD));
    } catch (e) {}
    localRecord = !!localRecord ? localRecord : {};

    if (!localRecord[newState.roomID]) {
      localRecord[newState.roomID] = [];
    }
    localRecord[newState.roomID].unshift({ ...newState });
    delete localRecord[newState.roomID][0].broadcast;
    localRecord[newState.roomID] = localRecord[newState.roomID].slice(0, 20);
    localStorage.setItem(ROOM_RECORD, JSON.stringify(localRecord));
  };

  const triggerBroadcast = (newState) => {
    const displayInfo = {
      away: newState.away,
      home: newState.home,
      strikes: newState.strikes,
      balls: newState.balls,
      outs: newState.outs,
      bases: newState.bases,
      innings: newState.innings,
      inningFrame: newState.inningFrame,
    };
    newState.broadcast(JSON.parse(JSON.stringify(displayInfo)));
  };

  switch (action.type) {
    case 'init':
      return {
        ...getLocalStorage(action.payload.roomID),
        roomID: action.payload.roomID,
        broadcast: action.payload.broadcast,
      };
    case 'updateControlInfo': {
      const newState = { ...state, ...action.payload };
      saveLocalStorage(newState);
      return newState;
    }
    case 'updateInFieldingInfo': {
      const newState = { ...state, ...action.payload };
      saveLocalStorage(newState);
      triggerBroadcast(newState);
      return newState;
    }
    case 'updateTeamInfo': {
      const newState = updateSideData(action.payload.side, action.payload);
      saveLocalStorage(newState);
      triggerBroadcast(newState);
      return newState;
    }
    case 'revert': {
      let localRecord = {};
      try {
        localRecord = JSON.parse(localStorage.getItem(ROOM_RECORD));
      } catch (e) {}
      localRecord = !!localRecord ? localRecord : {};

      if (!localRecord[state.roomID] || localRecord[state.roomID].length <= 1) {
        return { ...state };
      }

      localRecord[state.roomID].splice(0, 1);
      localStorage.setItem(ROOM_RECORD, JSON.stringify(localRecord));
      triggerBroadcast(localRecord[state.roomID][0]);
      return { ...localRecord[state.roomID][0], broadcast: state.broadcast };
    }
    case 'forceBroadcast':
      triggerBroadcast(state);
      return state;
    default:
      throw new Error();
  }
}

const Record = ({ roomID, broadcast, gotSeasonsData, getSeasonTeams, getTeamPlayers }) => {
  const [recordState, recordDispatch] = useReducer(recordReducer, initState);
  const [currentSide, setCurrentSide] = useState('away');
  const [currentBatter, setCurrentBatter] = useState({});

  useEffect(() => {
    recordDispatch({ type: 'init', payload: { roomID, broadcast } });
  }, [broadcast, roomID]);

  useEffect(() => {
    setCurrentSide(recordState.inningFrame === '上' ? 'away' : 'home');
  }, [recordState.inningFrame]);

  useEffect(() => {
    setCurrentBatter(
      recordState[currentSide].inGamePlayers[
        recordState.reviewPlayerIndex === -1
          ? recordState[currentSide].currentPlayerIndex
          : recordState.reviewPlayerIndex
      ],
    );
  }, [currentSide, recordState]);

  const swapAwayHomeTeam = () => {
    recordDispatch({ type: 'updateTeamInfo', payload: { ...recordState.away, side: 'home' } });
    recordDispatch({ type: 'updateTeamInfo', payload: { ...recordState.home, side: 'away' } });
  };

  const editTeamName = ({ side, name }) => {
    recordDispatch({ type: 'updateTeamInfo', payload: { name, side } });
  };

  const addPlayer = ({ side, number, name }) => {
    const players = recordState[side].players;
    players.push({
      number,
      name,
      records: [],
    });
    recordDispatch({ type: 'updateTeamInfo', payload: { players, side } });
  };

  const addPlayers = ({ side, players: newPlayers }) => {
    const players = recordState[side].players;
    newPlayers.forEach((player) => {
      players.push({
        number: player.number,
        name: player.name,
        records: [],
      });
    });
    recordDispatch({ type: 'updateTeamInfo', payload: { players, side } });
  };

  const editPlayer = ({ side, index, number, name }) => {
    const players = recordState[side].players;

    const player = recordState[side].players[index];
    const inGameKey = getInGamePlayerKey(player.number, player.name);
    const inGamePlayers = recordState[side].inGamePlayers;
    inGamePlayers.forEach((p) => {
      if (p.player !== inGameKey) {
        return;
      }

      p.player = undefined;
    });

    players[index] = {
      ...players[index],
      number,
      name,
    };

    recordDispatch({ type: 'updateTeamInfo', payload: { players, inGamePlayers, side } });
  };

  const removePlayer = ({ side, index }) => () => {
    const players = recordState[side].players;

    const player = recordState[side].players[index];
    const inGameKey = getInGamePlayerKey(player.number, player.name);
    const inGamePlayers = recordState[side].inGamePlayers;
    inGamePlayers.forEach((p) => {
      if (p.player !== inGameKey) {
        return;
      }

      p.player = undefined;
    });

    players.splice(index, 1);
    recordDispatch({ type: 'updateTeamInfo', payload: { players, inGamePlayers, side } });
  };

  const handleLineUpPanelDisplay = (side) => {
    recordDispatch({ type: 'updateControlInfo', payload: { editingLineUpSide: side } });
  };

  const setInGamePlayer = (key, editIndex) => (e) => {
    const value = e.target.value;
    const inGamePlayers = recordState[recordState.editingLineUpSide].inGamePlayers;
    inGamePlayers[editIndex][key] = value;
    recordDispatch({ type: 'updateTeamInfo', payload: { inGamePlayers, side: recordState.editingLineUpSide } });
  };

  const handleBaseChange = (index) => () => {
    recordState.bases[index] = !recordState.bases[index];
    recordDispatch({ type: 'updateInFieldingInfo', payload: { bases: recordState.bases } });
  };

  const handleInningFrameChange = (add) => () => {
    let inningFrame = '';
    let innings = recordState.innings;
    if (add) {
      if (recordState.inningFrame === '上') {
        inningFrame = '下';
      } else {
        inningFrame = '上';
        innings++;
      }
    } else {
      if (recordState.inningFrame === '下') {
        inningFrame = '上';
      } else {
        inningFrame = '下';
        innings--;
      }
    }

    recordDispatch({
      type: 'updateInFieldingInfo',
      payload: {
        strikes: 0,
        balls: 0,
        outs: 0,
        bases: [false, false, false],
        innings,
        inningFrame,
      },
    });
  };

  const handleScoreChange = (side, add) => () => {
    const scores = recordState[side].scores;
    recordDispatch({ type: 'updateTeamInfo', payload: { scores: scores + add, side } });
  };

  const handleLightChange = (type, add) => () => {
    const origin = recordState[type];
    if (type !== 'outs') {
      recordDispatch({ type: 'updateInFieldingInfo', payload: { [type]: origin + add } });
      return;
    }

    recordDispatch({
      type: 'updateInFieldingInfo',
      payload: {
        strikes: 0,
        balls: 0,
        outs: origin + add,
      },
    });
  };

  const getBattingResultDisplayPlayerIndex = () => {
    let inGameIndex = recordState[currentSide].currentPlayerIndex;
    if (recordState.reviewPlayerIndex !== -1) {
      inGameIndex = recordState.reviewPlayerIndex;
    }
    const currentPlayer = recordState[currentSide].inGamePlayers[inGameIndex];
    if (!currentPlayer.player) {
      return -1;
    }

    const [targetNumber, targetName] = getPlayerNumberName(currentPlayer.player);
    const targetIndex = findIndex(
      (p) => p.number === targetNumber && p.name === targetName,
      recordState[currentSide].players,
    );
    if (targetIndex < 0) {
      return -1;
    }

    return targetIndex;
  };

  const deleteResult = (index) => () => {
    const playerIndex = getBattingResultDisplayPlayerIndex();
    if (playerIndex === -1) {
      return;
    }

    recordState[currentSide].players[playerIndex].records.splice(index, 1);
    recordDispatch({
      type: 'updateTeamInfo',
      payload: { players: recordState[currentSide].players, side: currentSide },
    });
  };

  const editResult = (index) => (e) => {
    const playerIndex = getBattingResultDisplayPlayerIndex();
    if (playerIndex === -1) {
      return;
    }

    recordState[currentSide].players[playerIndex].records[index] = e.target.value;
    recordDispatch({
      type: 'updateTeamInfo',
      payload: { players: recordState[currentSide].players, side: currentSide },
    });
  };

  const setResult = (key) => () => {
    const playerIndex = getBattingResultDisplayPlayerIndex();

    let currentPlayerIndex = recordState[currentSide].currentPlayerIndex;
    if (recordState.reviewPlayerIndex === -1) {
      currentPlayerIndex = currentPlayerIndex === 8 ? 0 : currentPlayerIndex + 1;
    }
    if (playerIndex === -1) {
      recordDispatch({
        type: 'updateTeamInfo',
        payload: { currentPlayerIndex, side: currentSide },
      });
      return;
    }

    recordState[currentSide].players[playerIndex].records.push(key);
    recordDispatch({
      type: 'updateTeamInfo',
      payload: { players: recordState[currentSide].players, currentPlayerIndex, side: currentSide },
    });
  };

  const handleReviewPlayer = (add) => () => {
    const side = recordState.inningFrame === '上' ? 'away' : 'home';
    const currentPlayerIndex = recordState[side].currentPlayerIndex;

    let currentDisplayIndex = currentPlayerIndex;
    if (recordState.reviewPlayerIndex !== -1) {
      currentDisplayIndex = recordState.reviewPlayerIndex;
    }

    let targetIndex = currentDisplayIndex + add;
    if (targetIndex < 0) {
      targetIndex = 8;
    }
    if (targetIndex > 8) {
      targetIndex = 0;
    }

    recordDispatch({
      type: 'updateControlInfo',
      payload: { reviewPlayerIndex: targetIndex === currentPlayerIndex ? -1 : targetIndex },
    });
  };

  const focusCurrentPlayer = () => {
    recordDispatch({ type: 'updateControlInfo', payload: { reviewPlayerIndex: -1 } });
  };

  const fixCurrentPlayer = () => {
    recordDispatch({ type: 'updateControlInfo', payload: { reviewPlayerIndex: -1 } });
    const side = recordState.inningFrame === '上' ? 'away' : 'home';
    recordDispatch({ type: 'updateTeamInfo', payload: { currentPlayerIndex: recordState.reviewPlayerIndex, side } });
  };

  const handleRevert = () => {
    recordDispatch({ type: 'revert' });
  };

  const handleForceUpdate = () => {
    recordDispatch({ type: 'forceBroadcast' });
  };

  const getBatterOrder = () => {
    if (recordState.reviewPlayerIndex !== -1) {
      return recordState.reviewPlayerIndex + 1;
    }

    return recordState[currentSide].currentPlayerIndex + 1;
  };

  return (
    <StyledDiv>
      <div>紀錄代碼：{roomID}</div>
      <div className="section--title">
        <IconButton icon={<ChevronLeftIcon />} size="sm" onClick={handleReviewPlayer(-1)} />
        <div>第 {getBatterOrder()} 棒</div>
        <IconButton icon={<ChevronRightIcon />} size="sm" onClick={handleReviewPlayer(1)} />
      </div>
      <div>
        {recordState.reviewPlayerIndex !== -1 && (
          <>
            <div className="error-msg">注意！正在編輯非場上打者</div>
            <Button width="unset" nowrap mini color="red" onClick={fixCurrentPlayer}>
              設定目前棒次為場上打者
            </Button>
            <Button width="unset" nowrap mini color="blue" onClick={focusCurrentPlayer}>
              編輯場上打者
            </Button>
          </>
        )}
      </div>
      <BattingResult
        players={recordState.inningFrame === '上' ? recordState.away.players : recordState.home.players}
        player={currentBatter}
        deleteResult={deleteResult}
        editResult={editResult}
        setResult={setResult}
      />
      <Divider my="1" borderColor="gray" />
      <div className="section--title around">
        <div>{`${recordState.innings} 局 ${recordState.inningFrame} 半`}</div>
        <div className="section--input-group">
          <Button color="blue" mini onClick={handleInningFrameChange(true)}>
            +
          </Button>
          <div className="gap"></div>
          <Button
            color="transparent"
            mini
            onClick={handleInningFrameChange(false)}
            disabled={recordState.innings === 1 && recordState.inningFrame === '上'}
          >
            -
          </Button>
        </div>
      </div>
      <div className="section--title around">
        <div>{`客隊 ${recordState.away.scores} 分`}</div>
        <div className="section--input-group">
          <Button color="blue" mini onClick={handleScoreChange('away', 1)}>
            +
          </Button>
          <div className="gap"></div>
          <Button
            color="transparent"
            mini
            onClick={handleScoreChange('away', -1)}
            disabled={recordState.away.scores === 0}
          >
            -
          </Button>
        </div>
      </div>
      <div className="section--title around">
        <div>{`主隊 ${recordState.home.scores} 分`}</div>
        <div className="section--input-group">
          <Button color="blue" mini onClick={handleScoreChange('home', 1)}>
            +
          </Button>
          <div className="gap"></div>
          <Button
            color="transparent"
            mini
            onClick={handleScoreChange('home', -1)}
            disabled={recordState.home.scores === 0}
          >
            -
          </Button>
        </div>
      </div>
      <div className="section--title around">
        <div className="section--input-group" onClick={handleBaseChange(0)}>
          <div>一壘</div>
          <Checkbox checked={recordState.bases[0]} />
        </div>
        <div className="section--input-group" onClick={handleBaseChange(1)}>
          <div>二壘</div>
          <Checkbox checked={recordState.bases[1]} />
        </div>
        <div className="section--input-group" onClick={handleBaseChange(2)}>
          <div>三壘</div>
          <Checkbox checked={recordState.bases[2]} />
        </div>
      </div>
      <div className="section--title around">
        <div className="section--title around">
          <div>{`S ${recordState.strikes}`}</div>
          <div className="section--input-group">
            <Button color="blue" mini onClick={handleLightChange('strikes', 1)} disabled={recordState.strikes === 2}>
              +
            </Button>
            <div className="gap"></div>
            <Button
              color="transparent"
              mini
              onClick={handleLightChange('strikes', -1)}
              disabled={recordState.strikes === 0}
            >
              -
            </Button>
          </div>
        </div>
        <div className="section--title around">
          <div>{`B ${recordState.balls}`}</div>
          <div className="section--input-group">
            <Button color="blue" mini onClick={handleLightChange('balls', 1)} disabled={recordState.balls === 3}>
              +
            </Button>
            <div className="gap"></div>
            <Button
              color="transparent"
              mini
              onClick={handleLightChange('balls', -1)}
              disabled={recordState.balls === 0}
            >
              -
            </Button>
          </div>
        </div>
      </div>
      <div className="section--title around">
        <div className="section--title around">
          <div>{`O ${recordState.outs}`}</div>
          <div className="section--input-group">
            <Button color="blue" mini onClick={handleLightChange('outs', 1)} disabled={recordState.outs === 2}>
              +
            </Button>
            <div className="gap"></div>
            <Button color="transparent" mini onClick={handleLightChange('outs', -1)} disabled={recordState.outs === 0}>
              -
            </Button>
          </div>
        </div>
        <div className="section--title around">
          <Button width="unset" nowrap mini color="transparent" onClick={handleRevert}>
            回復上一步
          </Button>
        </div>
      </div>
      <Divider my="1" borderColor="gray" />
      <div className="section--title">
        <LineUp
          handleLineUpPanelDisplay={handleLineUpPanelDisplay}
          teamName={recordState[recordState.editingLineUpSide].name}
          players={recordState[recordState.editingLineUpSide].players}
          inGamePlayers={recordState[recordState.editingLineUpSide].inGamePlayers}
          setInGamePlayer={setInGamePlayer}
        />
        <Registry
          swapAwayHomeTeam={swapAwayHomeTeam}
          awayTeamName={recordState.away.name}
          awayPlayers={recordState.away.players}
          homeTeamName={recordState.home.name}
          homePlayers={recordState.home.players}
          editTeamName={editTeamName}
          addPlayer={addPlayer}
          addPlayers={addPlayers}
          editPlayer={editPlayer}
          removePlayer={removePlayer}
          gotSeasonsData={gotSeasonsData}
          getSeasonTeams={getSeasonTeams}
          getTeamPlayers={getTeamPlayers}
        />
      </div>
      <div className="section--title">
        <Button width="unset" nowrap mini color="transparent" onClick={handleForceUpdate}>
          強制更新至用戶
        </Button>
      </div>
    </StyledDiv>
  );
};

export default Record;
