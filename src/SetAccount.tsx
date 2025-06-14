import React, { useState, useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { fireAuth } from './firebase';
export const SetAccount: React.FC = () => {
    // フォームの入力値をstateで管理
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [iconUrl, setIconUrl] = useState('');
    const [idToken, setIdToken] = useState<string | null>(null);


    useEffect(() => {
        const unsubscribe = onIdTokenChanged(fireAuth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken(true);
                    setIdToken(token);
                    setError(null);
                } catch (err) {
                    console.error('Error fetching ID token:', err);
                    setError("認証情報の取得に失敗しました。再度ログインしてください。");
                    setIdToken(null);
                }
            } else {
                setIdToken(null);
                setError("ログインしていません。");
            }
        });

        // コンポーネントのアンマウント時にリスナーを解除
        return () => unsubscribe();
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // エラーをリセット

        if (!idToken) {
            setError("認証トークンが見つかりません。ログイン状態を確認してください。");
            return;
        }
        if (!userId || userId.length < 3) {
            setError("ユーザーIDは3文字以上で入力してください。");
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
            setError("ユーザーIDは半角英数字とアンダースコアのみ使用できます。");
            return;
        }
        try {
            const response = await fetch('https://hackathon-backend-723035348521.us-central1.run.app/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    name: name,
                    bio: bio,
                    iconUrl: iconUrl
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'プロフィールの更新に失敗しました。');
            }
            console.log("ようこそ！登録が完了しました。");
            window.location.href = '/';

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>アカウント情報を登録</h2>
            <p>ようこそ！初回ログインありがとうございます。使用するユーザー名と自己紹介を入力してください。</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userId">ユーザーID (半角英数)</label>
                    <input
                        id="userId"
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="name">ユーザー名</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="bio">自己紹介</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="iconUrl">ユーザーアイコン</label>
                    <input
                        id="iconUrl"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setIconUrl(URL.createObjectURL(e.target.files[0]));
                            }
                        }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">登録してはじめる</button>
            </form>
        </div>
    );
};//a