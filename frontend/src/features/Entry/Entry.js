import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import Button from '~~elements/Button';
import Input from '~~elements/Input';
import { TABLET_WIDTH } from '~~elements/Const';
import { ROOM_EDITOR, ROOM_RECORD } from '~~utils/LocalStorage';
import Record from '../Record';
import RecordDisplay from '../RecordDisplay';

const StyledDiv = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .section {
    width: 20rem;
    padding: 2rem 0;
    text-align: center;
  }

  @media (max-width: ${TABLET_WIDTH}) {
    .section {
      width: 90%;
    }
  }
`;

const Entry = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setSocketConnected] = useState(false);
  const [readRoomID, setReadRoomID] = useState('');
  const [roomID, setRoomID] = useState('');
  const [isEditor, setIsEditor] = useState(false);
  const [gotSeasonsData, setGotSeasonsData] = useState([]);

  const [requestUpdate, setRequestUpdate] = useState(false);
  const [readOnlyRecord, setReadOnlyRecord] = useState(null);

  let localRecord = {};
  try {
    localRecord = JSON.parse(localStorage.getItem(ROOM_RECORD));
  } catch (e) {}
  const localRooms = Object.keys(!!localRecord ? localRecord : {});

  useEffect(() => {
    if (isSocketConnected) {
      return;
    }

    setTimeout(() => {
      setLoadingCount(loadingCount + 1);
    }, 1000);
  }, [isSocketConnected, loadingCount]);

  useEffect(() => {
    setSocket(io(process.env.REACT_APP_BACKEND_URL));
  }, []);

  useEffect(() => {
    const initWebSocket = () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('got_seasons');
      socket.off('got_game_update');
      socket.off('request_game');

      socket.on('connect', () => {
        setSocketConnected(true);
        if (roomID) {
          socket.emit('join_room', roomID);
        }
        socket.emit('get_seasons');
      });
      socket.on('disconnect', () => {
        setSocketConnected(false);
      });
      socket.on('connect_error', () => {
        setSocketConnected(false);
      });

      socket.on('room_created', (newRoomID) => {
        setRoomID(newRoomID);
        localStorage.setItem(ROOM_EDITOR, newRoomID);
        setIsEditor(true);
      });
      socket.on('room_joined', (roomID) => {
        setRoomID(roomID);
        if (roomID === localStorage.getItem(ROOM_EDITOR)) {
          setIsEditor(true);
          return;
        }
        socket.emit('get_game');
      });

      socket.on('got_seasons', (data) => {
        setGotSeasonsData(data);
      });

      socket.on('got_game_update', (record) => {
        setReadOnlyRecord(record);
      });

      socket.on('request_game', () => {
        if (!isEditor) {
          return;
        }
        setRequestUpdate(true);
      });
    };

    if (socket) {
      initWebSocket();
    }
  }, [isEditor, roomID, socket]);

  const handleReadRoomIDChange = (e) => {
    setReadRoomID(e.target.value);
  };

  const handleStartRecord = () => {
    socket.emit('create_room');
  };

  const handleLoadRecord = (roomID) => () => {
    localStorage.setItem(ROOM_EDITOR, roomID);
    socket.emit('join_room', roomID);
  };

  const handleRemoveRecord = () => {
    localStorage.removeItem(ROOM_RECORD);
  };

  const getSeasonTeams = (seasonUniqid, callback) => {
    socket.on('got_season_teams', (data) => {
      callback(data);
      socket.off('got_season_teams');
    });
    socket.emit('get_season_teams', seasonUniqid);
  };

  const getTeamPlayers = (seasonUniqid, teamName, callback) => {
    socket.on('got_season_team_players', (data) => {
      callback(data);
      socket.off('got_season_team_players');
    });
    socket.emit('get_season_team_players', seasonUniqid, teamName);
  };

  const broadcastRecord = (record) => {
    socket.emit('game_update', record);
    setRequestUpdate(false);
  };

  const handleStartReadOnlyRecord = () => {
    socket.emit('join_room', readRoomID);
  };

  // 房間外或編輯模式下，可以跳離視窗顯示字串
  if (!isSocketConnected && (!roomID || isEditor)) {
    return (
      <StyledDiv>
        {roomID && <div className="section">嘗試重新進入 {roomID} 紀錄間</div>}
        <div>連線中，請稍後{new Array(loadingCount % 4).fill('').map(() => '.')}</div>
      </StyledDiv>
    );
  }

  if (!roomID) {
    return (
      <StyledDiv>
        <div className="section">
          <Input type="text" placeholder="填入紀錄代號" value={readRoomID} onChange={handleReadRoomIDChange} />
          <Button color="secondary" onClick={handleStartReadOnlyRecord}>
            讀取紀錄
          </Button>
        </div>
        <div>- or -</div>
        <div className="section">
          <Button onClick={handleStartRecord}>開始紀錄</Button>
        </div>
        <br />
        <br />
        <div>- or -</div>
        <div className="section">
          {localRooms.map((roomID) => (
            <div key={roomID}>
              <Button color="blue" width="unset" onClick={handleLoadRecord(roomID)}>
                {roomID}
              </Button>
            </div>
          ))}
        </div>
        <div className="section">
          <Button color="transparent" width="unset" onClick={handleRemoveRecord}>
            清空本機紀錄
          </Button>
        </div>
      </StyledDiv>
    );
  }

  if (!isEditor) {
    return (
      <RecordDisplay
        isSocketConnected={isSocketConnected}
        roomID={roomID}
        readOnlyRecord={JSON.parse(JSON.stringify(readOnlyRecord))}
      />
    );
  }

  return (
    <div>
      {requestUpdate && <small>新用戶加入，點擊強制更新以同步資料</small>}
      <Record
        roomID={roomID}
        broadcast={broadcastRecord}
        isEditor={isEditor}
        gotSeasonsData={gotSeasonsData}
        getSeasonTeams={getSeasonTeams}
        getTeamPlayers={getTeamPlayers}
      />
    </div>
  );
};

export default Entry;
