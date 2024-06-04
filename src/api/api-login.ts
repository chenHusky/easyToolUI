/**
 * @file  登录接口配置文件
 * */

import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { getUserAuth } from '@/shared/login';
import { ElMessage } from 'element-plus';

function getHeaderConfig(): { headers: any } {
  const { token } = getUserAuth();
  const headersConfig = {
    headers: {
      token,
    },
  };
  return headersConfig;
}
export function queryPermission() {
  const url = '/api-omapi/oneid/personal/center/user';
  const params = {
    community: 'opengauss',
    client_id: 'e84067ad438744d2aea0bd33fb651724',
  };
  return request
    .get(url, {
      params,
      global: true,
      $doException: true,
      ...getHeaderConfig(),
    })
    .then((res: AxiosResponse) => res.data)
    .catch((err) => {
      const message = err?.response?.data?.message || '';
      if (message && message !== 'token expires') {
        ElMessage({
          type: 'error',
          message: err.message,
        });
      }
    });
}
