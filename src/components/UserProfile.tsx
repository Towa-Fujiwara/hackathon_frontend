import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiClient } from '../firebase';

export type UserProfile = {
    userId: string;
    firebaseUid: string;
    name: string;
    bio: string;
    iconUrl: string;
    createdAt: string;
};

export type UserProfileCardProps = {
    user: UserProfile;
};

export const CardContainer = styled.div`
    padding: 20px;
    border-bottom: 1px solid #eee;
    position: relative; 
    width: 860px;  
    height: 75px;  
    display: flex;
    flex-direction: row;  
    justify-content: center; 
    align-items: center;  
    padding: 20px;
    gap: 15px;
    left: 0px;
    top: 0px;
    background-color: #ffffff;  // 背景色を設定
    color: rgb(0, 0, 0); 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  // 影を追加
`;

export const ProfileIcon = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
`;

export const UserName = styled.h2`
    margin: 0;
`;

export const UserId = styled.p`
    color: gray;
`;

const FollowStats = styled.div`
    display: flex;
    gap: 20px;
    margin-left: auto;
`;

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
    const [followCounts, setFollowCounts] = useState({ followingCount: 0, followersCount: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFollowData = async () => {
            if (!user?.userId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                // フォロー・フォロワーリストを並行して取得
                const [followingRes, followersRes] = await Promise.all([
                    apiClient.get(`/users/${user.userId}/following`),
                    apiClient.get(`/users/${user.userId}/followers`)
                ]);

                const followingData = followingRes.data || [];
                const followersData = followersRes.data || [];

                setFollowCounts({
                    followingCount: Array.isArray(followingData) ? followingData.length : 0,
                    followersCount: Array.isArray(followersData) ? followersData.length : 0,
                });
            } catch (err) {
                console.error("フォロー関連データの取得に失敗しました", err);
                setError("情報の取得に失敗しました。");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFollowData();
    }, [user?.userId]);

    return (
        <CardContainer>
            {user.iconUrl && <ProfileIcon src={user.iconUrl} alt={`${user.name} icon`} />}
            <UserName>{user.name}</UserName>
            <UserId>@{user.userId}</UserId>
            <p>{user.bio}</p>

            <FollowStats>
                {isLoading ? (
                    <span>読み込み中...</span>
                ) : (
                    <>
                        <span><b>{followCounts.followingCount}</b> フォロー</span>
                        <span><b>{followCounts.followersCount}</b> フォロワー</span>
                    </>
                )}
            </FollowStats>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </CardContainer>
    );
};
