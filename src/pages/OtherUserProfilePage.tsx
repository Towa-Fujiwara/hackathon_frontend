import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserProfileCard, type UserProfile } from '../components/UserProfile';
import { PostItem, type PostItemData } from '../components/PostItem';
import { apiClient } from '../firebase';
import axios from 'axios';
import GeminiSummary from '../components/GeminiSummary';
import { CustomHeader, type HeaderButtonType } from '../components/layout';

export const otherProfileHeaderButtons: HeaderButtonType[] = [
    { label: "ポスト", onClick: () => console.log("Other Profile Header Button p1"), topOffset: "0px" },
    // 他のユーザーのプロフィールに必要なボタンがあればここに追加
];

export const OtherUserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userPosts, setUserPosts] = useState<PostItemData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            if (!userId) {
                setError("ユーザーIDが指定されていません。");
                setIsLoading(false);
                return;
            }

            try {
                // ユーザープロフィールを取得
                const userRes = await apiClient.get<UserProfile>(`/users/id/${userId}`);
                setUserProfile(userRes.data);

                // ユーザーの投稿を取得
                const postsRes = await apiClient.get<PostItemData[]>(`/posts/user/${userId}`);
                if (postsRes.data && Array.isArray(postsRes.data)) {
                    setUserPosts(postsRes.data);
                } else {
                    setUserPosts([]);
                }

            } catch (err) {
                console.error("ユーザーデータまたは投稿の取得に失敗しました:", err);
                let errorMessage = "データの読み込みに失敗しました。";
                if (axios.isAxiosError(err) && err.response) {
                    errorMessage = `エラー: ${err.response.status} - ${err.response.data.error || 'データの取得中に問題が発生しました。'}`;
                }
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!userProfile) {
        return <div>ユーザー情報が見つかりませんでした。</div>;
    }

    return (
        <div>
            <UserProfileCard user={userProfile} />
            <CustomHeader $buttons={otherProfileHeaderButtons} />
            {userPosts.length > 0 ? (
                userPosts.map(post => (
                    // 取得したuserProfileをPostItemに渡す
                    <PostItem key={post.id} post={post} user={userProfile} />
                ))
            ) : (
                <p>まだ投稿がありません。</p>
            )}
            <GeminiSummary userId={userProfile.userId} />
        </div>
    );
};