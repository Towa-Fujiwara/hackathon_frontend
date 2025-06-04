import React from 'react';
import { CustomHeader, HeaderButtonType } from '../components/layout';


export const notificationHeaderButtons: HeaderButtonType[] = [
    { label: "すべて", onClick: () => console.log("Header Button n1"), topOffset: "0px" },
    { label: "@ポスト", onClick: () => console.log("Header Button n2"), topOffset: "0px" },
];

export const NotificationPage: React.FC = () => {
    return (
        <div>
            <CustomHeader buttons={notificationHeaderButtons} />
        </div>
    );
};