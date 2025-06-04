import React from 'react';
import { CustomHeader, type HeaderButtonType } from '../components/layout';
import { MainSearchBar } from '../components/SearchBar';

export const searchHeaderButtons: HeaderButtonType[] = [
    { label: "おすすめ", onClick: () => console.log("Header Button sc1"), topOffset: "80px" },
    { label: "トレンド", onClick: () => console.log("Header Button sc2"), topOffset: "80px" },
    { label: "ニュース", onClick: () => console.log("Header Button sc3"), topOffset: "80px" },
    { label: "スポーツ", onClick: () => console.log("Header Button sc4"), topOffset: "80px" },
    { label: "エンターテイメント", onClick: () => console.log("Header Button sc5"), topOffset: "80px" },
];
export const SearchPage: React.FC = () => {
    return (
        <div>
            <MainSearchBar />
            <CustomHeader buttons={searchHeaderButtons} />
        </div>
    );
};