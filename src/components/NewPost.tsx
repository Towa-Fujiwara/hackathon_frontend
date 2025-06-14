import React, { useState, useEffect } from 'react';
import axios from 'axios';
// 親コンポーネントに渡すデータの型
export interface PostData {
    id: string;
    user_id: string;
    text: string;
    image: string;
    created_at: string;
    like_count: number;
    comment_count: number;
}

export const usePosts = (idToken: string | null) => {
    // 投稿リストの状態管理
    const [posts, setPosts] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true); // 読み込み開始
            setError(null);
            try {
                // バックエンドの /api/posts エンドポイントにGETリクエストを送信
                const response = await axios.get("http://localhost:8080/api/posts");
                // 成功したら、取得した投稿データでstateを更新
                setPosts(response.data || []);
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

        fetchPosts();
    }, []);

    const createPost = async (text: string): Promise<void> => {
        if (!idToken) {
            const errorMessage = "投稿するにはログインが必要です。";
            setError(errorMessage);
            throw new Error(errorMessage);
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:8080/api/posts",
                { text },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${idToken}`,
                    },
                }
            );

            const newPost: PostData = response.data;

            // 新しい投稿をリストの先頭に追加
            setPosts(prevPosts => [newPost, ...prevPosts]);

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

    return { posts, createPost, isLoading, error };
};

interface CreatePostFormProps {
    onSubmit: (text: string) => Promise<void>;
    idToken: string | null;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSubmit, idToken }) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || isSubmitting) return;
        if (!idToken) { // idTokenがない場合は投稿できない
            setError("ログインしていません。"); //
            return; //
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
                placeholder="いまどうしてる？"
                rows={4}
                style={{ width: '100%', resize: 'vertical', border: '1px solid #1DA1F2', borderRadius: '4px', padding: '8px', backgroundColor: '#ffffff', color: 'black' }}
            />
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <button type="submit" disabled={!text.trim() || isSubmitting} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#1DA1F2', color: 'white', fontWeight: 'bold' }}>
                    {isSubmitting ? '投稿中...' : 'ポスト'}
                </button>
            </div>
        </form>
    );
};