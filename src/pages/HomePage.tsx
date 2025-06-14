import React, { useState, useEffect } from 'react';
import { CustomHeader, type HeaderButtonType } from '../components/layout';
import { CreatePostForm, usePosts } from '../components/NewPost';
import { PostItem } from '../components/PostItem';
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
            <CustomHeader buttons={homeHeaderButtons} />
            <CreatePostForm onSubmit={createPost} idToken={idToken} />
            {isLoading && <div>読み込み中...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {posts.map(post => (
                <PostItem
                    key={post.id}
                    post={{
                        id: post.id,
                        userId: post.userId,
                        text: post.text,
                        image: post.image,
                        createdAt: post.createdAt,
                        likeCount: 0,
                        commentCount: 0
                    }}
                    user={{
                        name: post.user?.name || 'Unknown User',
                        userId: post.user?.userId || post.userId,
                        iconUrl: post.user?.iconUrl || '',
                        bio: post.user?.bio || '',
                        firebaseUid: post.user?.firebaseUid || post.userId,
                        createdAt: post.user?.createdAt || post.createdAt
                    }}
                />
            ))}
        </div>
    );
};