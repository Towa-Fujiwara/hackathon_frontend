import React, { useState, useEffect } from 'react';
import { CustomHeader, type HeaderButtonType } from '../components/layout';
import { UserProfileCard, type UserProfile } from '../components/UserProfile';
import { PostItem, type PostItemData } from '../components/PostItem';


export const Profiletable: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userPosts, setUserPosts] = useState<PostItemData[]>([]);
    // const { userId } = useParams(); // URLからユーザーIDを取得する場合

    const dummyUser: UserProfile = {
        iconUrl: 'https://via.placeholder.com/150',
        displayName: 'テストユーザー',
        userId: 'testuser',
        bio: 'テスト',
        followingCount: 0,
        followersCount: 0
    };

    useEffect(() => {
        // Firebaseなどからユーザープロフィール情報を取得する非同期処理
        const fetchUserProfile = async () => {
            setUserProfile(dummyUser);
        };

        // Firebaseなどからユーザーのポスト一覧を取得する非同期処理
        const fetchUserPosts = async () => {
            // const postsData = await fetchPostsFromDB(userId); // DBから取得
            // setUserPosts(postsData);
            // ダミーデータで初期化

            setUserPosts([
                {
                    user: dummyUser, // UserProfileDataはPostItemDataのuserプロパティ(UserProfile型)と互換性がある想定
                    postId: 1, // number型に
                    text: '今日の東京は晴天です！素晴らしい一日になりそう。 #天気 #日常',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分前のタイムスタンプ
                    likeCount: 15,
                    retweetCount: 3
                },
            ]);
        };

        fetchUserProfile();
        fetchUserPosts();
    }, [/* userId */]); // userIdが変わったら再取得

    if (!userProfile) {
        return <div>Loading...</div>; // データ読み込み中の表示
    }

    return (
        <div>
            <UserProfileCard user={userProfile} />
            <CustomHeader buttons={profileHeaderButtons} />
            <PostItem post={userPosts[0]} />
        </div>
    );
};



export const profileHeaderButtons: HeaderButtonType[] = [
    { label: "ポスト", onClick: () => console.log("Header Button p1"), topOffset: "0px" },
    { label: "返信", onClick: () => console.log("Header Button p2"), topOffset: "0px" },
    { label: "いいね", onClick: () => console.log("Header Button p3"), topOffset: "0px" },
];
export const ProfilePage: React.FC = () => {
    return (
        <div>
            <Profiletable />
        </div>
    );
};