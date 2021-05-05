import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody } from '@chakra-ui/react';
import { ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import styled from 'styled-components';
import { COLOR } from '~~elements/Const';
import Button from '~~elements/Button';
import { getInGamePlayerKey } from '../Const';

const StyledBody = styled.div`
  font-size: 0.8rem;
  .player {
    padding: 0.5rem 0;
    border-bottom: 1px solid #1e1e1e;
    width: 100%;
    display: grid;
    grid-template-columns: 2fr 5fr 3fr;
    > div {
      text-align: center;
    }
  }
`;

const POSITIONS = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'P'];

const LineUp = ({ handleLineUpPanelDisplay, teamName, players, inGamePlayers, setInGamePlayer }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLineUpPanelOpen = (side) => () => {
    handleLineUpPanelDisplay(side);
    onOpen();
  };

  return (
    <>
      <div className="section--input-group">
        <Button onClick={handleLineUpPanelOpen('away')} width="unset" nowrap mini color="blue">
          客場打序
        </Button>
        <Button onClick={handleLineUpPanelOpen('home')} width="unset" nowrap mini color="red">
          主場打序
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" autoFocus={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader py="0.6rem" fontSize="1rem" color="white" bgColor={COLOR.secondary} borderTopRadius="5px">
            {teamName} 打序
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <StyledBody>
              {inGamePlayers.map((inGamePlayer, index) => (
                <div
                  className="player"
                  key={`${index}-${inGamePlayer?.player ? `${inGamePlayer.player}-${inGamePlayer.position}` : ''}`}
                >
                  <div>{index === 9 ? 'P' : index + 1}</div>
                  <select
                    placeholder="選擇選手"
                    value={inGamePlayer?.player ? inGamePlayer.player : ''}
                    onChange={setInGamePlayer('player', index)}
                  >
                    <option value="">選擇選手</option>
                    {players.map((player) => (
                      <option
                        key={`${player.number}-${player.name}`}
                        value={getInGamePlayerKey(player.number, player.name)}
                      >{`${player.number} ${player.name}`}</option>
                    ))}
                  </select>
                  <select
                    placeholder="守位"
                    value={inGamePlayer?.position ? inGamePlayer.position : ''}
                    onChange={setInGamePlayer('position', index)}
                  >
                    <option value="">守位</option>
                    {POSITIONS.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </StyledBody>
          </ModalBody>
          <ModalFooter py="0.6rem" fontSize="1rem" bgColor={COLOR.secondary} borderBottomRadius="5px">
            <Button mini nowrap color="red" onClick={onClose}>
              完成
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LineUp;
