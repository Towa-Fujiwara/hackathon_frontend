import React, { useState } from 'react';

export const SetAccount: React.FC = () => {
    // フォームの入力値をstateで管理
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [userIcon, setUserIcon] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // localStorageからトークンを取得
        const token = localStorage.getItem('appToken');
        if (!token) {
            setError("認証トークンが見つかりません。再度ログインしてください。");
            return;
        }

        try {
            // プロフィール更新APIを叩く
            const response = await fetch('http://localhost:8080/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: userId, bio: bio, username: username, iconUrl: userIcon }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'プロフィールの更新に失敗しました。');
            }

            // 成功したらトップページにリダイレクト
            alert("ようこそ！登録が完了しました。");
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
                    <label htmlFor="username">ユーザー名</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <label htmlFor="userIcon">ユーザーアイコン</label>
                    <input
                        id="userIcon"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setUserIcon(URL.createObjectURL(e.target.files[0]));
                            }
                        }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">登録してはじめる</button>
            </form>
        </div>
    );
};