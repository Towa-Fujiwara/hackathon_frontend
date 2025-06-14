import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { fireAuth } from "./firebase";
import { LoginButton } from "./components/loginlayout";
import { FcGoogle } from "react-icons/fc";

export const LoginForm: React.FC = () => {
    /**
     * googleでログインする
     */
    const signInWithGoogle = async (): Promise<void> => {
        // Google認証プロバイダを利用する
        const provider = new GoogleAuthProvider();

        // ログイン用のポップアップを表示
        try {
            const res = await signInWithPopup(fireAuth, provider);
            const user = res.user;

            console.log("ログインユーザー: ", user.displayName);

            const idToken = await user.getIdToken();

            const response = await fetch('https://hackathon-backend-723035348521.us-central1.run.app/api/auth/google/callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
            });
            if (!response.ok) {
                throw new Error('サーバーでの認証に失敗しました。');
            }

            const { appToken } = await response.json();
            localStorage.setItem('appToken', appToken);
            console.log('ログイン成功！');
            // AuthCheckerの認証状態監視に任せるため、直接遷移を削除
            // if (isNewUser) {
            //     window.location.href = '/setaccount';
            // } else {
            //     window.location.href = '/';
            // }
        } catch (error) {
            console.error('サーバーでの認証に失敗しました。', error);
        }
    };

    /**
     * ログアウトする
     */
    const signOutWithGoogle = (): void => {
        signOut(fireAuth).then(() => {
            alert("ログアウトしました");
        }).catch(err => {
            alert(err);
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <LoginButton onClick={signInWithGoogle} label="Googleでログイン" icon={FcGoogle} />
            <LoginButton onClick={signOutWithGoogle} label="ログアウト" icon={FcGoogle} />
        </div>
    );
};