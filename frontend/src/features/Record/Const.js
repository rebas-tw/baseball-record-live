export const getInGamePlayerKey = (number, name) => {
  return `${number};;${name}`;
};

export const getPlayerNumberName = (key) => {
  return key.split(';;');
};

export const BATTING_RESULT_LIST = {
  H: {
    display: '安打',
    short: '1B',
    color: 'red',
  },
  TWOB: {
    display: '二安',
    short: '2B',
    color: 'red',
  },
  THREEB: {
    display: '三安',
    short: '3B',
    color: 'red',
  },
  HOMERUN: {
    display: '全壘打',
    short: 'HR',
    color: 'red',
  },
  BB: {
    display: '保送',
    short: 'BB',
    color: 'yellow',
  },
  HBP: {
    display: '觸身',
    short: 'HBP',
    color: 'yellow',
  },
  SAC: {
    display: '犧觸',
    short: 'SAC',
    color: 'yellow',
  },
  SF: {
    display: '犧飛',
    short: 'SF',
    color: 'yellow',
  },
  IR: {
    display: '妨跑',
    short: 'IR',
    color: 'yellow',
  },
  IH: {
    display: '妨打',
    short: 'IH',
    color: 'yellow',
  },
  FC: {
    display: '野選',
    short: 'FC',
    color: 'blue',
  },
  E: {
    display: '失誤',
    short: 'E',
    color: 'blue',
  },
  K: {
    display: '三振',
    short: 'K',
    color: 'blue',
  },
  G: {
    display: '滾地',
    short: 'GO',
    color: 'blue',
  },
  F: {
    display: '飛球',
    short: 'FO',
    color: 'blue',
  },
  GIDP: {
    display: '雙殺',
    short: 'GIDP',
    color: 'blue',
  },
};

export const debugPlayers = [
  {
    number: '00',
    name: '玲玲',
    records: [],
  },
  {
    number: '54',
    name: '武四',
    records: [],
  },
  {
    number: '94',
    name: '九四',
    records: [],
  },
  {
    number: '48',
    name: '是八',
    records: [],
  },
  {
    number: '35',
    name: '三吳',
    records: [],
  },
  {
    number: '47',
    name: '似七',
    records: [],
  },
  {
    number: '75',
    name: '漆武',
    records: [],
  },
  {
    number: '61',
    name: '陸一',
    records: [],
  },
  {
    number: '34',
    name: '三四',
    records: [],
  },
  {
    number: '45',
    name: '四五',
    records: [],
  },
  {
    number: '19',
    name: '一九',
    records: [],
  },
];

export const debugInGamePlayers = [
  {
    player: '54;武四',
    position: '2B',
  },
  {
    player: '47;似七',
    position: 'RF',
  },
  {
    player: '19;一九',
    position: '3B',
  },
  {
    player: '34;三四',
    position: 'SS',
  },
  {
    player: '75;漆武',
    position: 'CF',
  },
  {
    player: '48;是八',
    position: 'LF',
  },
  {
    player: '94;九四',
    position: 'C',
  },
  {
    player: '00;玲玲',
    position: 'DH',
  },
  {
    player: '61;陸一',
    position: '1B',
  },
  {
    player: '35;三吳',
    position: 'P',
  },
];
