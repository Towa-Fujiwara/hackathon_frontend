import React, { useState } from 'react';
import styled from 'styled-components';
import { type UserProfile } from './UserProfile';
import { apiClient } from '../firebase';

export type PostItemData = {
    id: string;
    userId: string;
    text: string;
    image: string;
    createdAt: string;
    likeCount: number;
    commentCount: number;
};

type PostItemProps = {
    post: PostItemData;
    user: UserProfile;
};

const HeartIcon: React.FC<{ color?: string; size?: number; }> = ({ color = 'currentColor', size = 18 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></g></svg>
);

const ReplyIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.36.656.36.272 0 .514-.135.656-.36l6.088-9.85c.143-.23.228-.517.228-.823s-.085-.593-.228-.823l-6.088-9.85c-.142-.225-.384-.36-.656-.36-.272 0-.514.135-.656-.36z"></path></g></svg>
);

const PostItemContainer = styled.div`
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;

const AuthorInfo = styled.div`
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    color: rgb(0,0,0);
`;

const DisplayName = styled.span`
    font-weight: bold;
`;

const UserIdAndTimestamp = styled.span`
    color: #536471;
    font-size: 0.9em;
`;

const PostText = styled.p`
    margin: 0;
    line-height: 1.4;
    white-space: pre-wrap;
    color: rgb(0,0,0);
`;

const ProfileIconPlaceholder = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #ccc;
`;

const PostActionsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    max-width: 425px;
    color: #536471;
`;

const ActionButton = styled.button<{ $isActive?: boolean; $activeColor?: string; }>`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 13px;
    padding: 5px;
    border-radius: 999px;
    transition: background-color 0.2s, color 0.2s;
    color: ${props => props.$isActive ? props.$activeColor : '#536471'};
    
    &:hover {
        color: ${props => props.$activeColor || '#536471'};
        background-color: ${props => props.$activeColor ? `${props.$activeColor}1A` : '#0f14191A'};
    }
`;

const ActionCount = styled.span`
    margin-left: 6px;
`;

export const PostItem: React.FC<PostItemProps> = ({ post, user }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const previousIsLiked = isLiked;
        const previousLikeCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await apiClient.post(`/posts/${post.id}/like`);
        } catch (error) {
            console.error("いいねの処理に失敗しました:", error);
            setIsLiked(previousIsLiked);
            setLikeCount(previousLikeCount);
            alert("エラーが発生しました。再度お試しください。");
        }
    };

    const handleReplyClick = (e: React.MouseEvent) => { e.stopPropagation(); alert('返信'); };

    return (
        <PostItemContainer>
            <PostHeader />
            <ProfileIconPlaceholder />
            <AuthorInfo>
                <DisplayName>{user.name}</DisplayName>
                <UserIdAndTimestamp>@{user.userId} · {post.createdAt}</UserIdAndTimestamp>
            </AuthorInfo>
            <PostText>{post.text}</PostText>
            <PostActionsContainer>
                <ActionButton onClick={handleLikeClick} $isActive={isLiked} $activeColor="#F91880">
                    <HeartIcon color={isLiked ? '#F91880' : undefined} />
                    {likeCount > 0 && <ActionCount>{likeCount}</ActionCount>}
                </ActionButton>
                <ActionButton onClick={handleReplyClick} $activeColor="#1D9BF0">
                    <ReplyIcon />
                </ActionButton>
            </PostActionsContainer>
        </PostItemContainer>
    );
};