'use client';
import { checkUser } from '@/actions/user';
import { setUser, userSelector } from '@/redux/features/user-slice';
import { firebaseAuth } from '@/utils/FirebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
function Login() {
  const router = useRouter();
  const { id, isNew } = useSelector(userSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id && !isNew) {
      router.push('/');
    }
  }, [isNew, id, router]);
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(firebaseAuth, provider);
    const { email, displayName: name, photoURL: profileImage } = user;
    try {
      if (email && name && profileImage) {
        const data = await checkUser(email);

        if (!data.status) {
          dispatch(
            setUser({
              id: '',
              email,
              name,
              profileImage,
              status: '',
              isNew: true,
            }),
          );
          router.push('/onboarding');
        } else {
          const { user } = data.data;
          dispatch(
            setUser({
              id: user.id,
              email: user.email,
              name: user.name,
              profileImage: user.profileImage,
              status: user.about,
              isNew: false,
            }),
          );
        }
      }
    } catch (err) {
      console.log('🚀 ~ err:', err);
    }
  };
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex justify-center items-center gap-2 text-white">
        {' '}
        <Image
          src="/whatsapp.gif"
          alt="Whatsapp"
          height={300}
          width={300}
        />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <button
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-md"
        onClick={handleLogin}
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Login with google</span>
      </button>
    </div>
  );
}

export default Login;
