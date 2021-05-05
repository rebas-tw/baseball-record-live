import axios, { CancelToken } from 'axios';
import { isNil } from 'ramda';

const API_CONFIG = {
  baseURL: process.env.REACT_APP_PLATFORM_URL,
  timeout: 10000,
  withCredentials: true,
};

const axiosInstance = axios.create(API_CONFIG);
const ApiService = {
  instance: axiosInstance,

  mergeHeaders(headers, withToken) {
    let finalHeader = {};
    if (withToken) {
      const token = `${sessionStorage.getItem('tokentype')} ${sessionStorage.getItem('token')}`;
      if (token) {
        finalHeader = {
          ...finalHeader,
          Authorization: token,
        };
      }
    }
    if (headers) {
      finalHeader = {
        ...finalHeader,
        ...headers,
      };
    }
    return finalHeader;
  },

  responsePreprocess(action) {
    const self = this;
    return new Promise((resolve, reject) => {
      action
        .then((response) => {
          if (!isNil(response?.data?.error_code)) {
            reject(new Error(response.data.error_code));
          }
          if (response.data.error) {
            reject(new Error('UNKNOWN_ERROR'));
          }
          resolve(response.data);
        })
        .catch((e) => {
          try {
            self.handleApiError(e);
          } catch (e) {
            reject(e);
          }
        });
    });
  },

  get(url, optionsConfig = {}) {
    const { preprocess = true, withToken = false, headers, ...args } = optionsConfig;
    const action = this.instance({
      method: 'get',
      url,
      headers: this.mergeHeaders(headers, withToken),
      ...args,
    });
    return preprocess ? this.responsePreprocess(action) : action.catch(this.handleApiError);
  },

  cancelGet(url, optionsConfig = {}) {
    const { withToken = false, headers, ...args } = optionsConfig;
    const source = CancelToken.source();
    return {
      send: () =>
        this.instance({
          method: 'get',
          url,
          headers: this.mergeHeaders(headers, withToken),
          cancelToken: source.token,
          ...args,
        }).catch(this.handleApiError),
      cancel: source.cancel,
    };
  },

  post(url, optionsConfig = {}) {
    const { preprocess = true, withToken = false, headers, data, ...args } = optionsConfig;
    const action = this.instance({
      method: 'post',
      url,
      data,
      headers: this.mergeHeaders(headers, withToken),
      ...args,
    });
    return preprocess ? this.responsePreprocess(action) : action.catch(this.handleApiError);
  },

  delete(url, optionsConfig = {}) {
    const { preprocess = true, withToken = false, headers, data, ...args } = optionsConfig;
    const action = this.instance({
      method: 'delete',
      url,
      data,
      headers: this.mergeHeaders(headers, withToken),
      ...args,
    });
    return preprocess ? this.responsePreprocess(action) : action.catch(this.handleApiError);
  },

  put(url, optionsConfig = {}) {
    const { preprocess = true, withToken = false, headers, data, ...args } = optionsConfig;
    const action = this.instance({
      method: 'put',
      url,
      data,
      headers: this.mergeHeaders(headers, withToken),
      ...args,
    });
    return preprocess ? this.responsePreprocess(action) : action.catch(this.handleApiError);
  },

  patch(url, optionsConfig = {}) {
    const { preprocess = true, withToken = false, headers, data, ...args } = optionsConfig;
    const action = this.instance({
      method: 'patch',
      url,
      data,
      headers: this.mergeHeaders(headers, withToken),
      ...args,
    });
    return preprocess ? this.responsePreprocess(action) : action.catch(this.handleApiError);
  },

  handleApiError(error) {
    if (!error.response) {
      throw new Error(`Unexpected Error: ${error.message}`);
    }

    const { response } = error;
    // const loginRequired = response?.status === 403;

    // if (loginRequired) {
    //   throw new Error('login required');
    // }

    if (!isNil(response.data?.error_code)) {
      throw new Error(response.data.error_code);
    }
    if (response.data.error) {
      throw new Error('UNKNOWN_ERROR');
    }

    throw error;
  },
};

export default ApiService;
