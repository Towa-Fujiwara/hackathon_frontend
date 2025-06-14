import React, { useState } from 'react';
import styled from 'styled-components';
import { type UserProfile } from './UserProfile';

// PostItemが受け取るpropsの型定義
export type PostItemData = {
    user: UserProfile
    postId: number;
    text: string;
    timestamp?: string; // 投稿日時 (文字列として渡すか、Dateオブジェクトで渡してフォーマットするか)
    imageUrl?: string; // 添付画像のURL
    likeCount?: number;
    retweetCount?: number;
};

type PostItemProps = {
    post: PostItemData;
};


const HeartIcon: React.FC<{ color?: string; size?: number; }> = ({ color = 'currentColor', size = 18 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></g></svg>
);

const ReplyIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.36.656.36.272 0 .514-.135.656-.36l6.088-9.85c.143-.23.228-.517.228-.823s-.085-.593-.228-.823l-6.088-9.85c-.142-.225-.384-.36-.656-.36-.272 0-.514.135-.656-.36z"></path></g></svg>
);

const PostItemContainer = styled.div`
    border: 1px solid #ccc; /* X風の薄い境界線 */
    padding: 15px;
    margin-bottom: 10px; /* 各投稿間のマージン */
    background-color: #fff;
    display: flex;
    flex-direction: column; /* 縦に要素を並べる */
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;

const AuthorInfo = styled.div`
    margin-left: 10px;
    display: flex;
    flex-direction: column; /* 名前とIDを縦に */
    color: rgb(0,0,0);
`;

const DisplayName = styled.span`
    font-weight: bold;
`;

const UserIdAndTimestamp = styled.span`
    color: #536471; /* X風のグレー */
    font-size: 0.9em;
`;

const PostText = styled.p`
    margin: 0;
    line-height: 1.4;
    white-space: pre-wrap; /* 改行をそのまま表示 */
    color: rgb(0,0,0);
`;

// 今はプロフィールページなので投稿者情報は固定かもしれないが、汎用的に作るならpropsで渡す
const ProfileIconPlaceholder = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #ccc; /
`;


const PostActionsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    max-width: 425px; /* XのUIに近い幅 */
    color: #536471;
`;

// activeColorプロパティを受け取り、アクティブ時の色を変更する
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

    /* propsに応じて色を変更 */
    color: ${props => props.$isActive ? props.$activeColor : '#536471'};
    
    &:hover {
        color: ${props => props.$activeColor || '#536471'};
        background-color: ${props => props.$activeColor ? `${props.$activeColor}1A` : '#0f14191A'};
    }
`;

const ActionCount = styled.span`
    margin-left: 6px;
`;

export const PostItem: React.FC<PostItemProps> = ({ post }) => {
    // 投稿日時をフォーマットする例 (必要に応じてライブラリを使用)
    const formattedTimestamp = post.timestamp
        ? new Date(post.timestamp).toLocaleString()
        : '';

    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);

    // いいねボタンのクリック処理
    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 親要素へのイベント伝播を停止
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };


    // 返信・共有ボタンのダミー処理
    const handleReplyClick = (e: React.MouseEvent) => { e.stopPropagation(); alert('返信'); };

    return (
        <PostItemContainer>
            {/* プロフィールページ内の自分の投稿なので、投稿者情報は省略または固定化するケースもある */}
            <PostHeader />
            <ProfileIconPlaceholder />
            <AuthorInfo>
                <DisplayName>{post.user.displayName}</DisplayName>
                <UserIdAndTimestamp>@{post.user.userId} · {formattedTimestamp}</UserIdAndTimestamp>
            </AuthorInfo>
            <PostText>{post.text}</PostText>
            {/* 画像やインタラクションボタンなどをここに追加 */}
            <PostActionsContainer>
                {/* いいねボタン */}
                <ActionButton onClick={handleLikeClick} $isActive={isLiked} $activeColor="#F91880">
                    <HeartIcon color={isLiked ? '#F91880' : undefined} />
                    {likeCount > 0 && <ActionCount>{likeCount}</ActionCount>}
                </ActionButton>
                {/* 返信ボタン */}
                <ActionButton onClick={handleReplyClick} $activeColor="#1D9BF0">
                    <ReplyIcon />
                </ActionButton>
            </PostActionsContainer>
        </PostItemContainer>
    );
};