import { filter } from 'ramda';
import { fakeApiHelper } from '~~utils/CommonUtils';
import ApiService from '../ApiService';

const debugStatus = {
  getPlayersInSeasonTeam: false,
};

const Player = {
  getPlayersInSeasonTeam: ({ seasonUniqid, teamName }) => {
    if (debugStatus.getPlayersInSeasonTeam) {
      return fakeApiHelper(200, 'success', {
        data: [
          {
            avatar_url: '',
            joined_game: true,
            name: 'AAA',
            number: '15',
          },
          {
            avatar_url: '',
            joined_game: true,
            name: 'BBB',
            number: '16',
          },
          {
            avatar_url: '',
            joined_game: true,
            name: 'CCC',
            number: '13',
          },
        ],
        error: false,
        message: 'Get season team players successfully',
      });
    }

    return ApiService.get(`/api/seasons/${seasonUniqid}/teams/${encodeURIComponent(teamName)}/players`);
  },
};

export default Player;
