import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Center, Divider, Flex, IconButton, InputLeftAddon, Text } from '@chakra-ui/react';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { FormControl, FormLabel, Switch, InputGroup, Input, InputRightAddon } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { find, findIndex } from 'ramda';
import LineUp from './components/LineUp';
import PrtSC from './components/PrtSC';
import Registry from './components/Registry';
import BattingResult from './components/BattingResult';
import { debugPlayers, debugInGamePlayers } from './Const';

const debugMode = true;

const Record = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [awayTeamName, setAwayTeamName] = useState('尚未設定');
  const [awayPlayers, setAwayPlayers] = useState(debugMode ? debugPlayers : []);
  const [awayInGamePlayers, setAwayInGamePlayers] = useState(
    debugMode ? debugInGamePlayers : Array.from({ length: 10 }, () => ({})),
  );
  const [awayCurrentPlayerIndex, setAwayCurrentPlayerIndex] = useState(0);

  const [homeTeamName, setHomeTeamName] = useState('尚未設定');
  const [homePlayers, setHomePlayers] = useState([]);
  const [homeInGamePlayers, setHomeInGamePlayers] = useState(Array.from({ length: 10 }, () => ({})));
  const [homeCurrentPlayerIndex, setHomeCurrentPlayerIndex] = useState(0);

  const [reviewPlayerIndex, setReviewPlayerIndex] = useState(-1);

  const [displayLineUpPanel, setDisplayLineUpPanel] = useState(false);
  const [editingTeamName, setEditingTeamName] = useState('');
  const [editingPlayers, setEditingPlayers] = useState([]);
  const [editingInGamePlayers, setEditingInGamePlayers] = useState([]);
  const [editingSide, setEditingSide] = useState('');

  const [startingLineUp, setStartingLineUp] = useState([]);
  const [strikes, setStrikes] = useState(0);
  const [balls, setBalls] = useState(0);
  const [outs, setOuts] = useState(0);
  const [bases, setBases] = useState([false, false, false]);
  const [innings, setInnings] = useState(1);
  const [inningFrame, setInningFrame] = useState('上');
  const [awayScores, setAwayScores] = useState(0);
  const [homeScores, setHomeScores] = useState(0);

  const [batterOrder, setBatterOrder] = useState('-');
  const [batterNumber, setBatterNumber] = useState('-');
  const [batterName, setBatterName] = useState('-');
  const [batterRecords, setBatterRecords] = useState([]);

  const [isReverse, setIsReverse] = useState(false);

  const overrideLocalStorage = () => {
    const data = {
      awayTeamName,
      awayPlayers,
      awayInGamePlayers,
      awayCurrentPlayerIndex,
      homeTeamName,
      homePlayers,
      homeInGamePlayers,
      homeCurrentPlayerIndex,
      reviewPlayerIndex,
      startingLineUp,
      strikes,
      balls,
      outs,
      bases,
      innings,
      inningFrame,
      awayScores,
      homeScores,
      batterOrder,
      batterNumber,
      batterName,
      batterRecords,
    };
    window.localStorage.setItem('baseball-record-live', JSON.stringify(data));
  };

  const readLocalStorage = () => {
    const dataString = window.localStorage.getItem('baseball-record-live');
    if (!dataString) {
      return;
    }

    const data = JSON.parse(dataString);
    if (!data.awayTeamName) {
      return;
    }

    setAwayTeamName(data.awayTeamName);
    setAwayPlayers(data.awayPlayers);
    setAwayInGamePlayers(data.awayInGamePlayers);
    setAwayCurrentPlayerIndex(data.awayCurrentPlayerIndex);
    setHomeTeamName(data.homeTeamName);
    setHomePlayers(data.homePlayers);
    setHomeInGamePlayers(data.homeInGamePlayers);
    setHomeCurrentPlayerIndex(data.homeCurrentPlayerIndex);
    setReviewPlayerIndex(data.reviewPlayerIndex);
    setStartingLineUp(data.startingLineUp);
    setStrikes(data.strikes);
    setBalls(data.balls);
    setOuts(data.outs);
    setBases(data.bases);
    setInnings(data.innings);
    setInningFrame(data.inningFrame);
    setAwayScores(data.awayScores);
    setHomeScores(data.homeScores);
    setBatterOrder(data.batterOrder);
    setBatterNumber(data.batterNumber);
    setBatterName(data.batterName);
    setBatterRecords(data.batterRecords);
  };

  const handleNumberKeyReverse = useCallback(
    (event) => {
      const code = event.code;
      switch (code) {
        case 'Numpad7':
          if (inningFrame === '下') {
            setInningFrame('上');
            break;
          }
          setInningFrame('下');
          if (innings > 1) {
            setInnings(innings - 1);
          }
          break;
        case 'Numpad8':
          if (awayScores > 0) {
            setAwayScores(awayScores - 1);
          }
          break;
        case 'Numpad9':
          if (homeScores > 0) {
            setHomeScores(homeScores - 1);
          }
          break;
        case 'Numpad1':
          if (strikes > 0) {
            setStrikes(strikes - 1);
          }
          break;
        case 'Numpad2':
          if (balls > 0) {
            setBalls(balls - 1);
          }
          break;
        case 'Numpad3':
          if (outs > 0) {
            setOuts(outs - 1);
          }
          break;
        case 'NumpadSubtract':
          setIsReverse(!isReverse);
          break;
        default:
          break;
      }
    },
    [awayScores, balls, homeScores, inningFrame, innings, isReverse, outs, strikes],
  );

  const handleNumberKeyDown = useCallback(
    (event) => {
      const currentActive = document.activeElement;
      if (isRegistering || currentActive.tagName.toUpperCase() === 'INPUT') {
        return;
      }

      const code = event.code;
      if (isReverse) {
        return handleNumberKeyReverse(event);
      }
      switch (code) {
        case 'Numpad7':
          setStrikes(0);
          setBalls(0);
          setOuts(0);
          setBases([false, false, false]);
          if (inningFrame === '上') {
            setInningFrame('下');
            break;
          }
          setInningFrame('上');
          setInnings(innings + 1);
          break;
        case 'Numpad8':
          setAwayScores(awayScores + 1);
          break;
        case 'Numpad9':
          setHomeScores(homeScores + 1);
          break;
        case 'Numpad4':
          bases[0] = !bases[0];
          setBases(bases.slice(0));
          break;
        case 'Numpad5':
          bases[1] = !bases[1];
          setBases(bases.slice(0));
          break;
        case 'Numpad6':
          bases[2] = !bases[2];
          setBases(bases.slice(0));
          break;
        case 'Numpad1':
          if (strikes < 2) {
            setStrikes(strikes + 1);
            break;
          }
          setStrikes(0);
          setBalls(0);
          handleNumberKeyDown({ code: 'Numpad3' });
          break;
        case 'Numpad2':
          if (balls < 3) {
            setBalls(balls + 1);
            break;
          }
          setStrikes(0);
          setBalls(0);
          let addRunnerBase = 0;
          while (bases[addRunnerBase]) {
            addRunnerBase++;
          }
          if (addRunnerBase < 3) {
            bases[addRunnerBase] = true;
            setBases(bases.slice(0));
            break;
          }
          if (inningFrame === '上') {
            setAwayScores(awayScores + 1);
          } else {
            setHomeScores(homeScores + 1);
          }
          break;
        case 'Numpad3':
          setStrikes(0);
          setBalls(0);
          if (outs < 2) {
            setOuts(outs + 1);
            break;
          }
          handleNumberKeyDown({ code: 'Numpad7' });
          break;
        case 'NumpadSubtract':
          setIsReverse(!isReverse);
          break;
        default:
          break;
      }
    },
    [
      awayScores,
      balls,
      bases,
      handleNumberKeyReverse,
      homeScores,
      inningFrame,
      innings,
      isRegistering,
      isReverse,
      outs,
      strikes,
    ],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleNumberKeyDown);
    return () => window.removeEventListener('keydown', handleNumberKeyDown);
  }, [handleNumberKeyDown]);

  const swapAwayHomeTeam = () => {
    setAwayTeamName(homeTeamName);
    setAwayPlayers(homePlayers);
    setAwayInGamePlayers(homeInGamePlayers);

    setHomeTeamName(awayTeamName);
    setHomePlayers(awayPlayers);
    setHomeInGamePlayers(awayInGamePlayers);
  };

  const editTeamName = ({ side, name }) => {
    if (side.toUpperCase() === 'AWAY') {
      setAwayTeamName(name);
      return;
    }

    setHomeTeamName(name);
  };

  const addPlayer = ({ side, number, name }) => {
    if (side.toUpperCase() === 'AWAY') {
      awayPlayers.push({
        number,
        name,
        records: [],
      });
      setAwayPlayers(awayPlayers.slice(0));
      return;
    }

    homePlayers.push({
      number,
      name,
      records: [],
    });
    setHomePlayers(homePlayers.slice(0));
  };

  const editPlayer = ({ side, index, number, name }) => {
    if (side.toUpperCase() === 'AWAY') {
      awayPlayers[index] = {
        ...awayPlayers[index],
        number,
        name,
      };
      setAwayPlayers(awayPlayers.slice(0));
      return;
    }

    homePlayers[index] = {
      ...homePlayers[index],
      number,
      name,
    };
    setHomePlayers(homePlayers.slice(0));
  };

  const removePlayer = ({ side, index }) => () => {
    if (side.toUpperCase() === 'AWAY') {
      awayPlayers.splice(index, 1);
      setAwayPlayers(awayPlayers.slice(0));
    }

    homePlayers.splice(index, 1);
    setHomePlayers(homePlayers.slice(0));
  };

  const handleLineUpDisplay = (side) => () => {
    if (side.toUpperCase() === 'AWAY') {
      setStartingLineUp(awayInGamePlayers);
      return;
    }

    setStartingLineUp(homeInGamePlayers);
  };

  const handleLineUpPanelDisplay = (side) => () => {
    window.document.getElementById('control-panel').scrollTo({ top: 0 });
    setDisplayLineUpPanel(true);
    if (side.toUpperCase() === 'AWAY') {
      setEditingSide('away');
      setEditingTeamName(awayTeamName);
      setEditingPlayers(awayPlayers);
      setEditingInGamePlayers(awayInGamePlayers);
      return;
    }

    setEditingSide('home');
    setEditingTeamName(homeTeamName);
    setEditingPlayers(homePlayers);
    setEditingInGamePlayers(homeInGamePlayers);
  };

  const handleCloseLineUpPanel = () => {
    setDisplayLineUpPanel(false);
  };

  const setInGamePlayer = (key, editIndex) => (e) => {
    const value = e.target.value;
    if (editingSide.toUpperCase() === 'AWAY') {
      awayInGamePlayers[editIndex][key] = value;
      setAwayInGamePlayers(awayInGamePlayers.slice(0));
      return;
    }

    homeInGamePlayers[editIndex][key] = value;
    setHomeInGamePlayers(homeInGamePlayers.slice(0));
  };

  const handleStrikeBar = (number) => {
    setStrikes(number);
  };

  const handleBallBar = (number) => {
    setBalls(number);
  };

  const handleOutBar = (number) => {
    setOuts(number);
  };

  const handleBaseChange = (index) => () => {
    bases[index] = !bases[index];
    setBases(bases.slice(0));
  };

  const handleInningsChange = (e) => {
    const value = parseInt(e.target.value);
    setInnings(Number.isNaN(value) ? 0 : value);
  };

  const handleInningFrameChange = () => {
    if (inningFrame === '上') {
      setInningFrame('下');
      return;
    }
    setInningFrame('上');
  };

  const handleAwayScoreChange = (e) => {
    const value = parseInt(e.target.value);
    setAwayScores(Number.isNaN(value) ? 0 : value);
  };

  const handleHomeScoreChange = (e) => {
    const value = parseInt(e.target.value);
    setHomeScores(Number.isNaN(value) ? 0 : value);
  };

  const getBattingResultDisplayPlayer = () => {
    const data = {
      players: [],
      playerIndex: -1,
      settingFunction: null,
    };
    if (inningFrame === '上') {
      const currentPlayer = awayInGamePlayers[reviewPlayerIndex === -1 ? awayCurrentPlayerIndex : reviewPlayerIndex];
      if (!currentPlayer.player) {
        return data;
      }

      const targetNumber = currentPlayer.player.split(';')[0];
      const targetName = currentPlayer.player.split(';')[1];
      const targetIndex = findIndex((p) => p.number === targetNumber && p.name === targetName, awayPlayers);
      if (targetIndex < 0) {
        return data;
      }

      return {
        players: awayPlayers,
        playerIndex: targetIndex,
        settingFunction: setAwayPlayers,
      };
    }

    const currentPlayer = homeInGamePlayers[reviewPlayerIndex === -1 ? homeCurrentPlayerIndex : reviewPlayerIndex];
    if (!currentPlayer.player) {
      return data;
    }

    const targetNumber = currentPlayer.player.split(';')[0];
    const targetName = currentPlayer.player.split(';')[1];
    const targetIndex = findIndex((p) => p.number === targetNumber && p.name === targetName, homePlayers);
    if (targetIndex < 0) {
      return data;
    }

    return {
      players: homePlayers,
      playerIndex: targetIndex,
      settingFunction: setHomePlayers,
    };
  };

  const deleteResult = (index) => () => {
    const { players, playerIndex, settingFunction } = getBattingResultDisplayPlayer();
    players[playerIndex].records.splice(index, 1);
    settingFunction(players.slice(0));
  };

  const editResult = (index) => (e) => {
    const { players, playerIndex, settingFunction } = getBattingResultDisplayPlayer();
    players[playerIndex].records[index] = e.target.value;
    settingFunction(players.slice(0));
  };

  const setResult = (key) => () => {
    const { players, playerIndex, settingFunction } = getBattingResultDisplayPlayer();
    players[playerIndex].records.push(key);
    settingFunction(players.slice(0));

    if (reviewPlayerIndex !== -1) {
      return;
    }

    if (inningFrame === '上') {
      setAwayCurrentPlayerIndex(awayCurrentPlayerIndex === 8 ? 0 : awayCurrentPlayerIndex + 1);
      return;
    }
    setHomeCurrentPlayerIndex(homeCurrentPlayerIndex === 8 ? 0 : homeCurrentPlayerIndex + 1);
  };

  const handleReviewPlayer = (value) => () => {
    let currentPlayingIndex = inningFrame === '上' ? awayCurrentPlayerIndex : homeCurrentPlayerIndex;

    let currentDisplayIndex = currentPlayingIndex;
    if (reviewPlayerIndex !== -1) {
      currentDisplayIndex = reviewPlayerIndex;
    }

    let targetIndex = currentDisplayIndex + value;
    if (targetIndex < 0) {
      targetIndex = 8;
    }
    if (targetIndex > 8) {
      targetIndex = 0;
    }

    if (targetIndex === currentPlayingIndex) {
      setReviewPlayerIndex(-1);
      return;
    }

    setReviewPlayerIndex(targetIndex);
  };

  const focusCurrentPlayer = () => {
    setReviewPlayerIndex(-1);
  };

  const fixCurrentPlayer = () => {
    setReviewPlayerIndex(-1);
    if (inningFrame === '上') {
      setAwayCurrentPlayerIndex(reviewPlayerIndex);
      return;
    }
    setHomeCurrentPlayerIndex(reviewPlayerIndex);
  };

  useEffect(() => {
    setBatterOrder('-');
    setBatterName('-');
    setBatterNumber('-');
    setBatterRecords([]);

    if (inningFrame === '上') {
      const currentPlayer = awayInGamePlayers[awayCurrentPlayerIndex];
      if (!currentPlayer.player) {
        return;
      }

      const targetNumber = currentPlayer.player.split(';')[0];
      const targetName = currentPlayer.player.split(';')[1];
      const target = find((p) => p.number === targetNumber && p.name === targetName, awayPlayers);
      if (!target) {
        return;
      }

      setBatterOrder((awayCurrentPlayerIndex + 1).toString());
      setBatterName(targetName);
      setBatterNumber(targetNumber);
      setBatterRecords(target.records);
      return;
    }

    const currentPlayer = homeInGamePlayers[homeCurrentPlayerIndex];
    if (!currentPlayer.player) {
      return;
    }

    const targetNumber = currentPlayer.player.split(';')[0];
    const targetName = currentPlayer.player.split(';')[1];
    const target = find((p) => p.number === targetNumber && p.name === targetName, homePlayers);
    if (!target) {
      return;
    }

    setBatterOrder((homeCurrentPlayerIndex + 1).toString());
    setBatterName(targetName);
    setBatterNumber(targetNumber);
    setBatterRecords(target.records);
  }, [
    awayCurrentPlayerIndex,
    awayInGamePlayers,
    awayPlayers,
    homeCurrentPlayerIndex,
    homeInGamePlayers,
    homePlayers,
    inningFrame,
  ]);

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Box w="720px">
        <Box w="100%" h="480px" mb="5">
          <PrtSC
            startingLineUp={startingLineUp}
            awayTeamName={awayTeamName}
            awayPlayers={awayPlayers}
            homeTeamName={homeTeamName}
            homePlayers={homePlayers}
            strikes={strikes}
            balls={balls}
            outs={outs}
            bases={bases}
            innings={innings}
            inningFrame={inningFrame}
            awayScores={awayScores}
            homeScores={homeScores}
            batterOrder={batterOrder}
            batterNumber={batterNumber}
            batterName={batterName}
            batterRecords={batterRecords}
          />
        </Box>
        <Box id="control-panel" w="100%" h="calc(95vh - 480px)" overflowY="scroll">
          {displayLineUpPanel && (
            <>
              <Flex justifyContent="space-between" my="1">
                <Text>{editingTeamName} 打序</Text>
                <Button size="sm" onClick={handleCloseLineUpPanel}>
                  關閉
                </Button>
              </Flex>
              <LineUp players={editingPlayers} inGamePlayers={editingInGamePlayers} setInGamePlayer={setInGamePlayer} />
            </>
          )}
          <Flex>
            <Text>
              第{' '}
              {inningFrame === '上'
                ? (reviewPlayerIndex === -1 ? awayCurrentPlayerIndex : reviewPlayerIndex) + 1
                : (reviewPlayerIndex === -1 ? homeCurrentPlayerIndex : reviewPlayerIndex) + 1}{' '}
              棒
            </Text>
            {reviewPlayerIndex !== -1 && (
              <>
                <Text color="red.500">注意！正在編輯非場上打者</Text>
                <Button size="xs" onClick={focusCurrentPlayer}>
                  編輯場上打者
                </Button>
                <Button size="xs" ml="10" onClick={fixCurrentPlayer}>
                  設定目前棒次為場上打者（截圖區會跟著改變）
                </Button>
              </>
            )}
          </Flex>
          <Flex alignItems="center">
            <IconButton icon={<ChevronLeftIcon />} size="sm" onClick={handleReviewPlayer(-1)} />
            <BattingResult
              players={inningFrame === '上' ? awayPlayers : homePlayers}
              player={
                inningFrame === '上'
                  ? awayInGamePlayers[reviewPlayerIndex === -1 ? awayCurrentPlayerIndex : reviewPlayerIndex]
                  : homeInGamePlayers[reviewPlayerIndex === -1 ? homeCurrentPlayerIndex : reviewPlayerIndex]
              }
              deleteResult={deleteResult}
              editResult={editResult}
              setResult={setResult}
            />
            <IconButton icon={<ChevronRightIcon />} size="sm" onClick={handleReviewPlayer(1)} />
          </Flex>
          <Divider my="1" borderColor="gray" />
          <Box mb="5">
            {isReverse && (
              <Text fontSize="sm" color="red.500">
                ！！！數字快捷開啟倒扣模式！！！
              </Text>
            )}
            <Text fontSize="xs">
              * 數字鍵 7 換半局，清除壘包球數資訊，下半會加一局；數字鍵 8 9 分別加客/主隊分數（數字鍵盤 -
              會轉為倒扣，連動影響無法還原）
            </Text>
            <Flex>
              <InputGroup size="sm">
                <Input borderRadius="0" type="number" onChange={handleInningsChange} value={innings} />
                <InputRightAddon children="局" />
              </InputGroup>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" mr="2">
                  上
                </FormLabel>
                <Switch isChecked={inningFrame === '下'} size="sm" onChange={handleInningFrameChange} />
                <FormLabel mb="0" mr="0" ml="2">
                  下
                </FormLabel>
              </FormControl>
              <InputGroup size="sm">
                <InputLeftAddon children="客隊" />
                <Input borderRadius="0" type="number" onChange={handleAwayScoreChange} value={awayScores} />
                <InputRightAddon children="分" />
              </InputGroup>
              <InputGroup size="sm">
                <InputLeftAddon children="主隊" />
                <Input borderRadius="0" type="number" onChange={handleHomeScoreChange} value={homeScores} />
                <InputRightAddon children="分" />
              </InputGroup>
            </Flex>
          </Box>
          <Box mb="5">
            <Text fontSize="xs">* 數字鍵 4 5 6 分別切換一壘、二壘、三壘的跑者資訊</Text>
            <Flex>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="first-base" mb="0">
                  一壘有人
                </FormLabel>
                <Switch id="first-base" isChecked={bases[0]} size="sm" onChange={handleBaseChange(0)} />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="second-base" mb="0">
                  二壘有人
                </FormLabel>
                <Switch id="second-base" isChecked={bases[1]} size="sm" onChange={handleBaseChange(1)} />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="third-base" mb="0">
                  三壘有人
                </FormLabel>
                <Switch id="third-base" isChecked={bases[2]} size="sm" onChange={handleBaseChange(2)} />
              </FormControl>
            </Flex>
          </Box>
          <Box mb="5">
            <Text fontSize="xs">
              * 數字鍵 1 2 3 分別增加 S B O（數字鍵盤 - 會轉為倒扣，連動影響無法還原），S B O 超過後會自動計算對應動作
            </Text>
            <Flex>
              <Flex mx="5">
                <Center mr="5">S</Center>
                <Slider size="md" value={strikes} min={0} max={2} w="8vw" onChange={handleStrikeBar}>
                  <SliderTrack bg="gray.300">
                    <SliderFilledTrack bg="yellow.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={6}>
                    <Text>S</Text>
                  </SliderThumb>
                </Slider>
              </Flex>
              <Flex mx="5">
                <Center mr="5">B</Center>
                <Slider size="md" value={balls} min={0} max={3} w="8vw" onChange={handleBallBar}>
                  <SliderTrack bg="gray.300">
                    <SliderFilledTrack bg="green.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={6}>
                    <Text>B</Text>
                  </SliderThumb>
                </Slider>
              </Flex>
              <Flex mx="5">
                <Center mr="5">O</Center>
                <Slider size="md" value={outs} min={0} max={2} w="8vw" onChange={handleOutBar}>
                  <SliderTrack bg="gray.300">
                    <SliderFilledTrack bg="red.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={6}>
                    <Text>O</Text>
                  </SliderThumb>
                </Slider>
              </Flex>
            </Flex>
          </Box>
          <Flex>
            <Button onClick={handleLineUpDisplay('away')} size="sm">
              客場打序
            </Button>
            <Button onClick={handleLineUpDisplay('home')} size="sm">
              主場打序
            </Button>
          </Flex>
          <Divider my="1" borderColor="gray" />
          <Flex justifyContent="space-between">
            <Flex>
              <Button onClick={handleLineUpPanelDisplay('away')} size="sm">
                編輯客場打序
              </Button>
              <Button onClick={handleLineUpPanelDisplay('home')} size="sm">
                編輯主場打序
              </Button>
            </Flex>
            <Registry
              setIsRegistering={setIsRegistering}
              swapAwayHomeTeam={swapAwayHomeTeam}
              awayTeamName={awayTeamName}
              awayPlayers={awayPlayers}
              homeTeamName={homeTeamName}
              homePlayers={homePlayers}
              editTeamName={editTeamName}
              addPlayer={addPlayer}
              editPlayer={editPlayer}
              removePlayer={removePlayer}
            />
            <Flex>
              <Button size="xs" onClick={overrideLocalStorage}>
                覆寫暫存
              </Button>
              <Button size="xs" onClick={readLocalStorage}>
                讀取暫存
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default Record;
