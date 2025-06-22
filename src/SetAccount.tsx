import React, { useState, useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { fireAuth, apiClient } from './firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styled from 'styled-components';

const storage = getStorage();


const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    border: 2px solid rgb(229, 255, 0);
    border-radius: 8px;
    margin-top: 20px;
    background-color: rgb(24, 185, 226);
    color: #000000;
    justify-content: space-between;
    align-items: flex-start;
`;

const FormFields = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex-grow: 1;
`;

const Label = styled.label`
    font-weight: bold;
    color: #333;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #ffffff;
    color: #000000;
`;

const TextArea = styled.textarea`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-height: 80px;
    background-color: #ffffff;
    color: #000000;
    resize: none;
`;

const FileInput = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #ffffff;
    color: #000000;
`;

const Button = styled.button`
    padding: 10px 15px;
    border-radius: 4px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-weight: bold;
    &:disabled {
        background-color: #ccc;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    margin: 10px 0;
`;

export const SetAccount: React.FC = () => {
    // フォームの入力値をstateで管理
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

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
        setError(null);
        setIsUploading(true);

        if (!idToken || !fireAuth.currentUser) {
            setError("認証トークンが見つかりません。ログイン状態を確認してください。");
            return;
        }
        if (!userId || userId.length < 3) {
            setError("ユーザーIDは3文字以上で入力してください。");
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
            setError("ユーザーIDは半角英数字のみ使用できます。");
            return;
        }
        try {
            let iconUrl = '';
            if (iconFile) {
                const storageRef = ref(storage, `usericons/${fireAuth.currentUser.uid}/${iconFile.name}`);
                await uploadBytes(storageRef, iconFile);
                iconUrl = await getDownloadURL(storageRef);
            }
            await apiClient.post(
                '/users',
                {
                    userId: userId,
                    name: name,
                    bio: bio,
                    iconUrl: iconUrl
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log("ようこそ！登録が完了しました。");
            window.location.href = '/';

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <FormContainer>
            <h2>アカウントを作成</h2>
            <p>ようこそ！使用するユーザー名と自己紹介を入力してください。</p>
            <form onSubmit={handleSubmit}>
                <FormFields>
                    <Label htmlFor="userId">ユーザーID (半角英数)</Label>
                    <Input
                        id="userId"
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </FormFields>
                <FormFields>
                    <Label htmlFor="name">ユーザー名</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </FormFields>
                <FormFields>
                    <Label htmlFor="bio">自己紹介</Label>
                    <TextArea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </FormFields>
                <FormFields>
                    <Label htmlFor="iconUrl">ユーザーアイコン</Label>
                    <FileInput
                        id="iconUrl"
                        type="file"
                        accept="image/*"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files && e.target.files[0]) {
                                setIconFile(e.target.files[0]);
                            }
                        }}
                    />
                </FormFields>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Button type="submit" disabled={isUploading}>
                    {isUploading ? '登録中...' : '登録してはじめる'}
                </Button>
            </form>
        </FormContainer>
    );
};