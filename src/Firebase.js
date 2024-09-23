import { initializeApp } from "firebase/app";
import conf from './Conf/conf'
const firebaseConfig = {
  apiKey: conf.apiKey,
  authDomain: conf.authDomain,
  projectId: conf.projectId,
  storageBucket: conf.storageBucket,
  messagingSenderId: conf.messagingSenderId,
  appId: conf.appId
};

export const app = initializeApp(firebaseConfig);