import { queryPermission } from '../api/api-login';
import { useLogin } from '../stores/login';
import { storeToRefs } from 'pinia';

const LOGIN_KEYS = {
  USER_TOKEN: '_U_T_',
  USER_INFO: '_U_I_',
};

function setCookie(cname: string, cvalue: string, isDelete?: boolean) {
  const deleteStr = isDelete ? 'max-age=0; ' : '';
  try {
    const domain = import.meta.env.VITE_COOKIE_DOMAIN;
    const expires = `${deleteStr}path=/; domain=${domain}`;
    document.cookie = `${cname}=${cvalue}; ${expires}`;
  } catch {}
}
function getCookie(cname: string) {
  const name = `${cname}=`;
  let ca: any = [];
  try {
    ca = document.cookie.split(';');
  } catch {
    ca = [];
  }
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
function deleteCookie(cname: string) {
  setCookie(cname, 'null', true);
}

// 存储用户id及token，用于下次登录
export function saveUserAuth(code = '') {
  if (!code) {
    deleteCookie(LOGIN_KEYS.USER_TOKEN);
  } else {
    setCookie(LOGIN_KEYS.USER_TOKEN, code);
  }
}

// 获取用户id及token
export function getUserAuth() {
  const token = getCookie(LOGIN_KEYS.USER_TOKEN) || '';
  if (!token) {
    saveUserAuth();
  }
  return {
    token,
  };
}

// 退出登录
export function logout() {
  location.href = `${import.meta.env.VITE_LOGIN_ORIGIN}/logout?redirect_uri=${
    window?.location?.origin
  }`;
}

// 跳转首页
export function goToHome() {
  window?.location?.reload();
}

export function showGuard() {
  const origin = import.meta.env.VITE_LOGIN_ORIGIN;
  location.href = `${origin}/login?redirect_uri=${encodeURIComponent(
    location.href
  )}&lang=zh`;
}

// token失效跳转首页
export function tokenFailIndicateLogin(isRefresh = true) {
  saveUserAuth();
  const { clearGuardAuthClient } = useLogin();
  clearGuardAuthClient();
  if (isRefresh) {
    goToHome();
  }
}

/**
 * @callback store 将store返回，使用解构赋值接受
 */
export function useStoreData() {
  const login = useLogin();
  const stores = storeToRefs(login);
  return stores;
}

const setSessionInfo = (data: any) => {
  const { username, photo, identities } = data || {};
  if (username && photo) {
    sessionStorage.setItem(
      LOGIN_KEYS.USER_INFO,
      JSON.stringify({ username, photo, identities })
    );
  }
};
const getSessionInfo = () => {
  let username = '';
  let photo = '';
  let identities = [];
  try {
    const info = sessionStorage.getItem(LOGIN_KEYS.USER_INFO);
    if (info) {
      const obj = JSON.parse(info) || {};
      username = obj.username || '';
      photo = obj.photo || '';
      identities = obj.identities || [];
    }
  } catch (error) {}
  return {
    username,
    photo,
    identities,
  };
};
const removeSessionInfo = () => {
  sessionStorage.removeItem(LOGIN_KEYS.USER_INFO);
};

// 刷新后重新请求登录用户信息
export function refreshInfo() {
  const { token } = getUserAuth();
  if (token) {
    const { setGuardAuthClient } = useLogin();
    setGuardAuthClient(getSessionInfo());
    queryPermission().then((res) => {
      const { data } = res;
      if (Object.prototype.toString.call(data) === '[object Object]') {
        setGuardAuthClient(data);
        setSessionInfo(data);
      }
    });
  } else {
    removeSessionInfo();
  }
}

// 判断是否为有效登录状态
export function isLogined() {
  return new Promise((resolve, reject) => {
    const { token } = getUserAuth();
    if (token) {
      const { setGuardAuthClient } = useLogin();
      setGuardAuthClient(getSessionInfo());
      queryPermission()
        .then((res: any) => {
          const { data } = res;
          if (data) {
            if (Object.prototype.toString.call(data) === '[object Object]') {
              setGuardAuthClient(data);
              setSessionInfo(data);
            }
            resolve(data);
          } else {
            resolve(false);
          }
        })
        .catch(() => resolve(false));
    } else {
      removeSessionInfo();
      resolve(false);
    }
  });
}

export const initLogin = () => {
  return isLogined().then((res) => {
    const { loginModalVisible } = useStoreData()
    if (res) {
      loginModalVisible.value = false;
    } else {
      loginModalVisible.value = true;
    }
    return res;
  })
}
