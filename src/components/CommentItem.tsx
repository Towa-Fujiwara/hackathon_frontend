import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { type CommentData } from './PostItem';
import { type UserProfile } from './UserProfile';
import { apiClient } from '../firebase';
import axios from 'axios';



type CommentProps = {
    comment: CommentData;
    user: UserProfile;
}

interface CreateCommentFormProps {
    onSubmit: (text: string) => Promise<void>;
    idToken: string | null;
}

const CommentItemContainer = styled.div`
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    width: 870px;
`;

const CommentHeader = styled.div`
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

const CommentText = styled.p`
    margin: 0;
    line-height: 1.4;
    white-space: pre-wrap;
    color: rgb(0,0,0);
`;

const ProfileIconPlaceholder = styled.div<{ $iconUrl?: string }>`
    width: 48px;
    height: 48px;
    background-image: ${props => (props.$iconUrl ? `url(${props.$iconUrl})` : 'none')};
    border-radius: 50%;
    background-color: #ccc;
`;


const CommentActionsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    max-width: 425px;
    color: #536471;
`;
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
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${idToken}`,
                    },
                }
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

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ onSubmit, idToken }) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || isSubmitting) return;
        if (!idToken) {
            setError("ログインしていません。");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit(text);
            setText('');
        } catch (err) {
            setError(err instanceof Error ? err.message : "投稿に失敗しました。");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} style={{ padding: '10px', borderBottom: '1px solid #1DA1F2' }}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="返信を作成"
                rows={4}
                style={{ width: '90%', resize: 'vertical', border: '1px solid #1DA1F2', borderRadius: '4px', padding: '8px', backgroundColor: '#ffffff', color: 'black' }}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <button type="submit" disabled={!text.trim() || isSubmitting} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#1DA1F2', color: 'white', fontWeight: 'bold' }}>
                    {isSubmitting ? '投稿中...' : 'コメント'}
                </button>
            </div>
        </form>
    );
};

export const CommentItem: React.FC<CommentProps> = ({ comment, user }) => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/posts/${comment.id}`);
    }
    return (
        <CommentItemContainer onClick={handleNavigate}>
            <CommentHeader />
            <ProfileIconPlaceholder $iconUrl={user.iconUrl} />
            <AuthorInfo>
                <DisplayName>{user.name}</DisplayName>
                <UserIdAndTimestamp>@{user.userId} · {comment.createdAt}</UserIdAndTimestamp>
            </AuthorInfo>
            <CommentText>{comment.text}</CommentText>
            <CommentActionsContainer>
            </CommentActionsContainer>
        </CommentItemContainer>
    );
}