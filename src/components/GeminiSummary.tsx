import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { fireAuth } from '../firebase';
import { apiClient } from '../firebase';

interface SummaryData {
    summary: string;
    userId: string;
    createdAt: string;
}

interface GeminiSummaryProps {
    userId?: string;
}

const GeminiSummary: React.FC<GeminiSummaryProps> = ({ userId }) => {
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = fireAuth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    const generateSummary = useCallback(async () => {
        const targetUserId = userId || currentUser?.uid;
        console.log("GeminiSummary: APIリクエスト対象のuserId:", targetUserId);

        if (!targetUserId) {
            setSummary(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post(
                `/users/${targetUserId}/summary`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = response.data;
            setSummary(data);
        } catch (err: any) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError('認証に失敗しました。再度ログインしてください。');
                } else if (err.response.status === 403) {
                    setError('この要約にアクセスする権限がありません。');
                } else if (err.response.status === 404) {
                    setError('要約を生成する対象のユーザーが見つかりません。');
                } else {
                    setError(`サーバーエラー: ${err.response.status}`);
                }
            } else {
                setError(err instanceof Error ? err.message : '要約の生成に失敗しました');
            }
            console.error('Error generating summary:', err);
        } finally {
            setIsLoading(false);
        }
    }, [userId, currentUser]);

    useEffect(() => {
        generateSummary();
    }, [generateSummary]);

    const shouldRender = userId || currentUser;
    if (!shouldRender) {
        return null;
    }

    if (isLoading) {
        return (
            <SummaryContainer>
                <SummaryHeader>Gemini要約</SummaryHeader>
                <LoadingMessage>要約を生成中...</LoadingMessage>
            </SummaryContainer>
        );
    }

    if (error) {
        return (
            <SummaryContainer>
                <SummaryHeader>Gemini要約</SummaryHeader>
                <ErrorMessage>エラー: {error}</ErrorMessage>
                <RegenerateButton onClick={generateSummary} disabled={isLoading}>
                    {isLoading ? '生成中...' : '再試行'}
                </RegenerateButton>
            </SummaryContainer>
        );
    }

    if (!summary) {
        return (
            <SummaryContainer>
                <SummaryHeader>Gemini要約</SummaryHeader>
                <NoDataMessage>要約データがありません</NoDataMessage>
                <RegenerateButton onClick={generateSummary} disabled={isLoading}>
                    {isLoading ? '生成中...' : '生成する'}
                </RegenerateButton>
            </SummaryContainer>
        );
    }

    return (
        <SummaryContainer>
            <SummaryHeader>Gemini要約</SummaryHeader>
            <SummaryContent>
                <SummaryText>{summary.summary}</SummaryText>
                <SummaryMeta>
                    <span>生成日時: {new Date(summary.createdAt).toLocaleString('ja-JP')}</span>
                </SummaryMeta>
            </SummaryContent>
            <RegenerateButton onClick={generateSummary} disabled={isLoading}>
                {isLoading ? '生成中...' : '再生成'}
            </RegenerateButton>
        </SummaryContainer>
    );
};

const SummaryContainer = styled.div`
  position: fixed;
  top: 5px;
  right: 0px;
  width: 270px;
  max-height: calc(100vh - 120px);
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;
  z-index: 100;
`;

const SummaryHeader = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid #18b9e2;
  padding-bottom: 8px;
`;

const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SummaryText = styled.p`
  margin: 0;
  line-height: 1.6;
  color: #555;
  font-size: 14px;
  text-align: justify;
`;

const SummaryMeta = styled.div`
  font-size: 12px;
  color: #888;
  border-top: 1px solid #eee;
  padding-top: 10px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px 0;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 20px 0;
`;

const NoDataMessage = styled.div`
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px 0;
`;

const RegenerateButton = styled.button`
  background-color: #18b9e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 15px;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #1497b8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default GeminiSummary;
