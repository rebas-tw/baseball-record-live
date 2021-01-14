import React, { useEffect, useState } from 'react';
import { Box, Button, Center, Flex, Select, SimpleGrid, Text, CloseButton } from '@chakra-ui/react';
import { find } from 'ramda';
import { BATTING_RESULT_LIST } from '../Const';

const BattingResult = ({ players, player, deleteResult, editResult, setResult }) => {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    let init = {
      number: '',
      name: '',
      records: [],
    };
    if (player.player && players) {
      const targetNumber = player.player.split(';')[0];
      const targetName = player.player.split(';')[1];
      const target = find((p) => p.number === targetNumber && p.name === targetName, players);
      if (target) {
        init = target;
      }
    }

    setNumber(init.number);
    setName(init.name);
    setRecords(init.records);
  }, [player, players]);

  return (
    <Flex w="100%">
      <Box w="50%">
        <Text>
          打者：{number} {name}
        </Text>
        <SimpleGrid columns="3" gap="2">
          {records.map((r, index) => (
            <Center key={`${r}-${index}`} position="relative" pt="5" pr="5" pl="1" pb="1" bg="gray.200">
              <Text position="absolute" top="1" left="1" fontSize="xs">
                第 {index + 1} 次
              </Text>
              <CloseButton position="absolute" top="0" right="0" size="sm" onClick={deleteResult(index)} />
              <Select value={r} onChange={editResult(index)} size="sm" bg={`${BATTING_RESULT_LIST[r].color}.500`}>
                {Object.keys(BATTING_RESULT_LIST).map((key) => (
                  <option key={key} value={key}>
                    {BATTING_RESULT_LIST[key].display}
                  </option>
                ))}
              </Select>
            </Center>
          ))}
        </SimpleGrid>
      </Box>
      <Box w="50%">
        <Text>這次打擊結果</Text>
        <SimpleGrid columns="4" gap="2">
          {Object.keys(BATTING_RESULT_LIST).map((key) => (
            <Center key={key}>
              <Button colorScheme={BATTING_RESULT_LIST[key].color} onClick={setResult(key)} size="sm">
                {BATTING_RESULT_LIST[key].display}
              </Button>
            </Center>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default BattingResult;
