import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomHeader, type HeaderButtonType } from '../components/layout';
import { CreatePostForm, useFollowPosts } from '../components/NewPost';
import { PostItem } from '../components/PostItem';
import { fireAuth, apiClient } from '../firebase';
import { MainSearchBar, SearchResultsContainer, UserProfileItem } from '../components/SearchBar';
import { type UserProfile } from '../components/UserProfile';
import { Link } from 'react-router-dom'
import '../app.css';


export const FollowPosts: React.FC = () => {
    const navigate = useNavigate();
    const [idToken, setIdToken] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [currentSearchQuery, setCurrentSearchQuery] = useState<string | null>(null);

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
    const { posts, createFollowPost, isLoading, error } = useFollowPosts(idToken);
    const handleSearch = async (query: string) => {
        setIsLoadingResults(true);
        setSearchError(null);
        setCurrentSearchQuery(query); // 現在の検索クエリを保存
        try {
            const res = await apiClient.get<UserProfile[]>("/search", {
                params: { q: query }
            });
            setSearchResults(res.data || []);
            console.log("検索結果:", res.data);
        } catch (err) {
            console.error("検索に失敗しました:", err);
            setSearchError("検索に失敗しました。");
            setSearchResults([]); // エラー時は結果をクリア
        } finally {
            setIsLoadingResults(false);
        }
    };

    const handleLatestClick = () => {
        // 最新の投稿を再取得
        navigate('/');
    };

    const handleFollowingClick = () => {
        window.location.reload();
    };

    const homeHeaderButtons: HeaderButtonType[] = [
        { label: "最新", onClick: handleLatestClick, topOffset: "0px" },
        { label: "フォロー中", onClick: handleFollowingClick, topOffset: "0px" },
    ];

    return (
        <div>
            <CustomHeader $buttons={homeHeaderButtons} />
            <MainSearchBar onSearch={handleSearch} /> {/* MainSearchBarを配置 */}

            {/* 検索結果の表示エリア */}
            {currentSearchQuery && ( // 検索クエリが存在する場合のみ表示
                <div style={{
                    position: 'absolute', // 親要素 (HomePage) に対して絶対配置
                    top: '60px', // Headerの高さ + SearchBarの高さ
                    right: '0', // MainSearchBarと同じright
                    width: '270px', // MainSearchBarと同じ幅
                    paddingTop: '10px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 999, // 適切なz-indexを設定
                    borderRadius: '8px',
                    maxHeight: 'calc(100vh - 70px)', // 画面の高さいっぱいにならないように調整
                    overflowY: 'auto'
                }}>
                    <SearchResultsContainer style={{ position: 'static', width: 'auto', left: 'auto', top: 'auto', boxShadow: 'none' }}>
                        <h2>「{currentSearchQuery}」の検索結果</h2>
                        {isLoadingResults && <div>検索中...</div>}
                        {searchError && <div style={{ color: 'red' }}>{searchError}</div>}
                        {!isLoadingResults && !searchError && searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <UserProfileItem key={user.userId}>
                                    <Link to={`/profile/${user.userId}`}>
                                        {user.name} (@{user.userId})
                                    </Link>
                                </UserProfileItem>
                            ))
                        ) : (
                            !isLoadingResults && !searchError && <p>検索結果が見つかりませんでした。</p>
                        )}
                    </SearchResultsContainer>
                </div>
            )}
            <CreatePostForm onSubmit={createFollowPost} idToken={idToken} />
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
        </div>
    );
};