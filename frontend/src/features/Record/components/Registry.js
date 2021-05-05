import React, { useState } from 'react';
import { Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody } from '@chakra-ui/react';
import { ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Button from '~~elements/Button';
import Input from '~~elements/Input';

const TeamDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TeamNameDisplay = ({ side, name, editTeamName }) => {
  const { register, handleSubmit, errors, reset } = useForm();
  const [teamNameOnEdit, setEditTeamName] = useState(false);

  const startEditTeamName = () => {
    reset({ name });
    setEditTeamName(true);
  };

  const cancelEdit = () => {
    setEditTeamName(false);
  };

  const onSubmit = (data) => {
    editTeamName({ ...data, side });
    setEditTeamName(false);
  };

  if (teamNameOnEdit) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <TeamDiv>
          <div>
            {errors.name && (
              <Text fontSize="xs" color="red.500">
                * 隊名必填
              </Text>
            )}
            <Input placeholder="隊名" name="name" innerRef={register({ required: true })} />
          </div>
          <div className="flex">
            <Button mini nowrap width="unset" color="red" type="submit">
              確認
            </Button>
            <Button mini nowrap width="unset" color="transparent" onClick={cancelEdit}>
              取消
            </Button>
          </div>
        </TeamDiv>
      </form>
    );
  }

  return (
    <TeamDiv>
      <div>隊名：{name}</div>
      <Button mini width="unset" nowrap color="red" onClick={startEditTeamName}>
        編輯
      </Button>
    </TeamDiv>
  );
};

const PlayerDisplayDiv = styled.div`
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
`;

const PlayerDisplay = ({ side, players, editPlayer, removePlayer }) => {
  const { register, handleSubmit, errors, reset } = useForm();
  const [inputIndex, setInputIndex] = useState(-1);

  const startEdit = (index) => () => {
    const player = players[index];
    reset({ ...player });
    setInputIndex(index);
  };

  const cancelEdit = () => {
    setInputIndex(-1);
  };

  const onSubmit = (data) => {
    editPlayer({ ...data, side, index: inputIndex });
    cancelEdit();
  };

  return players.map((player, index) => (
    <PlayerDisplayDiv key={`${side}-${player.number}-${player.name}`}>
      {inputIndex === index ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PlayerDisplayDiv>
            <div>
              {(errors.number || errors.name) && <div className="error-msg">* 背號姓名皆為必填</div>}
              <div className="flex">
                <Input width="30%" placeholder="背號" name="number" innerRef={register({ required: true })} />
                <Input width="70%" placeholder="姓名" name="name" innerRef={register({ required: true })} />
              </div>
            </div>
            <div className="flex">
              <Button mini width="unset" nowrap color="red" type="submit">
                確認
              </Button>
              <Button mini width="unset" nowrap color="transparent" onClick={cancelEdit}>
                取消
              </Button>
            </div>
          </PlayerDisplayDiv>
        </form>
      ) : (
        <>
          <div>{`${player.number} ${player.name}`}</div>
          <div className="flex">
            <Button mini width="unset" nowrap color="red" onClick={startEdit(index)}>
              編輯
            </Button>
            <Button mini width="unset" nowrap color="transparent" onClick={removePlayer({ side, index })}>
              刪除
            </Button>
          </div>
        </>
      )}
    </PlayerDisplayDiv>
  ));
};

const AddPlayerPanel = ({ side, addPlayer }) => {
  const { register, handleSubmit, errors, reset } = useForm();

  const onSubmit = (data) => {
    addPlayer({ ...data, side });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        {(errors.number || errors.name) && <div className="error-msg">* 背號姓名皆為必填</div>}
        <div className="flex">
          <Input width="30%" placeholder="背號" name="number" innerRef={register({ required: true })} />
          <Input width="70%" placeholder="姓名" name="name" innerRef={register({ required: true })} />
          <Button mini width="unset" nowrap color="blue" type="submit">
            新增
          </Button>
        </div>
      </div>
    </form>
  );
};

const StyledBody = styled.div`
  font-size: 0.8rem;
  .error-msg {
    font-size: 0.6rem;
    color: red;
  }
  .tab-title {
    width: 100%;
    font-size: 0.8rem;
    text-align: center;
  }
  .panel {
    width: 100%;
    padding: 0.2rem 0;
    border-top: 1px solid #1e1e1e;
    border-bottom: 1px solid #1e1e1e;
    > select {
      width: 95%;
    }
  }
  .flex {
    display: flex;
  }
`;

