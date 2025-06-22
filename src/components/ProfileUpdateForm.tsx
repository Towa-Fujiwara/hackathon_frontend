import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { type UserProfile, } from './UserProfile';
import { apiClient, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const IconContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;

interface ProfileUpdateFormProps {
    userProfile: UserProfile;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const FormContainer = styled.form`
    display: flex;
    flex-direction: row;
    gap: 5px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 20px;
    background-color: #f9f9f9;
    color: #000000;
    justify-content: space-between;
    align-items: flex-start;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const FormFields = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex-grow: 1;
`;

export const ProfileIcon = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    right: 20px;
    top: 10px;
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

const Message = styled.p<{ $isError?: boolean }>`
    color: ${props => props.$isError ? '#d9534f' : '#5cb85c'};
    text-align: center;
`;

export const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({ userProfile, onProfileUpdate }) => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
            setBio(userProfile.bio || '');
        }
    }, [userProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            let iconUrl = userProfile.iconUrl; // 既存のURLをデフォルト値とする

            // 新しいアイコンファイルが選択されている場合のみアップロード
            if (iconFile) {
                const storageRef = ref(storage, `usericons/${userProfile.firebaseUid}/${iconFile.name}`);
                await uploadBytes(storageRef, iconFile);
                iconUrl = await getDownloadURL(storageRef);
            }

            const response = await apiClient.put<UserProfile>('/users/me', {
                name,
                bio,
                iconUrl, // 更新されたURLを送信
            });
            setSuccessMessage('プロフィールを更新しました！');
            onProfileUpdate(response.data); // 親コンポーネントのstateを更新
        } catch (err) {
            setError('プロフィールの更新に失敗しました。');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormFields>
                <h2>
                    プロフィールを編集
                </h2>
                <div>
                    <label htmlFor="name">
                        <h4>
                            名前
                        </h4>
                    </label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="bio">
                        <h4>
                            自己紹介
                        </h4>
                    </label>
                    <TextArea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="icon">
                        <h4>
                            アイコン画像
                        </h4>
                    </label>
                    <Input
                        id="icon"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setIconFile(e.target.files[0]);
                            }
                        }}
                    />
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? '更新中...' : '更新する'}
                </Button>
                {error && <Message $isError>{error}</Message>}
                {successMessage && <Message>{successMessage}</Message>}
            </FormFields>
            <IconContainer>
                {userProfile.iconUrl && <ProfileIcon src={userProfile.iconUrl} alt="現在のアイコン" />}
            </IconContainer>
        </FormContainer>
    );
}; 