import React from 'react';
import styled from 'styled-components';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { filter } from 'ramda';
import { BATTING_RESULT_LIST, getPlayerNumberName } from '../../Record/Const';

import batterBg from '../assets/batter.png';
import infoBg from '../assets/info.png';
import battingResultBlue from '../assets/result-blue.png';
import battingResultRed from '../assets/result-red.png';
import battingResultYellow from '../assets/result-yellow.png';
import baseBg from '../assets/base.png';
import inningTop from '../assets/inning-top.png';
import inningBottom from '../assets/inning-bottom.png';
import strikeBg from '../assets/strike.png';
import ballBg from '../assets/ball.png';
import outBg from '../assets/out.png';

const StyledPrtSC = styled.div`
  width: 100%;
  height: 95vh;
  padding: 10px;
  background-color: #008000;
  overflow: hidden;
  .horiDiv {
    display: flex;
  }
`;

const InfoBoard = styled.div`
  position: relative;
  left: 10px;
  width: 345px;
  height: 240px;
  background: url(${infoBg});
  background-size: cover;
  background-repeat: no-repeat;
  font-size: 24px;
  font-weight: bold;
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
    position: absolute;
    top: 10px;
    left: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 180px;
    height: 140px;
    &--name {
      padding-left: 20px;
      width: 140px;
    }
    &--score {
      width: 30px;
    }
  }
  .bases {
    color: #1f3153;
    font-size: 22px;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 80px;
    padding: 15px 6px 6px;
    &--inning {
      position: absolute;
      top: 90px;
      left: 255px;
    }
  }
  .pitcher {
    color: #1f3153;
    position: absolute;
    top: 190px;
    left: 60px;
    font-size: 20px;
  }
`;

const Base = styled.div`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: 42px;
  height: 42px;
  background: url(${baseBg});
  background-size: cover;
  background-repeat: no-repeat;
`;

const InningFrame = styled.div`
  position: absolute;
  top: 105px;
  left: 268px;
  width: 10px;
  height: 8px;
  background: url(${({ bgUrl }) => bgUrl});
  background-size: cover;
  background-repeat: no-repeat;
`;

const SBO = styled.div`
  position: absolute;
  top: 155px;
  left: ${({ left }) => left}px;
  width: 20px;
  height: 20px;
  background: url(${({ bgUrl }) => bgUrl});
  background-size: cover;
  background-repeat: no-repeat;
`;

const BatterCard = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 630px;
  height: 98px;
  background: url(${batterBg});
  background-size: cover;
  background-repeat: no-repeat;
  color: white;
  font-weight: bold;
  .order {
    position: absolute;
    top: 12px;
    left: 25px;
    font-size: 20px;
  }
  .name {
    position: absolute;
    top: 40px;
    left: 25px;
    font-size: 24px;
  }
`;

const BattingResultCard = styled.div`
  position: absolute;
  top: 25px;
  left: ${({ left }) => left}px;
  background: url(${({ bgUrl }) => bgUrl});
  background-size: cover;
  background-repeat: no-repeat;
  width: 75px;
  height: 45px;
  text-align: center;
  padding-top: 3px;
  font-weight: bold;
  font-size: 24px;
`;

const getBgUrl = (color) => {
  switch (color) {
    case 'red':
      return battingResultRed;
    case 'yellow':
      return battingResultYellow;
    default:
      return battingResultBlue;
  }
};

const getBasePosition = (index) => {
  switch (index) {
    case 0:
      return {
        top: 54,
        left: 267,
      };
    case 1:
      return {
        top: 32,
        left: 245,
      };
    default:
      return {
        top: 54,
        left: 223,
      };
  }
};

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
  batterOrder,
  batterNumber,
  batterName,
  batterRecords,
  pitcherName,
}) => {
  return (
    <StyledPrtSC>
      <div className="horiDiv">
        <Table variant="striped" w="240px" textAlign="center" borderRadius="10px" bgColor="white">
          <Thead w="240px">
            <Tr w="240px">
              <Th w="36px" overflow="hidden" whiteSpace="nowrap"></Th>
              <Th w="48px" overflow="hidden" whiteSpace="nowrap">
                背號
              </Th>
              <Th w="108px" overflow="hidden" whiteSpace="nowrap">
                球員
              </Th>
              <Th w="48px" overflow="hidden" whiteSpace="nowrap">
                守位
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filter((p) => p.player, startingLineUp).map((player, index) => (
              <Tr key={`${player.player}-${index}`}>
                <Td textAlign="center" padding="0.4rem 0.5rem">
                  {index === 9 ? '' : index + 1}
                </Td>
                <Td textAlign="center" padding="0.4rem 0.5rem">
                  {getPlayerNumberName(player.player)[0]}
                </Td>
                <Td textAlign="center" padding="0.4rem 0.5rem">
                  {getPlayerNumberName(player.player)[1]}
                </Td>
                <Td textAlign="center" padding="0.4rem 0.5rem">
                  {player.position}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <div>
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
                  {bases.map((runnerOnBase, index) => {
                    if (!runnerOnBase) {
                      return <div key={`${runnerOnBase ? 'true' : 'false'}-${index}`}></div>;
                    }

                    return (
                      <Base key={`${runnerOnBase ? 'true' : 'false'}-${index}`} {...getBasePosition(index)}></Base>
                    );
                  })}
                </div>
                <p className="bases--inning">{`${innings}`}</p>
                <InningFrame bgUrl={inningFrame === '上' ? inningTop : inningBottom}></InningFrame>
              </div>
            </div>
            {Array.from({ length: strikes }).map((_, index) => (
              <SBO key={`strike-${index}`} bgUrl={strikeBg} left={167 + index * 26}></SBO>
            ))}
            {Array.from({ length: balls }).map((_, index) => (
              <SBO key={`ball-${index}`} bgUrl={ballBg} left={50 + index * 26}></SBO>
            ))}
            {Array.from({ length: outs }).map((_, index) => (
              <SBO key={`out-${index}`} bgUrl={outBg} left={260 + index * 26}></SBO>
            ))}
            <div className="pitcher">{pitcherName}</div>
          </InfoBoard>
        </div>
      </div>
      <BatterCard>
        <div className="order">第{batterOrder}棒</div>
        <div className="name">{`${batterName}    ${batterNumber}`}</div>
        <div className="horiDiv">
          {/* 最多顯示近期五個打席 */}
          {batterRecords.slice(-5).map((r, index) => (
            <BattingResultCard
              bgUrl={getBgUrl(BATTING_RESULT_LIST[r].color)}
              left={185 + index * 85}
              key={`${r}-${index}`}
            >
              {BATTING_RESULT_LIST[r].short}
            </BattingResultCard>
          ))}
        </div>
      </BatterCard>
    </StyledPrtSC>
  );
};

export default PrtSC;
