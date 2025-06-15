import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
// fireAuth と apiClient をインポートします
import { fireAuth, apiClient } from './firebase';
import { LoginLayout } from './components/loginlayout';
import { LoginForm } from './LoginForm';
import { SetAccount } from './SetAccount';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { NotificationPage } from './pages/NotificationPage';
import { MessagePage } from './pages/MessagePage';
import { ProfilePage } from './pages/Profilepage';
import { SettingsPage } from './pages/SettingsPage';
import { MainLayout } from './app';
import './app.css';
import axios from 'axios';

const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-4 rounded-md shadow-lg bg-white">
            <p className="text-xl text-blue-500 font-bold animate-pulse">ロード中...</p>
        </div>
    </div>
);

const ProtectedRoute = ({ isAccountSetupComplete, children }: { isAccountSetupComplete: boolean, children: React.ReactNode }) => {
    const location = useLocation();
    if (!isAccountSetupComplete) {
        return <Navigate to="/setaccount" state={{ from: location }} replace />;
    }
    return children;
};


export const AuthChecker: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAccountSetupComplete, setIsAccountSetupComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // 認証状態の確認が完了したか

    useEffect(() => {
        // onAuthStateChanged は unsubscribe 関数を返すので、クリーンアップ時に呼び出す
        const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // ログインしている場合、アカウント設定が完了しているか確認
                try {
                    // ★ apiClientを正しく使用。ヘッダーは自動で付与されます。
                    await apiClient.get('/users/me');
                    // 200 OK -> アカウント設定完了
                    setIsAccountSetupComplete(true);
                } catch (error) {
                    // ★ axiosのエラーをcatchブロックで処理します
                    if (axios.isAxiosError(error) && error.response?.status === 404) {
                        // 404 Not Found -> アカウント設定未完了
                        setIsAccountSetupComplete(false);
                    } else {
                        // その他の予期せぬエラー
                        console.error("アカウント設定の確認エラー:", error);
                        setIsAccountSetupComplete(false);
                    }
                }
            }
            // ユーザー情報の有無に関わらず、確認が完了したらローディングを解除
            setIsLoading(false);
        });

        // コンポーネントがアンマウントされるときにリスナーを解除
        return () => unsubscribe();
    }, []);

    // 認証状態を確認中はローディング画面を表示
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Routes>
            {currentUser ? (
                // --- ログイン済みユーザー向けのルート ---
                <>
                    <Route path="/*" element={
                        <ProtectedRoute isAccountSetupComplete={isAccountSetupComplete}>
                            <MainLayoutRoutes />
                        </ProtectedRoute>
                    } />

                    <Route path="/setaccount" element={
                        // アカウント設定が完了していたらホームへ、そうでなければ設定ページを表示
                        isAccountSetupComplete ? <Navigate to="/" replace /> : <LoginLayout><SetAccount /></LoginLayout>
                    } />
                    {/* ログイン済みの場合、/login にアクセスしたらホームにリダイレクト */}
                    <Route path="/login" element={<Navigate to="/" replace />} />
                </>
            ) : (
                // --- 未ログインユーザー向けのルート ---
                <>
                    <Route path="/" element={<LoginLayout><LoginForm /></LoginLayout>} />
                    {/* 未ログインの場合、保護されたページにアクセスしようとしたらログインページにリダイレクト */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </>
            )}
        </Routes>
    );
};

// MainLayout内のルートを定義するコンポーネント
const MainLayoutRoutes = () => (
    <Routes>
        <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="messages" element={<MessagePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            {/* MainLayout内の未定義URLはホームへ */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
    </Routes>
);
