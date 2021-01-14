import React from 'react';
import { Box, Flex, Select, Text } from '@chakra-ui/react';

const POSITIONS = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'P'];

const LineUp = ({ players, inGamePlayers, setInGamePlayer }) => {
  return (
    <Box my="2">
      {inGamePlayers.map((inGamePlayer, index) => (
        <Flex key={`${index}-${inGamePlayer?.player ? `${inGamePlayer.player}-${inGamePlayer.position}` : ''}`}>
          <Text w="10%" textAlign="center">
            {index === 9 ? 'P' : index + 1}
          </Text>
          <Select
            w="70%"
            placeholder="選擇選手"
            value={inGamePlayer?.player ? inGamePlayer.player : ''}
            onChange={setInGamePlayer('player', index)}
            size="sm"
          >
            {players.map((player) => (
              <option
                key={`${player.number}-${player.name}`}
                value={`${player.number};${player.name}`}
              >{`${player.number} ${player.name}`}</option>
            ))}
          </Select>
          <Select
            w="20%"
            placeholder="守位"
            value={inGamePlayer?.position ? inGamePlayer.position : ''}
            onChange={setInGamePlayer('position', index)}
            size="sm"
          >
            {POSITIONS.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </Select>
        </Flex>
      ))}
    </Box>
  );
};

export default LineUp;
