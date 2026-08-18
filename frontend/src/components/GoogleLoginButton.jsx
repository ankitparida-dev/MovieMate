// frontend/src/components/GoogleLoginButton.jsx

import { GoogleLogin } from '@react-oauth/google';
import styles from './GoogleLoginButton.module.css';

const GoogleLoginButton = ({ onSuccess, onError }) => {
    return (
        <div className={styles.googleBtnWrapper}>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    onSuccess(credentialResponse.credential);
                }}
                onError={() => {
                    console.error('Google login failed');
                    if (onError) onError();
                }}
                useOneTap
                theme="filled_blue"
                size="large"
                shape="pill"
                text="signin_with"
            />
        </div>
    );
};

export default GoogleLoginButton;