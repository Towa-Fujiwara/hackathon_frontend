import { useEffect, useState } from 'react';
import './app.css';
import { SideBarButton, sideBarButtonPath } from './components/layout';
import { fireAuth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LoginForm } from './LoginForm';
import { LoginLayout } from './components/loginlayout';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { NotificationPage } from './pages/NotificationPage';
import { MessagePage } from './pages/MessagePage';
import { ProfilePage } from './pages/Profilepage';
import { SettingsPage } from './pages/SettingsPage';
import { SetAccount } from './SetAccount';






const MainLayout = () => (
    <div>
        <SideBarButton buttons={sideBarButtonPath} />
        <main style={{ marginLeft: '270px' }}>
            <Outlet />
        </main>
    </div>
);

const App = () => {

    const [loginUser, setLoginUser] = useState(fireAuth.currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, user => {
            setLoginUser(user);
        });
        return () => unsubscribe();
    }, []);


    return (
        <BrowserRouter>
            {loginUser ? (
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/notifications" element={<NotificationPage />} />
                        <Route path="/messages" element={<MessagePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Routes>
            ) : (
                <Routes>
                    <Route path="/" element={<LoginLayout>
                        <Route index element={<LoginForm />} />
                        <Route path="setaccount" element={<SetAccount />} />
                    </LoginLayout>}>
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Route>
                </Routes>
            )}
        </BrowserRouter>
    );
}

export default App;