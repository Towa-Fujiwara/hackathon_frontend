import React from 'react';
import { CustomHeader, HeaderButtonType } from '../components/layout';

export const settingsHeaderButtons: HeaderButtonType[] = [
    { label: "おすすめ", onClick: () => console.log("Header Button s1") },
    { label: "検索", onClick: () => console.log("Header Button s2") },
    { label: "通知", onClick: () => console.log("Header Button s3") },
    { label: "メッセージ", onClick: () => console.log("Header Button s4") },
    { label: "設定", onClick: () => console.log("Header Button s5") },
    { label: "プロフィール", onClick: () => console.log("Header Button s6") },
];
export const SettingsPage: React.FC = () => {
    return (
        <div>
            <CustomHeader buttons={settingsHeaderButtons} />
        </div>
    );
};