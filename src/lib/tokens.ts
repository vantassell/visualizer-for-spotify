import { accessTokenKey, refreshTokenKey } from './constants'

export const setAccessToken = (token: string): void => {
  console.log('setting new Access Token')
  localStorage.setItem(accessTokenKey, token)
}

export const getAccessToken = (): string | null => {
  return typeof localStorage === 'object'
    ? localStorage.getItem(accessTokenKey)
    : null
}

export const removeAccessToken = (): void => {
  if (getAccessToken() != null) {
    console.log('deleting Access Token')
    localStorage.removeItem(accessTokenKey)
  }
}

export const setRefreshToken = (token: string): void => {
  console.log('setting new Refresh Token')
  localStorage.setItem(refreshTokenKey, token)
}

export const getRefreshToken = (): string | null => {
  return typeof localStorage === 'object'
    ? localStorage.getItem(refreshTokenKey)
    : null
}

export const removeRefreshToken = (): void => {
  if (getRefreshToken() != null) {
    console.log('deleting Refresh Token')
    localStorage.removeItem(refreshTokenKey)
  }
}
