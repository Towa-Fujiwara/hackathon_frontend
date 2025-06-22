import React, { useState, useEffect } from 'react';
import { type UserProfile } from '../components/UserProfile'; // UserProfileCardをインポート
import { CustomHeader } from '../components/layout';
import { type HeaderButtonType } from '../components/layout';
import { apiClient } from '../firebase';
import { signOut } from 'firebase/auth';
import { fireAuth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ProfileUpdateForm } from '../components/ProfileUpdateForm';
import { MainSearchBar, SearchResultsContainer, UserProfileItem } from '../components/SearchBar';
import { Link } from 'react-router-dom';

const SettingsContent: React.FC = () => {
    // プロフィール情報、ローディング状態、エラーを管理するstate
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 検索関連のstate
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [currentSearchQuery, setCurrentSearchQuery] = useState<string | null>(null);

    useEffect(() => {
        // プロフィール情報を取得する非同期関数
        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // apiClientでGETリクエスト
                const response = await apiClient.get('/users/me');
                console.log('[SettingsContent] Profile fetched:', response.data);
                setUserProfile(response.data);
            } catch (err: any) {
                console.error('[SettingsContent] Failed to fetch profile:', err);
                setError(err.message);
                // エラー発生時はトークンを削除して再ログインを促す
                localStorage.removeItem('appToken');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []); // このuseEffectはページがマウントされた時に一度だけ実行される

    // 検索処理
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

    // ★デバッグログ追加
    console.log('[SettingsContent] State:', { isLoading, error, userProfile });

    // ローディング中の表示
    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    // エラー発生時の表示
    if (error) {
        return <div>エラー: {error}</div>;
    }

    // プロフィールデータが正常に取得できた場合の表示
    return (
        <div>
            <MainSearchBar onSearch={handleSearch} /> {/* MainSearchBarを配置 */}

            {/* 検索結果の表示エリア */}
            {currentSearchQuery && ( // 検索クエリが存在する場合のみ表示
                <div style={{
                    position: 'absolute', // 親要素に対して絶対配置
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

            {userProfile ? (
                <>
                    <ProfileUpdateForm
                        userProfile={userProfile}
                        onProfileUpdate={setUserProfile}
                    />
                </>
            ) : (
                <div>プロフィール情報が見つかりませんでした。</div>
            )}
        </div>
    );
};

export const SettingsPage: React.FC = () => {
    const navigate = useNavigate();

    const settingsHeaderButtons: HeaderButtonType[] = [
        { label: 'プロフィール', onClick: () => { window.location.href = '/profile'; } },
        {
            label: 'ログアウト',
            onClick: async () => {
                try {
                    // localStorageからトークンを削除
                    localStorage.removeItem('appToken');
                    // Firebaseからサインアウト
                    await signOut(fireAuth);
                    navigate('/')
                    // ホームページにリダイレクト
                    window.location.href = '/';
                } catch (error) {
                    console.error('ログアウトエラー:', error);
                    alert('ログアウト中にエラーが発生しました。');
                }
            }
        },
    ];

    return (
        <div>
            <CustomHeader $buttons={settingsHeaderButtons} />
            <SettingsContent />
        </div>
    );
};