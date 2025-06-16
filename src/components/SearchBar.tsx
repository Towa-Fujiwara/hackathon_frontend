import React, { useState } from 'react';
import styled from 'styled-components';
import { apiClient } from '../firebase';
import { type UserProfile } from './UserProfile';

const SearchBarContainer = styled.form`
    position: absolute;
    top: 0px;
    left: 270px; /* サイドバーがある場合はその幅を考慮する必要があるかもしれません */
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

const SearchResultsContainer = styled.div`
    position: absolute;
    top: 70px; /* 検索バーの下に配置 */
    left: 290px;
    width: 820px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 15px;
    z-index: 1000;
    max-height: 400px;
    overflow-y: auto;
`;

const UserProfileItem = styled.div`
    padding: 8px 10px;
    border-bottom: 1px solid #eee;
    &:last-child {
        border-bottom: none;
    }
`;

export const MainSearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserProfile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!query.trim()) {
            return;
        }
        console.log("メイン検索:", query);
        try {
            const res = await apiClient.get<UserProfile[]>("/search", {
                params: {
                    q: query
                }
            });
            setResults(res.data); // 取得した検索結果でstateを更新
            console.log("検索結果:", res.data);
        } catch (err) {
            console.error("検索に失敗しました:", err);
            setError("検索に失敗しました。");
        }
    };

    return (
        <>
            <SearchBarContainer onSubmit={handleSubmit}>
                <SearchInput
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="キーワードで検索"
                />
                <SearchButton type="submit" onSubmit={handleSubmit}>
                </SearchButton>
            </SearchBarContainer>
            <SearchResultsContainer>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {results.map((user) => (
                    // UserProfileにidとnameプロパティがあると仮定
                    // 実際のデータ構造に合わせてキーと表示内容を調整してください
                    <UserProfileItem key={user.userId}>{user.name}</UserProfileItem>
                ))}
            </SearchResultsContainer>
        </>
    );
};