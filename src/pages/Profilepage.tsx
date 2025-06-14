import React, { useState, useEffect } from 'react';
import { CustomHeader, type HeaderButtonType } from '../components/layout';
import { UserProfileCard, type UserProfile } from '../components/UserProfile';
import { PostItem, type PostItemData } from '../components/PostItem';
import axios from 'axios';


export const Profiletable: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userPosts, setUserPosts] = useState<PostItemData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Firebaseなどからユーザープロフィール情報を取得する非同期処理
        const fetchUserProfile = async () => {
            const user = await axios.get("https://hackathon-backend-723035348521.us-central1.run.app/api/users/me");
            setUserProfile(user.data);
        };

        // Firebaseなどからユーザーのポスト一覧を取得する非同期処理
        const fetchUserPosts = async () => {
            setIsLoading(true); // 読み込み開始
            setError(null);
            try {
                // バックエンドの /api/posts エンドポイントにGETリクエストを送信
                const response = await axios.get("https://hackathon-backend-723035348521.us-central1.run.app/api/posts/me");
                // 成功したら、取得した投稿データでstateを更新
                setUserPosts(response.data || []);
            } catch (err) {
                // エラーハンドリング
                let errorMessage = "投稿の読み込みに失敗しました。";
                if (axios.isAxiosError(err) && err.response) {
                    errorMessage = err.response.data.error || errorMessage;
                }
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
        fetchUserPosts();
    }, []);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }
    if (!userProfile) {
        return <div>読み込み中...</div>;
    }

    return (
        <div>
            <UserProfileCard user={userProfile} />
            <CustomHeader buttons={profileHeaderButtons} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <PostItem post={userPosts[0]} user={userProfile} />
        </div>
    );
};



export const profileHeaderButtons: HeaderButtonType[] = [
    { label: "ポスト", onClick: () => console.log("Header Button p1"), topOffset: "0px" },
    { label: "返信", onClick: () => console.log("Header Button p2"), topOffset: "0px" },
    { label: "いいね", onClick: () => console.log("Header Button p3"), topOffset: "0px" },
];
export const ProfilePage: React.FC = () => {
    return (
        <div>
            <Profiletable />
        </div>
    );
};