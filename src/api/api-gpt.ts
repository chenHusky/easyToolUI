/**
 * @file  登录接口配置文件
 * */

import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { getUserAuth } from '@/shared/login';

function getHeaderConfig(): { headers: any } {
  const { token } = getUserAuth();
  const headersConfig = {
    headers: {
      token,
    },
  };
  return headersConfig;
}
export function getAssistant(params: any) {
  const url = '/api-gpt/assistants/getorcreate';
  return request
    .post(url, params, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}


export function createThreads(params: any) {
  const url = '/api-gpt/threads';
  return request
    .post(url, params, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}

export function getAllThreads() {
  const url = '/api-gpt/threads/';
  return request
    .get(url, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}

export function deleteThreads(id: string) {
  const url = `/api-gpt/threads/${id}`;
  return request
    .delete(url, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}
export function modifyThreads(id: string, params: {name: string, assistant_id: string}) {
  const url = `/api-gpt/threads/${id}`;
  return request
    .put(url, params, {
      global: true,
      $doException: true, 
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}

export function getThreadState(id: string) {
  const url = `/api-gpt/threads/${id}/state`;
  return request
    .get(url, {
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
}
