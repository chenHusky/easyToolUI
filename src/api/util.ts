import { getUserAuth } from '@/shared/login';

export function getHeaderConfig(): { headers: any } {
  const { token } = getUserAuth();
  const headersConfig = {
    headers: {
      'PRIVATE-TOKEN': token,
    },
  };
  return headersConfig;
}
