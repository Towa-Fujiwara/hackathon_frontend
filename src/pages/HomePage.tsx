import React from 'react';
import { CustomHeader, type HeaderButtonType } from '../components/layout';
import { CreatePostForm, usePosts } from '../components/NewPost';



export const homeHeaderButtons: HeaderButtonType[] = [
    { label: "おすすめ", onClick: () => console.log("Header Button h1"), topOffset: "0px" },
    { label: "最新", onClick: () => console.log("Header Button h2"), topOffset: "0px" },
    { label: "フォロー中", onClick: () => console.log("Header Button h3"), topOffset: "0px" },
];





export const HomePage: React.FC = () => {
    const { handleCreatePost } = usePosts();
    return (
        <div>
            <CustomHeader buttons={homeHeaderButtons} />
            <CreatePostForm onSubmit={handleCreatePost} />
        </div>
    );
};