const Registry = ({
  swapAwayHomeTeam,
  awayTeamName,
  awayPlayers,
  homeTeamName,
  homePlayers,
  editTeamName,
  addPlayer,
  addPlayers,
  editPlayer,
  removePlayer,
  gotSeasonsData,
  getSeasonTeams,
  getTeamPlayers,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isOpen: isPanelOpen, onOpen: onPanelOpen, onClose: onPanelClose } = useDisclosure();
  const [panelSide, setPanelSide] = useState('away');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [seasonTeams, setSeasonTeams] = useState([]);
  const [selectedSeasonTeam, setSelectedSeasonTeam] = useState('');
  const [isGettingPlayers, setIsGettingPlayers] = useState(false);
  const seasons = gotSeasonsData;

  const handlePanelSideChange = (e) => {
    setPanelSide(e.target.value);
  };

  const handleSeasonChange = (e) => {
    const seasonUniqid = e.target.value;
    setSelectedSeason(seasonUniqid);
    setSelectedSeasonTeam('');
    setSeasonTeams([]);
    getSeasonTeams(seasonUniqid, (teams) => {
      setSeasonTeams(teams);
    });
  };

  const handleSeasonTeamChange = (e) => {
    const seasonTeamUniqid = e.target.value;
    setSelectedSeasonTeam(seasonTeamUniqid);
  };

  const importPlayers = () => {
    setIsGettingPlayers(true);
    getTeamPlayers(selectedSeason, selectedSeasonTeam, (players) => {
      addPlayers({ players, side: panelSide });
      editTeamName({ name: selectedSeasonTeam, side: panelSide });
      setIsGettingPlayers(false);
      onPanelClose();
      setSelectedSeason('');
      setSeasonTeams('');
      setSelectedSeasonTeam('');
    });
  };

  return (
    <>
      <Button onClick={onOpen} mini nowrap width="unset" color="red">
        球隊/員登錄
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader py="0.6rem" fontSize="1rem">
            球隊/員登錄
            <Button mini nowrap width="unset" color="blue" onClick={swapAwayHomeTeam}>
              主客球隊/員互調
            </Button>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <StyledBody>
              <Tabs>
                <TabList>
                  <Tab>
                    <div className="tab-title">
                      <div>客場（先攻）</div>
                      <div>{awayTeamName}</div>
                    </div>
                  </Tab>
                  <Tab>
                    <div className="tab-title">
                      <div>主場（後攻）</div>
                      <div>{homeTeamName}</div>
                    </div>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <TeamNameDisplay side="away" name={awayTeamName} editTeamName={editTeamName} />
                    <PlayerDisplay
                      side="away"
                      players={awayPlayers}
                      editPlayer={editPlayer}
                      removePlayer={removePlayer}
                    />
                    <AddPlayerPanel side="away" addPlayer={addPlayer} />
                  </TabPanel>
                  <TabPanel>
                    <TeamNameDisplay side="home" name={homeTeamName} editTeamName={editTeamName} />
                    <PlayerDisplay
                      side="home"
                      players={homePlayers}
                      editPlayer={editPlayer}
                      removePlayer={removePlayer}
                    />
                    <AddPlayerPanel side="home" addPlayer={addPlayer} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
              {isPanelOpen && (
                <div className="panel">
                  <select value={panelSide} onChange={handlePanelSideChange}>
                    <option value="away">客場</option>
                    <option value="home">主場</option>
                  </select>
                  <select value={selectedSeason} onChange={handleSeasonChange}>
                    <option value="">請選擇</option>
                    {seasons.map((season) => (
                      <option key={season.uniqid} value={season.uniqid}>
                        {season.title}
                      </option>
                    ))}
                  </select>
                  {selectedSeason && (
                    <select value={selectedSeasonTeam} onChange={handleSeasonTeamChange}>
                      <option value="">請選擇</option>
                      {seasonTeams.map((team) => (
                        <option key={team.name} value={team.name}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="flex">
                    {selectedSeasonTeam && (
                      <Button mini nowrap color="red" onClick={importPlayers} disabled={isGettingPlayers}>
                        匯入
                      </Button>
                    )}
                    <Button mini nowrap color="transparent" width="unset" onClick={onPanelClose}>
                      取消
                    </Button>
                  </div>
                </div>
              )}
            </StyledBody>
          </ModalBody>
          <ModalFooter py="0.6rem" fontSize="1rem">
            <Button mini nowrap color="transparent" width="unset" onClick={onPanelOpen}>
              從賽季匯入
            </Button>
            <Button mini nowrap color="red" onClick={onClose}>
              完成
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Registry;
