import React, { useEffect, useState } from 'react';
import { CloseButton } from '@chakra-ui/react';
import { find } from 'ramda';
import styled from 'styled-components';
import { BATTING_RESULT_LIST, getPlayerNumberName } from '../Const';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  .pre-records {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 0.5rem;
    > .box {
      position: relative;
      padding: 0.5rem;
      background-color: #bcbcbc;
    }
  }

  .current-result-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    padding: 0.5rem;
  }
`;

const StyledSelect = styled.select`
  background-color: ${(props) => props.color};
  ${(props) => props.color !== 'yellow' && 'color: white;'}
`;

const Button = styled.button`
  background-color: ${(props) => props.color};
  ${(props) => props.color !== 'yellow' && 'color: white;'}
  border-radius: 2px;
  padding: 0.5rem;
`;

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
      const [targetNumber, targetName] = getPlayerNumberName(player.player);
      const target = find((p) => p.number === targetNumber && p.name === targetName, players);
      if (target) {
        init = target;
      }
    }

    setNumber(init.number);
    setName(init.name);
    setRecords(init.records);
  }, [player.player, players]);

  return (
    <StyledDiv>
      <div>{`${number} ${name}`}</div>
      <div className="pre-records">
        {records.map((r, index) => (
          <div key={`${r}-${index}`} className="box">
            <div>第 {index + 1} 次</div>
            <StyledSelect value={r} onChange={editResult(index)} color={BATTING_RESULT_LIST[r].color}>
              {Object.keys(BATTING_RESULT_LIST).map((key) => (
                <option key={key} value={key}>
                  {BATTING_RESULT_LIST[key].display}
                </option>
              ))}
            </StyledSelect>
            <CloseButton position="absolute" top="0" right="0" size="sm" onClick={deleteResult(index)} />
          </div>
        ))}
      </div>
      <div>這次打擊結果</div>
      <div className="current-result-list">
        {Object.keys(BATTING_RESULT_LIST).map((key) => (
          <Button key={key} color={BATTING_RESULT_LIST[key].color} onClick={setResult(key)}>
            {BATTING_RESULT_LIST[key].display}
          </Button>
        ))}
      </div>
    </StyledDiv>
  );
};

export default BattingResult;
