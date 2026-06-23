import { clearUser, setUser } from '@/redux/reducers/appReducer';
import { store } from '@/redux/store';
import axios from 'axios';

let refreshPromise: Promise<string> | null = null;

export async function getValidAccessToken(): Promise<string> {
  const { user } = store.getState().app;
  if (!user) return '';

  if (!isAccessTokenExpired(user.accessToken)) {
    return user.accessToken;
  }

  if (isRefreshTokenExpired(user.refreshTokenExpires)) {
    store.dispatch(clearUser());
    return '';
  }

  if (!refreshPromise) {
    refreshPromise = doRefresh(user.refreshToken).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function doRefresh(refreshToken: string): Promise<string> {
  const response = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/refresh`, {
    refreshToken,
  });

  const updated = response.data as {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpires: string;
  };

  store.dispatch(
    setUser({
      ...store.getState().app.user!,
      accessToken: updated.accessToken,
      refreshToken: updated.refreshToken,
      refreshTokenExpires: updated.refreshTokenExpires,
    }),
  );

  return updated.accessToken;
}

function isAccessTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now() + 30_000; // 30s buffer
  } catch {
    return true;
  }
}

function isRefreshTokenExpired(refreshTokenExpires: string): boolean {
  return new Date(refreshTokenExpires).getTime() < Date.now();
}
