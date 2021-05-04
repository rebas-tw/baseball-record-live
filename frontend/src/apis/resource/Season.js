import { fakeApiHelper } from '~~utils/CommonUtils';
import ApiService from '../ApiService';

const debugStatus = {
  getSeasons: false,
  getTeams: false,
};

const Season = {
  getSeasons: () => {
    if (debugStatus.getSeasons) {
      return fakeApiHelper(200, 'success', {
        data: [
          {
            auto_game_seq: true,
            config: {
              open_registration: false,
              player_registration: {},
            },
            description: '',
            end_at: '2020-07-23T23:59:59+08:00',
            league: {
              name: 'OOOO',
              uniqid: 'zxcv',
            },
            start_at: '2020-07-15T00:00:00+08:00',
            title: '2020 OOOO',
            type: 'CUP_MATCHES',
            uniqid: 'zxcv-2020-XX',
            year: 2020,
          },
        ],
        error: false,
        message: 'Get season successfully',
      });
    }

    return ApiService.get(`/api/seasons`);
  },

  getTeams: ({ seasonUniqid }) => {
    if (debugStatus.getTeams) {
      return fakeApiHelper(200, 'success', {
        data: [
          {
            name: 'AAAC',
            origin: {
              icon_url: '',
              name: 'AAA',
              uniqid: 'wxyz',
            },
            season: {
              title: '2020 OOOO',
              uniqid: 'wasd',
            },
          },
          {
            name: 'BBBB',
            origin: {
              icon_url: '',
              name: 'BBBB',
              uniqid: 'zyxw',
            },
            season: {
              title: '2020 OOOO',
              uniqid: 'wasd',
            },
          },
        ],
        error: false,
        message: 'Get season teams successfully',
      });
    }

    return ApiService.get(`/api/seasons/${seasonUniqid}/teams`);
  },
};

export default Season;
