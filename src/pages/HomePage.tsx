import React, { useState, useEffect } from 'react';
import { CustomHeader, type HeaderButtonType } from '../components/layout';
import { CreatePostForm, usePosts } from '../components/NewPost';
import { PostItem } from '../components/PostItem';
import GeminiSummary from '../components/GeminiSummary';
import { fireAuth } from '../firebase';


export const homeHeaderButtons: HeaderButtonType[] = [
    { label: "おすすめ", onClick: () => console.log("Header Button h1"), topOffset: "0px" },
    { label: "最新", onClick: () => console.log("Header Button h2"), topOffset: "0px" },
    { label: "フォロー中", onClick: () => console.log("Header Button h3"), topOffset: "0px" },
];





export const HomePage: React.FC = () => {
    const [idToken, setIdToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const user = fireAuth.currentUser;
            if (user) {
                try {
                    const token = await user.getIdToken(true); // トークンを強制的に更新して取得
                    setIdToken(token);
                } catch (error) {
                    console.error('Error fetching ID token:', error);
                }
            }
        };
        fetchToken();
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

    const { posts, createPost, isLoading, error } = usePosts(idToken);
    return (
        <div>
            <CustomHeader $buttons={homeHeaderButtons} />
            <CreatePostForm onSubmit={createPost} idToken={idToken} />
            {isLoading && <div>読み込み中...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {posts.map(post => {
                console.log('HomePage: post:', post);
                return (
                    <PostItem
                        key={post.id}
                        post={{
                            id: post.id,
                            userId: post.userId,
                            name: post.name,
                            text: post.text,
                            image: post.image,
                            createdAt: post.createdAt,
                            likeCount: 0,
                            commentCount: 0
                        }}
                        user={{
                            name: post.name,
                            userId: post.userId,
                            iconUrl: post.iconUrl || 'https://via.placeholder.com/48x48/cccccc/ffffff?text=U',
                            bio: '',
                            firebaseUid: post.userId,
                            createdAt: post.createdAt
                        }}
                    />
                );
            })}
            <GeminiSummary />
        </div>
    );
};