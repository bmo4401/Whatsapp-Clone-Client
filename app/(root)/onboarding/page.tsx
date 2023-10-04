'use client';
import Avatar from '@/components/common/Avatar';
import Input from '@/components/common/Input';
import { userSelector } from '@/redux/features/user-slice';
import { useAppDispatch } from '@/redux/store';
import { setUser } from '@/redux/features/user-slice';
import { ONBOARD_USER_ROUTE } from '@/utils/ApiRoutes';
import axios from 'axios';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '@/actions/user';

function OnBoarding() {
  const router = useRouter();

  const dispatch = useDispatch();
  const { email, name, isNew, profileImage } = useSelector(userSelector);
  const [info, setInfo] = useState(name || '');
  const [about, setAbout] = useState('');
  const [image, setImage] = useState<string | StaticImageData>(
    profileImage || '/default_avatar.png',
  );

  useEffect(() => {
    if (!isNew && email) router.push('/login');
    else if (!isNew && !email) router.push('/');
  }, [, isNew, email, router]);
  const onboardUserHandler = async () => {
    if (validateName(name)) {
      try {
        const profileImage = image;
        const data = await register(email, name, profileImage, about);

        if (data.status) {
          dispatch(
            setUser({
              id: data.data.id,
              email,
              name: info,
              profileImage: image,
              isNew: false,
              status: about,
            }),
          );
          router.push('/');
        }
      } catch (error) {
        console.log('🚀 ~ error:', error);
      }
    }
  };
  const validateName = (name: string) => {
    if (name.length < 3) return false;
    return true;
  };
  return (
    <>
      <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Image
            alt=""
            src="/whatsapp.gif"
            height={300}
            width={300}
          />
          <span className="text-7xl">Whatsapp</span>
        </div>
        <h2 className="text-7xl">Create your profile</h2>
        <div className="flex gap-6 mt-6">
          <div className="flex flex-col items-center justify-center mt-5 gap-6">
            <Input
              name="Display name"
              value={info}
              setValue={(e) => setInfo(e.target.value)}
              label
            />
            <Input
              name="About"
              value={about}
              setValue={(e) => setAbout(e.target.value)}
              label
            />
            <div className="flex items-center justify-center">
              <button
                onClick={onboardUserHandler}
                className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-md"
              >
                Create Profile
              </button>
            </div>
          </div>
          <div>
            <Avatar
              type="xl"
              image={image}
              setImage={(e) => setImage(e)}
            />
          </div>
        </div>
      </div>
      <div id="photo-picker-element"></div>
    </>
  );
}

export default OnBoarding;
