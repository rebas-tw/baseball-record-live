import React from 'react';
import { Box } from '@chakra-ui/react';
import styled from 'styled-components';
import { filter } from 'ramda';

const StyledTable = styled.table`
  width: 240px;
  display: ${({ display }) => display};
  text-align: center;
  background-color: #fafafa;
  th {
    overflow: hidden;
    white-space: nowrap;
  }
  tr {
    border-bottom: 1px solid #aaaaaa;
    border-top: 1px solid #aaaaaa;
    border-collapse: collapse;
    line-height: 30px;
  }
`;

const PrtSC = ({ displayStartingLineUp, startingLineUp, awayTeamName, homeTeamName }) => {
  return (
    <Box borderWidth="10px" borderColor="red.500" w="100%" h="100%" overflow="hidden">
      <StyledTable display={displayStartingLineUp ? 'block' : 'none'}>
        <thead style={{ width: '240px' }}>
          <tr style={{ width: '240px' }}>
            <th style={{ width: '24px' }}></th>
            <th style={{ width: '48px' }}>背號</th>
            <th style={{ width: '120px' }}>球員</th>
            <th style={{ width: '48px' }}>守位</th>
          </tr>
        </thead>
        <tbody>
          {filter((p) => p.player, startingLineUp).map((player, index) => (
            <tr>
              <td>{index === 9 ? '' : index + 1}</td>
              <td>{player.player.split(';')[0]}</td>
              <td>{player.player.split(';')[1]}</td>
              <td>{player.position}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Box>
  );
};

export default PrtSC;
