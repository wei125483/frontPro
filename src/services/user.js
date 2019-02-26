import request from '@/utils/request';

export async function query() {
  return request('/server/api/users');
}

export async function queryCurrent() {
  return request('/server/api/currentUser');
}
