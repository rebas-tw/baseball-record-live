import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import axios from 'axios';
import path from 'path';

const main = () => {
  const devMode = process.env.HOST === 'localhost';
  const serveURL = `${devMode ? 'http' : 'https'}://${process.env.HOST}${devMode ? `:${process.env.PORT}` : ''}`;
  const frontendURL = devMode ? `http://${process.env.HOST}:${process.env.FRONTEND_PORT}` : serveURL;

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: frontendURL,
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', (client) => {
    client.on('event', (data) => {
      /* … */
    });

    client.on('disconnect', () => {
      /* … */
    });

    client.on('create_room', () => {
      client.rooms.forEach((roomID) => {
        client.leave(roomID);
      });

      let roomID = '';
      do {
        roomID = nanoid(5)
          .replace(/[^a-zA-Z1-9]/g, 'o')
          .toUpperCase();
      } while (!!io.of('/').adapter.rooms[roomID]);
      client.join(roomID);
      client.emit('room_created', roomID);
    });

    client.on('join_room', (targetRoomID) => {
      client.join(targetRoomID);
      client.emit('room_joined', targetRoomID);
    });

    client.on('get_seasons', () => {
      axios
        .get(`${process.env.PLATFORM_URL}/api/seasons`)
        .then((res) => {
          client.emit('got_seasons', res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });

    client.on('get_season_teams', (seasonUniqid) => {
      axios
        .get(`${process.env.PLATFORM_URL}/api/seasons/${seasonUniqid}/teams`)
        .then((res) => {
          client.emit('got_season_teams', res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });

    client.on('get_season_team_players', (seasonUniqid, teamName) => {
      axios
        .get(`${process.env.PLATFORM_URL}/api/seasons/${seasonUniqid}/teams/${encodeURIComponent(teamName)}/players`)
        .then((res) => {
          client.emit('got_season_team_players', res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });

    client.on('game_update', (record) => {
      let roomID = '';
      client.rooms.forEach((id) => {
        if (id.length !== 5) {
          return;
        }

        roomID = id;
      });

      if (!roomID) {
        return;
      }

      client.broadcast.in(roomID).emit('got_game_update', record);
    });

    client.on('get_game', () => {
      let roomID = '';
      client.rooms.forEach((id) => {
        if (id.length !== 5) {
          return;
        }

        roomID = id;
      });

      if (!roomID) {
        return;
      }
      client.broadcast.in(roomID).emit('request_game');
    });
  });

  app.get('/', (_, res) => {
    res.sendFile(path.resolve() + '/frontend/build/index.html');
  });
  app.use(express.static(path.resolve() + '/frontend/build/'));

  server.listen(process.env.PORT, () => {
    console.log(`Now listen on ${serveURL}`);
  });
};

dotenv.config();
main();
