import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { type UserProfile } from './UserProfile';
import { apiClient } from '../firebase';
import axios from 'axios';
import { FaRegComment } from "react-icons/fa6";

export type PostItemData = {
    id: string;
    userId: string;
    name: string;
    text: string;
    image: string;
    createdAt: string;
    likeCount: number;
    commentCount: number;
};

export type CommentData = {
    id: string;
    userId: string;
    postId: string;
    text: string;
    createdAt: string;
};

type PostItemProps = {
    post: PostItemData;
    user: UserProfile;
    showDeleteButton?: boolean;
    onDeleteSuccess?: (postId: string) => void;
};

const HeartIcon: React.FC<{ color?: string; size?: number; }> = ({ color = 'currentColor', size = 18 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></g></svg>
);

const PostItemContainer = styled.div`
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    width: 870px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
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
    margin: 10px 0 0 60px;
    line-height: 1.4;
    white-space: pre-wrap;
    color: rgb(0,0,0);
`;

const ProfileIconPlaceholder = styled.div<{ $iconUrl?: string }>`
    width: 48px;
    height: 48px;
    background-image: ${props => (props.$iconUrl ? `url(${props.$iconUrl})` : 'url(https://cdn-icons-png.flaticon.com/512/1077/1077114.png)')};
    background-size: cover;
    background-position: center;
    border-radius: 50%;
    background-color: #ffffff;
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

const DeleteButton = styled.button`
    border-radius: 12px;
    height: 5px
    border: none;
    background-color:rgb(221, 68, 68);
    color: white;
    cursor: pointer;
    &:disabled {
        background-color: #ccc;
    }
`;

export const PostItem: React.FC<PostItemProps> = ({ post, user, showDeleteButton = false, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);

    // postデータを取得した際のログ出力
    useEffect(() => {
        console.log('PostItem: postデータを取得しました', post);
    }, [post]);

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const previousIsLiked = isLiked;
        const previousLikeCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await apiClient.post(`/posts/${post.id}/like`, {});
        } catch (error) {
            console.error("いいねの処理に失敗しました:", error);
            setIsLiked(previousIsLiked);
            setLikeCount(previousLikeCount);
            alert("エラーが発生しました。再度お試しください。");
        }
    };
    const handleNavigate = () => {
        console.log('PostItem: ナビゲート先のpost.id:', post.id);
        console.log('PostItem: postオブジェクト全体:', post);
        navigate(`/posts/${post.id}`);
    }
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('削除しますか？')) return;
        try {
            await apiClient.delete(`/posts/${post.id}`);
            if (onDeleteSuccess) onDeleteSuccess(post.id);
        } catch (err) {
            alert('削除に失敗しました');
        }
    };
    return (
        <PostItemContainer>
            <PostHeader>
                <Link
                    to={`/profile/${user.userId}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('ProfileIcon clicked, navigating to:', `/profile/${user.userId}`);
                        console.log('user.userId:', user.userId);
                    }}
                >
                    <ProfileIconPlaceholder $iconUrl={user.iconUrl} />
                </Link>
                <AuthorInfo>
                    <Link
                        to={`/profile/${user.userId}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('AuthorInfo clicked, navigating to:', `/profile/${user.userId}`);
                            console.log('user.userId:', user.userId);
                        }}
                    >
                        <DisplayName>{user.name}</DisplayName>
                        <UserIdAndTimestamp>@{user.userId} · {new Date(post.createdAt).toLocaleString()}</UserIdAndTimestamp>
                    </Link>
                </AuthorInfo>
            </PostHeader>
            <PostText>{post.text}</PostText>
            <PostActionsContainer>
                <ActionButton onClick={handleLikeClick} $isActive={isLiked} $activeColor="#F91880">
                    <HeartIcon color={isLiked ? '#F91880' : undefined} />
                    {likeCount > 0 && <ActionCount>{likeCount}</ActionCount>}
                </ActionButton>
                <ActionButton onClick={handleNavigate} $activeColor="#1D9BF0">
                    <FaRegComment size={18} />
                </ActionButton>
                {showDeleteButton && (
                    <DeleteButton onClick={handleDelete}>削除</DeleteButton>
                )}
            </PostActionsContainer>
        </PostItemContainer>
    );
};


export const useComments = (postId: string, idToken: string | null) => {
    // 投稿リストの状態管理
    const [comments, setComments] = useState<CommentData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!postId) {
            return;
        }
        const fetchComments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get(`/posts/${postId}/comments`);
                // 成功したら、取得した投稿データでstateを更新
                setComments(response.data || []);
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

        fetchComments();
    }, [postId]);

    const createComment = async (text: string): Promise<void> => {
        if (!idToken) {
            const errorMessage = "投稿するにはログインが必要です。";
            setError(errorMessage);
            throw new Error(errorMessage);
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post(
                `/posts/${postId}/comments`,
                { text },
            );

            const newComment: CommentData = response.data;

            // 新しい投稿をリストの先頭に追加
            setComments(prevComments => [newComment, ...prevComments]);

        } catch (err) {
            let errorMessage = "不明なエラーが発生しました。";
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data.error || "投稿に失敗しました。";
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return { comments, createComment, isLoading, error };
};