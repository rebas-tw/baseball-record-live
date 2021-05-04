import { useLocation, useHistory } from 'react-router-dom';
import qs from 'qs';

const randomBetween = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;
// fakeApiHelper
// responseType: success | fail | random | inOrder
let count = 1;
export const fakeApiHelper = (
  interval = 1000,
  responseType = 'success',
  successResponse,
  preprocess = true,
  ErrorResponse = 'SOMETHING_WRONG',
) => {
  return new Promise((resolve, reject) => {
    // 一次成功，一次失敗
    if (responseType === 'inOrder') {
      if (count % 2 === 1) {
        const axiosFormat = getAxiosFormat(successResponse, preprocess);
        setTimeout(() => resolve(axiosFormat), interval);
      } else {
        const axiosFormat = getAxiosFormat(ErrorResponse, preprocess);
        setTimeout(() => reject(axiosFormat), interval);
      }
      count += 1;
    }

    // 隨機的回傳成功或失敗
    if (responseType === 'random') {
      const random = randomBetween(1, 100);
      if (random % 2 === 1) {
        const axiosFormat = getAxiosFormat(successResponse, preprocess);
        setTimeout(() => resolve(axiosFormat), interval);
      } else {
        const axiosFormat = getAxiosFormat(ErrorResponse, preprocess);
        setTimeout(() => reject(axiosFormat), interval);
      }
      count += 1;
    }

    if (responseType === 'success') {
      const axiosFormat = getAxiosFormat(successResponse, preprocess);
      setTimeout(() => resolve(axiosFormat), interval);
    }
    if (responseType === 'fail') {
      const axiosFormat = getAxiosFormat(ErrorResponse, preprocess);
      setTimeout(() => reject(axiosFormat), interval);
    }
  });
};

const getAxiosFormat = (data, preprocess) => {
  if (!preprocess) {
    return { data };
  }

  return data;
};

export const useQuery = () => {
  const location = useLocation();
  const history = useHistory();
  const value = qs.parse(location.search, { ignoreQueryPrefix: true }) || {};

  return {
    get: (param) => (value[param] ? value[param] : null),
    set: (params) =>
      history.push({
        pathname: location.pathname,
        search: qs.stringify({ ...value, ...params }),
      }),
    delete: (param) => {
      delete value[param];
      history.push({
        pathname: location.pathname,
        search: qs.stringify({ ...value }),
      });
    },
  };
};
