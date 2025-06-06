import React from 'react';
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

const PostItemContainer = styled.div`
    border: 1px solid: #ccc; /* X風の薄い境界線 */
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

export const PostItem: React.FC<PostItemProps> = ({ post }) => {
    // 投稿日時をフォーマットする例 (必要に応じてライブラリを使用)
    const formattedTimestamp = post.timestamp
        ? new Date(post.timestamp).toLocaleString()
        : '';

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
            {post.timestamp && <UserIdAndTimestamp style={{ marginTop: '8px', textAlign: 'right' }}>{formattedTimestamp}</UserIdAndTimestamp>}
            {/* 画像やインタラクションボタンなどをここに追加 */}
        </PostItemContainer>
    );
};