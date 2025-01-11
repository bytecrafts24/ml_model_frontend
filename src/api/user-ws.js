import { HttpMethod } from '../utils/network.js';
import { API } from '../utils/request.js';

// Auth endpoints
export const login = (credentials) => {
  return API.request({
    method: HttpMethod.POST,
    urlPath: '/user/login',
    body: credentials
  });
};

export const register = (userData) => {
  return API.request({
    method: HttpMethod.POST,
    urlPath: '/user/register',
    body: userData
  });
};

export const getProfile = () => {
  return API.request({
    method: HttpMethod.POST,
    urlPath: '/user/profile'
  });
};

// 2FA endpoints
export const setup2FA = () => {
  return API.request({
    method: HttpMethod.POST,
    urlPath: '/user/2fa/setup'
  });
};

export const verify2FA = (code) => {
  return API.request({
    method: HttpMethod.POST,
    urlPath: '/user/2fa/verify',
    body: { code }
  });
};

export const enable2FA = () => {
  return API.request({
    method: HttpMethod.POST,
    urlPath: '/user/2fa/enable'
  });
};

export const disable2FA = () => {
  return API.request({
    method: HttpMethod.POST,
    urlPath: '/user/2fa/disable'
  });
};

export const loginWith2FA = (credentials) => {
  return API.request({
    method: HttpMethod.POST,
    urlPath: '/user/2fa/login',
    body: credentials
  });
};

export const resendOTP = (email) => {
  return API.request({
    method: HttpMethod.POST,
    urlPath: '/user/2fa/resend-otp',
    body: { email }
  });
};