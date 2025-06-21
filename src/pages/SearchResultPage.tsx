import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { apiClient } from '../firebase';
import { type UserProfile } from '../components/UserProfile';

const SearchResultsContainer = styled.div`
    position: absolute;
    top: 70px; /* 検索バーの下に配置 */
    left: 290px;
    width: 820px;
    background-color: white;
    color: rgba(63, 45, 45, 90);
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

export const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const [results, setResults] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            setError(null);
            console.log("検索ページで検索実行:", query);
            try {
                const res = await apiClient.get<UserProfile[]>("/search", {
                    params: { q: query }
                });
                setResults(res.data || []);
                console.log("検索結果:", res.data);
            } catch (err) {
                console.error("検索に失敗しました:", err);
                setError("検索に失敗しました。");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (isLoading) {
        return <SearchResultsContainer>検索中...</SearchResultsContainer>;
    }

    if (error) {
        return <SearchResultsContainer style={{ color: 'red' }}>{error}</SearchResultsContainer>;
    }

    return (
        <SearchResultsContainer>
            <h2>「{query}」の検索結果</h2>
            {results.length > 0 ? (
                results.map((user) => (
                    <UserProfileItem key={user.userId}>{user.name}</UserProfileItem>
                ))
            ) : (
                <p>検索結果が見つかりませんでした。</p>
            )}
        </SearchResultsContainer>
    );
};