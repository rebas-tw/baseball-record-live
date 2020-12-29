import React, { useState } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import LineUp from './components/LineUp';
import PrtSC from './components/PrtSC';
import Registry from './components/Registry';
import { debugPlayers, debugInGamePlayers } from './Const';

const debugMode = true;

const Record = () => {
  const [awayTeamName, setAwayTeamName] = useState('尚未設定');
  const [awayPlayers, setAwayPlayers] = useState(debugMode ? debugPlayers : []);
  const [awayInGamePlayers, setAwayInGamePlayers] = useState(
    debugMode ? debugInGamePlayers : Array.from({ length: 10 }, () => ({})),
  );

  const [homeTeamName, setHomeTeamName] = useState('尚未設定');
  const [homePlayers, setHomePlayers] = useState([]);
  const [homeInGamePlayers, setHomeInGamePlayers] = useState(Array.from({ length: 10 }, () => ({})));

  const [displayLineUpPanel, setDisplayLineUpPanel] = useState(false);
  const [editingTeamName, setEditingTeamName] = useState('');
  const [editingPlayers, setEditingPlayers] = useState([]);
  const [editingInGamePlayers, setEditingInGamePlayers] = useState([]);
  const [editingSide, setEditingSide] = useState('');

  const [displayStartingLineUp, setDisplayStartingLineUp] = useState(false);
  const [startingLineUp, setStartingLineUp] = useState([]);

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
    setDisplayStartingLineUp(!displayStartingLineUp);
    if (side.toUpperCase() === 'AWAY') {
      setStartingLineUp(awayInGamePlayers);
      return;
    }

    setStartingLineUp(homeInGamePlayers);
  };

  const handleLineUpPanelDisplay = (side) => () => {
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

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Box w="720px">
        <Box w="100%" h="640px">
          <PrtSC
            displayStartingLineUp={displayStartingLineUp}
            startingLineUp={startingLineUp}
            awayTeamName={awayTeamName}
            awayPlayers={awayPlayers}
            homeTeamName={homeTeamName}
            homePlayers={homePlayers}
          />
        </Box>
        <Box w="100%" h="calc(95vh - 640px)" overflowY="scroll">
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
            <Button onClick={handleLineUpDisplay('away')}>{displayStartingLineUp ? '隱藏' : '顯示'}客場打序</Button>
            <Button onClick={handleLineUpDisplay('home')}>{displayStartingLineUp ? '隱藏' : '顯示'}主場打序</Button>
          </Flex>
          <Flex>
            <Button onClick={handleLineUpPanelDisplay('away')}>編輯客場打序</Button>
            <Button onClick={handleLineUpPanelDisplay('home')}>編輯主場打序</Button>
            <Registry
              awayTeamName={awayTeamName}
              awayPlayers={awayPlayers}
              homeTeamName={homeTeamName}
              homePlayers={homePlayers}
              editTeamName={editTeamName}
              addPlayer={addPlayer}
              editPlayer={editPlayer}
              removePlayer={removePlayer}
            />
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default Record;
