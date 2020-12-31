import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text, Input } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

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
        <Flex justifyContent="space-between">
          <Box>
            {errors.name && (
              <Text fontSize="xs" color="red.500">
                * 隊名必填
              </Text>
            )}
            <Input size="sm" placeholder="隊名" name="name" ref={register({ required: true })} />
          </Box>
          <Flex>
            <Button size="sm" onClick={cancelEdit}>
              取消
            </Button>
            <Button size="sm" colorScheme="confirm" type="submit">
              確認
            </Button>
          </Flex>
        </Flex>
      </form>
    );
  }

  return (
    <Flex justifyContent="space-between">
      <Text>隊名：{name}</Text>
      <Button size="xs" colorScheme="orange" onClick={startEditTeamName}>
        編輯
      </Button>
    </Flex>
  );
};

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
    <Flex key={`${side}-${player.number}-${player.name}`} justifyContent="space-between">
      {inputIndex === index ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex>
            <Box>
              {(errors.number || errors.name) && (
                <Text fontSize="xs" color="red.500">
                  * 背號姓名皆為必填
                </Text>
              )}
              <Flex>
                <Input size="sm" placeholder="背號" w="20%" name="number" ref={register({ required: true })} />
                <Input size="sm" placeholder="姓名" w="80%" name="name" ref={register({ required: true })} />
              </Flex>
            </Box>
            <Flex>
              <Button size="sm" onClick={cancelEdit}>
                取消
              </Button>
              <Button size="sm" colorScheme="confirm" type="submit">
                確認
              </Button>
            </Flex>
          </Flex>
        </form>
      ) : (
        <>
          <Flex>{`${player.number} ${player.name}`}</Flex>
          <Flex>
            <Button size="xs" colorScheme="orange" onClick={startEdit(index)}>
              編輯
            </Button>
            <Button size="xs" colorScheme="red" onClick={removePlayer({ side, index })}>
              刪除
            </Button>
          </Flex>
        </>
      )}
    </Flex>
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
      <Box>
        {(errors.number || errors.name) && (
          <Text fontSize="xs" color="red.500">
            * 背號姓名皆為必填
          </Text>
        )}
        <Flex>
          <Input size="sm" placeholder="背號" w="20%" name="number" ref={register({ required: true })} />
          <Input size="sm" placeholder="姓名" w="80%" name="name" ref={register({ required: true })} />
          <Button size="sm" colorScheme="confirm" type="submit">
            新增
          </Button>
        </Flex>
      </Box>
    </form>
  );
};

const Registry = ({
  setIsRegistering,
  swapAwayHomeTeam,
  awayTeamName,
  awayPlayers,
  homeTeamName,
  homePlayers,
  editTeamName,
  addPlayer,
  editPlayer,
  removePlayer,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    setIsRegistering(isOpen);
  }, [isOpen, setIsRegistering]);

  return (
    <>
      <Button onClick={onOpen}>球隊/員登錄</Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            球隊/員登錄<Button onClick={swapAwayHomeTeam}>主客球隊/員互調</Button>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>客場（先攻） - {awayTeamName}</Tab>
                <Tab>主場（後攻） - {homeTeamName}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <TeamNameDisplay side="away" name={awayTeamName} editTeamName={editTeamName} />
                  <Box my="5">
                    <PlayerDisplay
                      side="away"
                      players={awayPlayers}
                      editPlayer={editPlayer}
                      removePlayer={removePlayer}
                    />
                  </Box>
                  <AddPlayerPanel side="away" addPlayer={addPlayer} />
                </TabPanel>
                <TabPanel>
                  <TeamNameDisplay side="home" name={homeTeamName} editTeamName={editTeamName} />
                  <Box my="5">
                    <PlayerDisplay
                      side="home"
                      players={homePlayers}
                      editPlayer={editPlayer}
                      removePlayer={removePlayer}
                    />
                  </Box>
                  <AddPlayerPanel side="home" addPlayer={addPlayer} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              完成
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Registry;
