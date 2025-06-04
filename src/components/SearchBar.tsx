

import React, { useState } from 'react';
import styled from 'styled-components';

const SearchBarContainer = styled.form`
    position: absolute;
    top: 0px;
    left: 0; /* サイドバーがある場合はその幅を考慮する必要があるかもしれません */
    right: 0;
    height: 60px; /* 検索バーの高さ */
    width: 860px;
    background-color: #f0f0f0; /* 例としての背景色 */
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1001; /* ヘッダーより手前に来るように */
`;

const SearchInput = styled.input`
    flex-grow: 1;
    height: 40px;
    border-radius: 20px;
    border: 1px solid #ccc;
    padding: 0 20px;
    font-size: 16px;
    margin-right: 10px;
`;

const SearchButton = styled.button`
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: none;
    background-color: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

export const MainSearchBar: React.FC = () => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("メイン検索:", query);
        // 実際の検索処理
    };

    return (
        <SearchBarContainer onSubmit={handleSubmit}>
            <SearchInput
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="キーワードで検索"
            />
            <SearchButton type="submit">
            </SearchButton>
        </SearchBarContainer>
    );
};