import React from 'react';
import { CustomHeader, HeaderButtonType } from '../components/layout';



export const homeHeaderButtons: HeaderButtonType[] = [
    { label: "おすすめ", onClick: () => console.log("Header Button h1"), topOffset: "0px" },
    { label: "最新", onClick: () => console.log("Header Button h2"), topOffset: "0px" },
    { label: "フォロー中", onClick: () => console.log("Header Button h3"), topOffset: "0px" },
];

export const HomePage: React.FC = () => {

    return (
        <div>
            <CustomHeader buttons={homeHeaderButtons} />
        </div>
    );
};