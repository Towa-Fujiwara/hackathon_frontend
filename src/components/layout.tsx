import React from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { GoHomeFill } from "react-icons/go";
import { IoSearch, IoNotifications, IoSettingsSharp } from "react-icons/io5";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";

export type HeaderButtonType = {
    icon?: React.ReactNode;
    label: string;
    onClick?: () => void;
    topOffset?: string;
}
type SideBarButtonType = {
    label: string;
    onClick?: () => void;
    path: string;
    icon: React.ReactNode;
}

type SideBarProps = {
    $top: string;
    $buttons: SideBarButtonType[];
}
type HeaderProps = {
    $left?: string;
}
type CustomHeaderProps = {
    $buttons: HeaderButtonType[];
}



export const SideBarButton: React.FC<{ buttons: SideBarButtonType[] }> = ({ buttons }) => {
    return (
        <SideBarContainer>
            {buttons.map((button, index) => (
                <StyledLink to={button.path} key={index}>
                    <SideBar $top={`${index * 120}px`} $buttons={[]}>
                        <IconWrapper>{button.icon}</IconWrapper>
                        <Label>{button.label}</Label>
                    </SideBar>
                </StyledLink>
            ))}
        </SideBarContainer>
    );
};

export const CustomHeader: React.FC<CustomHeaderProps> = ({ $buttons }) => {
    return (
        <HeaderContainer>
            {$buttons.map((button, index) => (
                <HeaderButton
                    key={index}
                    onClick={button.onClick}
                >
                    {button.icon && <span className="icon">{button.icon}</span>}
                    {button.label}
                </HeaderButton>
            ))}
        </HeaderContainer>
    );
};
//ヘッダー
const HeaderButton = styled.button <HeaderProps>`
    position: relative;
    align-items: center; 
    justify-content: center;
   /*left: ${props => props.$left || 'auto'};*/
    height: 70px;
    flex-grow: 1; 
    flex-basis: 0;  
    background-color:rgb(255, 255, 255);
    color: rgb(126, 126, 126);
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%; /* 中央から広がるように */
    transform: translateX(-50%); /* 中央揃え */
    width: 0; /* 初期状態では幅0 */
    height: 5px; /* バーの太さ */
    background-color: rgb(24, 185, 226); /* バーの色 */
    transition: width 0.3s ease; /* 幅の変化をアニメーション */
    cursor: pointer;
    }
    &:hover {
        background-color: #fff;
        color: rgb(24, 185, 226);
        transform: scale(1.05);
        transition: all 0.2s ease;
    }
    &:hover::after {
    width: 100%; // ホバー時にバーの幅を100%にする
    }
    top: 20px;  
    z-index: 1000;
    overflow: visible;
`;

const HeaderContainer = styled.header`
    position: relative; 
    width: 860px;  
    height: 75px;  
    display: flex;
    flex-direction: row;  
    justify-content: center;  
    align-items: center;  
    padding: 20px;
    gap: 15px;
    left: 0px;
    background-color: #ffffff;  // 背景色を設定
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  // 影を追加
`;


//サイドバー
const SideBar = styled.button <SideBarProps>`
    height: 75px;
    width: 180px;
    background-color:rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    padding: 10px;
    border: none;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 18px;
    &:hover {
        background-color:rgb(24, 185, 226);
        color: #fff;
        cursor: pointer;
        transform: scale(1.05);
        transition: all 0.2s ease;
    }
    top: ${props => props.$top || '0'};
    left: 100px;
    bottom: 0;
    z-index: 1000;
    overflow: visible;
`;
const SideBarContainer = styled.aside`
    position: fixed;
    height: 100vh; 
    width: 270px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 25px;
    margin-top: 150px;
    padding: 0;
    left: 0;
    top: 45%;
    transform: translateY(-50%);
    background-color: #ffffff;  
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    z-index: 1000;
`;


export const sideBarButtonPath: SideBarButtonType[] = [
    { label: "ホーム", path: "/", icon: <GoHomeFill /> },
    { label: "検索", path: "/search", icon: <IoSearch /> },
    { label: "通知", path: "/notifications", icon: <IoNotifications /> },
    { label: "メッセージ", path: "/messages", icon: <BiSolidMessageSquareDetail /> },
    { label: "設定", path: "/settings", icon: <IoSettingsSharp /> },
    { label: "プロフィール", path: "/profile", icon: <VscAccount /> },
];

const IconWrapper = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
`;

const Label = styled.span`
    flex-grow: 1;
    text-align: left;
`;

const StyledLink = styled(Link)`
    text-decoration: none; /* リンクの下線を消す */
    color: inherit; /* 親要素の色を継承する */
`;
