import React, { useState, useEffect } from 'react';
import { type UserProfile } from '../components/UserProfile'; // UserProfileCardをインポート
import { CustomHeader } from '../components/layout';
import { type HeaderButtonType } from '../components/layout';
import { apiClient } from '../firebase';
import { signOut } from 'firebase/auth';
import { fireAuth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ProfileUpdateForm } from '../components/ProfileUpdateForm';

const SettingsContent: React.FC = () => {
    // プロフィール情報、ローディング状態、エラーを管理するstate
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // プロフィール情報を取得する非同期関数
        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // apiClientでGETリクエスト
                const response = await apiClient.get('/users/me');
                console.log('[SettingsContent] Profile fetched:', response.data);
                setUserProfile(response.data);
            } catch (err: any) {
                console.error('[SettingsContent] Failed to fetch profile:', err);
                setError(err.message);
                // エラー発生時はトークンを削除して再ログインを促す
                localStorage.removeItem('appToken');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []); // このuseEffectはページがマウントされた時に一度だけ実行される

    // ★デバッグログ追加
    console.log('[SettingsContent] State:', { isLoading, error, userProfile });

    // ローディング中の表示
    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    // エラー発生時の表示
    if (error) {
        return <div>エラー: {error}</div>;
    }

    // プロフィールデータが正常に取得できた場合の表示
    return (
        <div>
            {userProfile ? (
                <>
                    <ProfileUpdateForm
                        userProfile={userProfile}
                        onProfileUpdate={setUserProfile}
                    />
                </>
            ) : (
                <div>プロフィール情報が見つかりませんでした。</div>
            )}
        </div>
    );
};

export const SettingsPage: React.FC = () => {
    const navigate = useNavigate();

    const settingsHeaderButtons: HeaderButtonType[] = [
        { label: 'プロフィール', onClick: () => { window.location.href = '/profile'; } },
        {
            label: 'ログアウト',
            onClick: async () => {
                try {
                    // localStorageからトークンを削除
                    localStorage.removeItem('appToken');
                    // Firebaseからサインアウト
                    await signOut(fireAuth);
                    navigate('/')
                    // ホームページにリダイレクト
                    window.location.href = '/';
                } catch (error) {
                    console.error('ログアウトエラー:', error);
                    alert('ログアウト中にエラーが発生しました。');
                }
            }
        },
    ];

    return (
        <div>
            <CustomHeader $buttons={settingsHeaderButtons} />
            <SettingsContent />
        </div>
    );
};