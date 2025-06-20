import React, { useState, useEffect } from 'react';
import { CustomHeader, type HeaderButtonType } from '../components/layout';
import { UserProfileCard, type UserProfile } from '../components/UserProfile';
import { PostItem, type PostItemData } from '../components/PostItem';
import axios from 'axios';
import { apiClient } from '../firebase';
import GeminiSummary from '../components/GeminiSummary';

/*export const Profiletable: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
    const [userPosts, setUserPosts] = useState<PostItemData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        // Firebaseなどからユーザーのポスト一覧を取得する非同期処理//
        const fetchUserPosts = async () => {
            setIsLoading(true); // 読み込み開始
            setError(null);
            try {
                // バックエンドの /api/posts エンドポイントにGETリクエストを送信
                const response = await apiClient.get("/posts/me");
                // 成功したら、取得した投稿データでstateを更新
                console.log('Profilepage: 取得した投稿データ:', response.data);
                setUserPosts(response.data || []);
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
        fetchUserPosts();
    }, []);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    return (
        <div>
            <UserProfileCard user={userProfile} />
            <CustomHeader $buttons={profileHeaderButtons} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {userPosts.length > 0 ? (
                userPosts.map(post => (
                    <PostItem key={post.id} post={post} user={userProfile} />
                ))
            ) : (
                <p>まだ投稿がありません。</p>
            )}
        </div>
    );
};*/

export const Profiletable: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
    const [userPosts, setUserPosts] = useState<PostItemData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserPosts = async () => {
            setIsLoading(true);
            setError(null);
            console.log("--- [ProfilePage] 投稿データの取得を開始します ---");
            try {
                // /posts/me エンドポイントにリクエスト
                const response = await apiClient.get("/posts/me");

                // APIからのレスポンスを詳細にログ出力
                console.log("[ProfilePage] APIレスポンスを受け取りました:", response);
                console.log("[ProfilePage] レスポンスデータ (response.data):", response.data);

                // レスポンスデータが配列であることを確認
                if (response.data && Array.isArray(response.data)) {
                    console.log(`[ProfilePage] 取得した投稿数: ${response.data.length}件`);
                    setUserPosts(response.data);
                } else {
                    console.warn("[ProfilePage] レスポンスデータが配列ではありません。空の投稿として扱います。", response.data);
                    setUserPosts([]);
                }

            } catch (err) {
                // エラーが発生した場合、その内容を詳細にログ出力
                console.error("[ProfilePage] 投稿データの取得中にエラーが発生しました:", err);
                let errorMessage = "投稿の読み込みに失敗しました。";

                if (axios.isAxiosError(err)) {
                    console.error("[ProfilePage] Axiosエラーの詳細:", {
                        message: err.message,
                        code: err.code,
                        status: err.response?.status,
                        data: err.response?.data,
                    });
                    errorMessage = `エラー: ${err.response?.status || '不明'} - 詳しくはコンソールを確認してください。`;
                }
                setError(errorMessage);

            } finally {
                setIsLoading(false);
                console.log("--- [ProfilePage] 投稿データの取得を終了します ---");
            }
        };

        fetchUserPosts();
    }, []);

    if (isLoading) {
        return <div>投稿を読み込み中...</div>;
    }

    return (
        <div>
            <UserProfileCard user={userProfile} />
            <CustomHeader $buttons={profileHeaderButtons} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {userPosts.length > 0 ? (
                userPosts.map(post => (
                    <PostItem key={post.id} post={post} user={userProfile} />
                ))
            ) : (
                // エラーがない場合のみ「まだ投稿がありません」と表示
                !error && <p>あ</p>
            )}
        </div>
    );
};



export const profileHeaderButtons: HeaderButtonType[] = [
    { label: "ポスト", onClick: () => console.log("Header Button p1"), topOffset: "0px" },
    { label: "返信", onClick: () => console.log("Header Button p2"), topOffset: "0px" },
    { label: "いいね", onClick: () => console.log("Header Button p3"), topOffset: "0px" },
];
export const ProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);


    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoadingProfile(true);
            setProfileError(null);
            try {
                const user = await apiClient.get<UserProfile>("/users/me");
                setUserProfile(user.data);
                // ★ 追加: ここでuserProfile.userIdのログを出力
                console.log("ProfilePage: 取得したuserProfile.userId:", user.data.userId);
            } catch (err) {
                console.error("ユーザープロフィールの取得に失敗しました:", err);
                setProfileError("ユーザープロフィールの読み込みに失敗しました。");
            } finally {
                setIsLoadingProfile(false);
            }
        };
        fetchProfile();
    }, []);
    if (isLoadingProfile) {
        return <div>プロフィールを読み込み中...</div>;
    }

    if (profileError) {
        return <div style={{ color: 'red' }}>{profileError}</div>;
    }

    if (!userProfile) {
        return <div>プロフィール情報が見つかりませんでした。</div>;
    }
    return (
        <div>
            <Profiletable userProfile={userProfile} />
            {/* ★ 修正: GeminiSummary に userProfile.userId を渡す */}
            <GeminiSummary userId={userProfile.userId} />
        </div>
    );
};