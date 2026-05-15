import { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = ({ onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {isRegistering ? (
                    <Register onBackToLogin={() => setIsRegistering(false)} />
                ) : (
                    <Login 
                        onLoginSuccess={onLoginSuccess} 
                        onGoToRegister={() => setIsRegistering(true)} 
                    />
                )}
            </div>
        </div>
    );
};

export default AuthPage;
