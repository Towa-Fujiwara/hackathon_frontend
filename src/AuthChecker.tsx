import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth } from './firebase';
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

export const AuthChecker: React.FC = () => {
    const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
    const [isAccountSetupComplete, setIsAccountSetupComplete] = useState<boolean | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
            console.log("認証状態変更:", user ? "ログイン済み" : "未ログイン");
            setLoginUser(user);
            setIsNavigating(false);
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const response = await fetch('https://hackathon-backend-723035348521.us-central1.run.app/api/users/me', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        console.log("アカウント設定完了");
                        setIsAccountSetupComplete(true);
                    } else if (response.status === 404) {
                        console.log("アカウント設定未完了");
                        setIsAccountSetupComplete(false);
                    } else {
                        console.error("アカウント設定状態の確認中にエラーが発生しました:", response.status, await response.text());
                        setIsAccountSetupComplete(false);
                    }
                } catch (error) {
                    console.error("アカウント設定確認中にエラーが発生しました:", error);
                    setIsAccountSetupComplete(false);
                }
            } else {
                console.log("ログアウト状態");
                setIsAccountSetupComplete(null);
            }
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        console.log("ページ遷移チェック:", { loginUser: !!loginUser, isAccountSetupComplete, currentPath: window.location.pathname, isNavigating });
        if (isNavigating) {
            return;
        }
        if (loginUser && isAccountSetupComplete !== null) {
            if (!isAccountSetupComplete && window.location.pathname !== '/setaccount') {
                console.log("アカウント設定ページに遷移");
                setIsNavigating(true);
                navigate('/setaccount', { replace: true });
            } else if (isAccountSetupComplete && window.location.pathname === '/setaccount') {
                console.log("ホームページに遷移");
                setIsNavigating(true);
                navigate('/', { replace: true });
            }
        } else if (!loginUser && window.location.pathname !== '/') {
            console.log("ログインページに遷移");
            setIsNavigating(true);
            navigate('/', { replace: true });
        }
    }, [loginUser, isAccountSetupComplete]); // navigateを依存配列から削除

    if (loginUser && isAccountSetupComplete === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-4 rounded-md shadow-lg bg-white">
                    <p className="text-xl text-blue-500 font-bold animate-pulse">ロード中...</p>
                </div>
            </div>
        );
    }

    if (loginUser && isAccountSetupComplete) {
        return (
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/notifications" element={<NotificationPage />} />
                    <Route path="/messages" element={<MessagePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        );
    } else {
        return (
            <Routes>
                <Route path="/" element={
                    <LoginLayout>
                        <Routes>
                            <Route index element={<LoginForm />} />
                            <Route path="setaccount" element={<SetAccount />} />
                        </Routes>
                    </LoginLayout>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        );
    }
};

