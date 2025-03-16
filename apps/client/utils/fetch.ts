import { ProfileRespons, WalletResponse } from '@/types/res';

export const getWallet = async (accessToken: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/wallet`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });

  const data: WalletResponse = await res.json();

  console.log(data);

  return data;
};

export const getProfile = async (accessToken: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });

  const data: ProfileRespons = await res.json();

  console.log(data);

  return data;
};
