// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import axios from 'axios';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    databaseURL: import.meta.env.VITE_DATABASE_URL,
};

// デバッグ情報
console.log("現在のドメイン:", window.location.hostname);
console.log("Firebase設定:", {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const fireAuth = getAuth(app);
export const storage = getStorage(app);
export const apiClient = axios.create({
    baseURL: 'https://hackathon-backend-723035348521.us-central1.run.app/api',
});

// リクエストインターセプター: 全てのリクエストの前に実行される処理
apiClient.interceptors.request.use(
    async (config) => {
        const user = fireAuth.currentUser;
        if (user) {
            const token = await user.getIdToken(true); // 強制的に最新のトークンを取得
            // ヘッダーに `Authorization: Bearer <token>` を追加
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);