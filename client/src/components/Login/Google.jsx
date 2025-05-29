import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Context } from '../../utils/context';
import { useNavigate } from 'react-router-dom';

const GoogleLoginComponent = () => {
    const { setUser } = useContext(Context);
    const navigate = useNavigate();

    const responseGoogle = (response) => {
        if (response.credential) {
            const decodedCredential = JSON.parse(atob(response.credential.split('.')[1]));
            setUser({
                username: decodedCredential.name,
                email: decodedCredential.email,
                googleId: decodedCredential.sub,
                imageUrl: decodedCredential.picture,
            });
            navigate(`/home?user=${decodedCredential.name}`);
        }
    };

    return (
        <div className="custom-google-button">
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                onSuccess={responseGoogle}
                onFailure={(error) => console.error("Google Login Error:", error)}
                cookiePolicy={'single_host_origin'}
                locale="en" // Add this line to set the language to English
            />
        </div>
    );
};

export default GoogleLoginComponent;
