import axios from 'axios';
axios.defaults.baseURL = '/api/v1/account';

export const join = args => {
  return axios.post('/join', args).catch(e => e.response);
}

export const login = args => {
  return axios.post('/login', args).catch(e => e.response);
}

export const check = () => {
  return axios.get('/check').catch(e => e.response);
}