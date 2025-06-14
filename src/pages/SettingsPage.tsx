import React, { useState, useEffect } from 'react';
import { type UserProfile, UserProfileCard } from '../components/UserProfile'; // UserProfileCardをインポート
import { CustomHeader } from '../components/layout';
import { type HeaderButtonType } from '../components/layout';



const settingsHeaderButtons: HeaderButtonType[] = [
    { label: 'プロフィール', onClick: () => { window.location.href = '/profile'; } },
    { label: 'ログアウト', onClick: () => { localStorage.removeItem('appToken'); window.location.href = '/'; } },
];

export const ProfilePage: React.FC = () => {
    // プロフィール情報、ローディング状態、エラーを管理するstate
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // プロフィール情報を取得する非同期関数
        const fetchProfile = async () => {
            // 1. localStorageからトークンを取得
            const token = localStorage.getItem('appToken');

            if (!token) {
                setError('ログインしていません。');
                setIsLoading(false);
                // 必要であればログインページにリダイレクト
                // window.location.href = '/login';
                return;
            }

            try {
                // 2. 認証ヘッダーを付けてバックエンドにリクエスト
                const response = await fetch('https://hackathon-backend-723035348521.us-central1.run.app/api/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // "Bearer " + トークン
                    },
                });

                if (!response.ok) {
                    // トークン切れなどのエラー
                    throw new Error('プロフィールの取得に失敗しました。再度ログインしてください。');
                }

                // 3. レスポンスのJSONをUserProfile型として取得
                const data: UserProfile = await response.json();
                setUserProfile(data);

            } catch (err: any) {
                setError(err.message);
                // エラー発生時はトークンを削除して再ログインを促す
                localStorage.removeItem('appToken');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []); // このuseEffectはページがマウントされた時に一度だけ実行される

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
            <h1>マイページ</h1>
            {userProfile ? (
                // 4. UserProfileCardに取得したデータを渡して表示
                <UserProfileCard user={userProfile} />
            ) : (
                <div>プロフィール情報が見つかりませんでした。</div>
            )}
            {/* ここに自分の投稿リストなどを表示していく */}
        </div>
    );
};
export const SettingsPage: React.FC = () => {
    return (
        <div>
            <CustomHeader buttons={settingsHeaderButtons} />
            <ProfilePage />
        </div>
    );
};