import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient, fireAuth } from '../firebase';
import { PostItem, type PostItemData } from '../components/PostItem';
import { CommentItem, CreateCommentForm, useComments } from '../components/CommentItem';
import { type UserProfile } from '../components/UserProfile';
import { type CommentData } from '../components/PostItem';
import styled from 'styled-components';

const PostPageContainer = styled.div`
    width: 900px;
    margin: 0 auto;
    padding-top: 20px;
`;

const CommentsSection = styled.div`
    margin-top: 15px;
`;

export const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [idToken, setIdToken] = useState<string | null>(null);
    const [post, setPost] = useState<PostItemData | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { comments, createComment } = useComments(postId!, idToken);
    useEffect(() => {
        // FirebaseからIDトークンを取得
        const unsubscribe = fireAuth.onIdTokenChanged(async (user) => {
            if (user) {
                const token = await user.getIdToken();
                setIdToken(token);
            } else {
                setIdToken(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!postId) return;
        const fetchPostDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const postRes = await apiClient.get(`/posts/${postId}`);
                setPost(postRes.data);
                if (postRes.data.userId) {
                    const userRes = await apiClient.get(`/users/id/${postRes.data.userId}`);
                    setUser(userRes.data);
                }

            } catch (err) {
                console.error("投稿の取得に失敗しました:", err);
                setError("投稿の読み込みに失敗しました。");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPostDetails();
    }, [postId]);
    if (isLoading) {
        return <PostPageContainer><div>読み込み中...</div></PostPageContainer>;
    }
    if (error) {
        return <PostPageContainer><div style={{ color: 'red' }}>エラー: {error}</div></PostPageContainer>;
    }
    if (!post || !user) {
        return <PostPageContainer><div>投稿が見つかりませんでした。</div></PostPageContainer>;
    }
    return (
        <PostPageContainer>
            <CreateCommentForm onSubmit={createComment} idToken={idToken} />
            <PostItem post={post} user={user} />
            <CommentsSection>
                {comments.map((comment: CommentData) => (
                    <CommentItem key={comment.id} comment={comment} user={user} />
                ))}

            </CommentsSection>
        </PostPageContainer>
    )

}