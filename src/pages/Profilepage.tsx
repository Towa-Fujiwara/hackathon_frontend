import React from 'react';
import { CustomHeader, HeaderButtonType } from '../components/layout';

export const profileHeaderButtons: HeaderButtonType[] = [
    { label: "おすすめ", onClick: () => console.log("Header Button p1"), topOffset: "0px" },
    { label: "検索", onClick: () => console.log("Header Button p2"), topOffset: "0px" },
    { label: "通知", onClick: () => console.log("Header Button p3"), topOffset: "0px" },
    { label: "メッセージ", onClick: () => console.log("Header Button p4"), topOffset: "0px" },
    { label: "設定", onClick: () => console.log("Header Button p5"), topOffset: "0px" },
    { label: "プロフィール", onClick: () => console.log("Header Button p6"), topOffset: "0px" },
];
export const ProfilePage: React.FC = () => {
    return (
        <div>
            <CustomHeader buttons={profileHeaderButtons} />
        </div>
    );
};