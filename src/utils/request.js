import axios from 'axios';
import { getBaseUrl } from './network';

export const API = class API {
  static request = async ({ method, urlPath, body, additionalHeader }) => {
    return new Promise(async (resolve, reject) => {
      axios({
        method: method,
        baseURL: await getBaseUrl(),
        headers: {
          ...additionalHeader
        },
        url: urlPath,
        data: body
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  static requestWithoutHeaders = async ({ method, urlPath, body }) => {
    return new Promise(async (resolve, reject) => {
      axios({
        method: method,
        baseURL: await getBaseUrl(),
        url: urlPath,
        data: body
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};