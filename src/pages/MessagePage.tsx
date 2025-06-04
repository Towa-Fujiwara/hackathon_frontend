import React from 'react';
import { CustomHeader, type HeaderButtonType } from '../components/layout';



export const messageHeaderButtons: HeaderButtonType[] = [
    { label: "設定", onClick: () => console.log("Header Button m1"), topOffset: "0px" },
    { label: "新しいメッセージ", onClick: () => console.log("Header Button m2"), topOffset: "0px" },
];

export const MessagePage: React.FC = () => {
    return (
        <div>
            <CustomHeader buttons={messageHeaderButtons} />
        </div>
    );
};