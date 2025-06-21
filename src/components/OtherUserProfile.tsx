import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { type UserProfile, CardContainer, ProfileIcon, UserName, UserId } from './UserProfile';
import { apiClient } from '../firebase';
import { useParams } from 'react-router-dom';

export type OtherUserProfile = {
    userId: string;
    firebaseUid: string;
    name: string;
    bio: string;
    iconUrl: string;
    createdAt: string;
};

type OtherUserProfileCardProps = {
    user: UserProfile;
};

const FollowButton = styled.button<{ $isFollowing: boolean }>`
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid ${props => props.$isFollowing ? '#ccc' : '#007bff'};
    background-color: ${props => props.$isFollowing ? 'white' : '#007bff'};
    color: ${props => props.$isFollowing ? '#333' : 'white'};
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        opacity: 0.8;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const FollowStats = styled.div`
    display: flex;
    gap: 20px;
    margin-top: 15px;
`;

export const OtherUserProfileCard: React.FC<OtherUserProfileCardProps> = ({ user }) => {
    const { userId } = useParams<{ userId: string }>(); // URLからuserIdを取得
    const [isFollowing, setIsFollowing] = useState(false);
    const [followCounts, setFollowCounts] = useState({ followingCount: 0, followersCount: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFollowData = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                // is-followingとフォロー・フォロワーリストを並行して取得
                const [isFollowingRes, followingRes, followersRes] = await Promise.all([
                    apiClient.get(`/users/${userId}/is-following`),
                    apiClient.get(`/users/${userId}/following`),
                    apiClient.get(`/users/${userId}/followers`)
                ]);

                const followingData = followingRes.data || [];
                const followersData = followersRes.data || [];

                setIsFollowing(isFollowingRes.data.isFollowing);
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
    }, [userId]);

    const handleFollowToggle = async () => {
        if (!userId || isLoading) return;

        setIsLoading(true);
        setError(null);
        try {
            if (isFollowing) {
                // アンフォロー処理 (DELETE .../follow)
                await apiClient.delete(`/users/${userId}/follow`);
                setFollowCounts(prev => ({ ...prev, followersCount: prev.followersCount - 1 }));
            } else {
                // フォロー処理 (POST .../follow)
                await apiClient.post(`/users/${userId}/follow`);
                setFollowCounts(prev => ({ ...prev, followersCount: prev.followersCount + 1 }));
            }
            setIsFollowing(!isFollowing); // 状態をトグル
        } catch (err) {
            console.error("フォロー/アンフォロー処理に失敗しました", err);
            setError("操作に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CardContainer>
            <ProfileIcon src={user.iconUrl} alt={`${user.name}のアイコン`} />
            <UserName>{user.name}</UserName>
            <UserId>@{user.userId}</UserId>
            <p>{user.bio}</p>

            <FollowStats>
                <span><b>{followCounts.followingCount}</b> フォロー</span>
                <span><b>{followCounts.followersCount}</b> フォロワー</span>
            </FollowStats>

            <div style={{ marginTop: '20px' }}>
                <FollowButton
                    onClick={handleFollowToggle}
                    disabled={isLoading}
                    $isFollowing={isFollowing}
                >
                    {isLoading ? '処理中...' : (isFollowing ? 'フォロー中' : 'フォローする')}
                </FollowButton>
            </div>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </CardContainer>
    );
};



