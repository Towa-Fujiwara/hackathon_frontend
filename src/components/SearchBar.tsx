import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SearchBarContainer = styled.form`
    position: fixed; // fixedに変更
    top: 0px; // ページトップに配置
    right: 0px; // 右端に配置
    width: 270px; // サイドバーと同じ幅に設定
    height: 60px;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    padding: 0 10px; // パディングを調整
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1001;
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

export const SearchResultsContainer = styled.div`
    position: absolute; 
    top: 70px; 
    left: 0;
    width: 100%; 
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 15px;
    z-index: 999; 
    max-height: 400px;
    overflow-y: auto;
    color: #333;
`;

export const UserProfileItem = styled.div`
    padding: 8px 10px;
    border-bottom: 1px solid #eee;
    &:last-child {
        border-bottom: none;
    }
    a {
        text-decoration: none;
        color: inherit;
        display: block;
    }
    &:hover {
        background-color: #f0f0f0;
    }
`;

interface MainSearchBarProps {
    onSearch?: (query: string) => Promise<void>;
}

export const MainSearchBar: React.FC<MainSearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            return;
        }
        if (onSearch) {
            await onSearch(query);
        } else {
            navigate(`/searchresult?q=${encodeURIComponent(query)}`);
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
                    🔍
                </SearchButton>
            </SearchBarContainer>
        </>
    );
};