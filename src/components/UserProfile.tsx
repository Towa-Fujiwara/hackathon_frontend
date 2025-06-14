import React from 'react';
import styled from 'styled-components';

export type UserProfile = {
    userId: string;
    firebaseUid: string;
    name: string;
    bio: string;
    iconUrl: string;
    createdAt: string;
};

type UserProfileCardProps = {
    user: UserProfile;
};

const CardContainer = styled.div`
    padding: 20px;
    border-bottom: 1px solid #eee;
    position: relative; 
    width: 860px;  
    height: 75px;  
    display: flex;
    flex-direction: row;  
    justify-content: center; 
    align-items: center;  
    padding: 20px;
    gap: 15px;
    left: 0px;
    top: 0px;
    background-color: #ffffff;  // 背景色を設定
    color: rgb(0, 0, 0); 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  // 影を追加
`;

const ProfileIcon = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
`;

const UserName = styled.h2`
    margin: 0;
`;

const UserId = styled.p`
    color: gray;
`;

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
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
