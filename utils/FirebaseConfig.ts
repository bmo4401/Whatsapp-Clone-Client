import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
   apiKey: 'AIzaSyDvDo70c8ODhQmS-MZa0H2WMU3o6_7FCeM',
   authDomain: 'what-s-app-clone-d2572.firebaseapp.com',
   projectId: 'what-s-app-clone-d2572',
   storageBucket: 'what-s-app-clone-d2572.appspot.com',
   messagingSenderId: '227207084582',
   appId: '1:227207084582:web:f7187f77d5be4bf11c84e7',
   measurementId: 'G-PSZZC73KS6',
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
