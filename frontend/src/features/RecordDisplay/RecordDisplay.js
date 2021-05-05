import React, { useEffect, useState } from 'react';
import { findIndex } from 'ramda';
import PrtSC from './components/PrtSC';
import { getPlayerNumberName } from '../Record/Const';

import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 100%;
  height: 90vh;
`;

const RecordDisplay = ({ isSocketConnected, roomID, readOnlyRecord }) => {
  const [startingLineUp, setStartingLineUp] = useState([]);
  const [batterOrder, setBatterOrder] = useState(0);
  const [batterNumber, setBatterNumber] = useState('');
  const [batterName, setBatterName] = useState('');
  const [batterRecords, setBatterRecords] = useState([]);
  const [pitcherName, setPitcherName] = useState('');

  useEffect(() => {
    if (!readOnlyRecord) {
      return;
    }

    const side = readOnlyRecord.inningFrame === '上' ? 'away' : 'home';
    const opponents = side === 'away' ? readOnlyRecord.home : readOnlyRecord.away;
    const team = readOnlyRecord[side];

    const player = team.inGamePlayers[team.currentPlayerIndex];
    const [playerNumber, playerName] = getPlayerNumberName(player.player);
    const playerIndex = findIndex((p) => p.number === playerNumber && p.name === playerName, team.players);

    setStartingLineUp(team.inGamePlayers);
    setBatterOrder(team.currentPlayerIndex + 1);
    setBatterNumber(playerNumber);
    setBatterName(playerName);
    setBatterRecords(team.players?.[playerIndex] ? team.players[playerIndex].records : []);
    setPitcherName(getPlayerNumberName(opponents.inGamePlayers[9].player)[1]);
  }, [readOnlyRecord]);

  return (
    <StyledDiv>
      <div>
        紀錄代碼：{roomID}
        {!isSocketConnected && `（斷線重新連線中...）`}
      </div>
      {!readOnlyRecord ? (
        <div>等待 10 秒後仍無紀錄代表無此房間</div>
      ) : (
        <PrtSC
          startingLineUp={startingLineUp}
          awayTeamName={readOnlyRecord.away.name}
          awayPlayers={readOnlyRecord.away.players}
          homeTeamName={readOnlyRecord.home.name}
          homePlayers={readOnlyRecord.home.players}
          strikes={readOnlyRecord.strikes}
          balls={readOnlyRecord.balls}
          outs={readOnlyRecord.outs}
          bases={readOnlyRecord.bases}
          innings={readOnlyRecord.innings}
          inningFrame={readOnlyRecord.inningFrame}
          awayScores={readOnlyRecord.away.scores}
          homeScores={readOnlyRecord.home.scores}
          batterOrder={batterOrder}
          batterNumber={batterNumber}
          batterName={batterName}
          batterRecords={batterRecords}
          pitcherName={pitcherName}
        />
      )}
    </StyledDiv>
  );
};

export default RecordDisplay;
