import { Token } from '@/types/token';

export const getRemainingAccessTokenTime = (token: Token) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expiresIn = token.exp - currentTime;

  return expiresIn;
};
