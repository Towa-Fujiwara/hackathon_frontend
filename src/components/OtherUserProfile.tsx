import React from 'react';
import { type UserProfile, CardContainer, ProfileIcon, UserName, UserId } from './UserProfile';

export type OtherUserProfile = {
    userId: string;
    firebaseUid: string;
    name: string;
    bio: string;
    iconUrl: string;
    createdAt: string;
};

type OtherUserProfileCardProps = {
    user: UserProfile;
};

export const OtherUserProfileCard: React.FC<OtherUserProfileCardProps> = ({ user }) => {
    return (
        <CardContainer>
            <ProfileIcon src={user.iconUrl} alt={`${user.name} icon`} />
            <UserName>{user.name}</UserName>
            <UserId>@{user.userId}</UserId>
            <p>{user.bio}</p>
            {/*<div>
                <span>{user.followingCount} フォロー中</span>
                <span>{user.followersCount} フォロワー</span>
            </div>*/}
            {/* フォローボタンや編集ボタンなどをここに追加 */}
        </CardContainer>
    );
};



