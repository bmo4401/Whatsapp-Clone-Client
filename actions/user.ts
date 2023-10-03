import { FormatReceive, RegisterUserReceive, UserReceive } from '@/type';
import {
  REFRESH_USER_ROUTE,
  CHECK_USER_ROUTE,
  ONBOARD_USER_ROUTE,
} from '@/utils/ApiRoutes';
import axios from 'axios';
import { StaticImageData } from 'next/image';
export const checkUser = async (email: string) => {
  try {
    const {
      data: { data },
    } = await axios.post<FormatReceive<UserReceive>>(
      CHECK_USER_ROUTE,
      {
        email,
      },
      {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': process.env.NEXT_URL,
          'Access-Control-Allow-Credentials': 'true',
        },
      },
    );
    console.log('❄️ ~ file: user.ts:12 ~ data:', data);
    return data;
  } catch (err: any) {
    console.log(err);
    return err?.response?.data;
  }
};

export const refresh = async () => {
  try {
    const {
      data: { data },
    } = await axios.get<FormatReceive<undefined>>(
      REFRESH_USER_ROUTE,

      { withCredentials: true },
    );
    return data;
  } catch (err: any) {
    return err?.response?.data;
  }
};

export const register = async (
  email: string,
  name: string,
  profileImage: string | StaticImageData,
  about: string,
) => {
  const {
    data: { data },
  } = await axios.post<FormatReceive<RegisterUserReceive>>(
    ONBOARD_USER_ROUTE,
    {
      email,
      name,
      profileImage,
      about,
    },
    { withCredentials: true },
  );
  return data;
};
