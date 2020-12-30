import React from 'react';
import styled from 'styled-components';
import { filter, reverse } from 'ramda';

const StyledPrtSC = styled.div`
  width: 100%;
  height: 100%;
  border: 10px solid red;
  overflow: hidden;
  .horiDiv {
    display: flex;
  }
`;

const StyledTable = styled.table`
  width: 240px;
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

const InfoBoard = styled.div`
  width: 240px;
  height: 100px;
  background-color: black;
  font-size: 14px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  p {
    margin: 0;
    padding: 1px 0;
    overflow: hidden;
  }
  .teams {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    text-align: center;
    width: 160px;
    height: 70px;
    &--name {
      width: 130px;
    }
    &--score {
      width: 30px;
    }
  }
  .bases {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 80px;
    padding: 15px 6px 6px;
    &--inning {
      position: absolute;
      left: auto;
      right: auto;
      bottom: 0;
    }
  }
  .sbo {
    display: flex;
    justify-content: space-evenly;
  }
`;

const Base = styled.div`
  width: 15px;
  height: 15px;
  transform: rotate(45deg);
  background-color: ${({ runnerOnBase }) => (runnerOnBase ? 'orange' : 'white')};
  margin: ${({ index }) => (index === 1 ? '1px 1px 18px 1px' : '18px 1px 1px 1px')};
`;

const PrtSC = ({
  startingLineUp,
  strikes,
  balls,
  outs,
  bases,
  innings,
  inningFrame,
  awayTeamName,
  homeTeamName,
  awayScores,
  homeScores,
}) => {
  return (
    <StyledPrtSC>
      <div className="horiDiv">
        <StyledTable>
          <thead style={{ width: '240px' }}>
            <tr style={{ width: '240px' }}>
              <th style={{ width: '36px' }}></th>
              <th style={{ width: '48px' }}>背號</th>
              <th style={{ width: '108px' }}>球員</th>
              <th style={{ width: '48px' }}>守位</th>
            </tr>
          </thead>
          <tbody>
            {filter((p) => p.player, startingLineUp).map((player, index) => (
              <tr key={`${player.player}-${index}`}>
                <td>{index === 9 ? '' : index + 1}</td>
                <td>{player.player.split(';')[0]}</td>
                <td>{player.player.split(';')[1]}</td>
                <td>{player.position}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
        <InfoBoard>
          <div className="horiDiv">
            <div className="teams">
              <div className="horiDiv">
                <p className="teams--name">{awayTeamName}</p>
                <p className="teams--score">{awayScores}</p>
              </div>
              <div className="horiDiv">
                <p className="teams--name">{homeTeamName}</p>
                <p className="teams--score">{homeScores}</p>
              </div>
            </div>
            <div className="bases">
              <div className="horiDiv">
                {reverse(bases).map((runnerOnBase, index) => (
                  <Base
                    key={`${runnerOnBase ? 'true' : 'false'}-${index}`}
                    runnerOnBase={runnerOnBase}
                    index={index}
                  ></Base>
                ))}
              </div>
              <p className="bases--inning">{`${innings} ${inningFrame}`}</p>
            </div>
          </div>
          <div className="sbo">
            <p>{`S ${strikes}`}</p>
            <p>{`B ${balls}`}</p>
            <p>{`O ${outs}`}</p>
          </div>
        </InfoBoard>
      </div>
    </StyledPrtSC>
  );
};

export default PrtSC;
