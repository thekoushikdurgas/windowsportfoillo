import React, { useState, useEffect } from 'react';
import { WifiIcon, VolumeIcon, BatteryIcon, PowerIcon } from './icons';

interface LoginScreenProps {
    onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const dateString = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    
    const handleLogin = () => {
        // Add a small delay for visual feedback
        const passwordInput = document.getElementById('password-input') as HTMLInputElement;
        if(passwordInput) {
            passwordInput.parentElement?.classList.add('animate-pulse');
        }
        setTimeout(onLogin, 300);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div 
            className="h-screen w-screen bg-cover bg-center flex flex-col justify-between items-center text-white p-8" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1635350736043-2363675f3a14?q=80&w=2070&auto=format&fit=crop')" }}
        >
            {/* Top spacing */}
            <div></div>

            {/* Login Box */}
            <div className="flex flex-col items-center">
                <img 
                    src="https://randomfox.ca/images/1.jpg" 
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full border-4 border-white/50 object-cover shadow-2xl"
                />
                <h1 className="text-4xl font-semibold mt-4 text-shadow">Jane Doe</h1>
                <div className="mt-6 w-64">
                    <input
                        id="password-input"
                        type="password"
                        placeholder="Password"
                        className="w-full bg-black/30 backdrop-blur-md border border-white/30 rounded-md p-2 text-center placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onKeyPress={handleKeyPress}
                        defaultValue="12345"
                    />
                     <button
                        onClick={handleLogin}
                        className="w-full mt-2 p-2 bg-blue-500/50 hover:bg-blue-500/80 backdrop-blur-md border border-white/30 rounded-md transition-colors"
                    >
                        Sign in
                    </button>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="w-full flex justify-between items-center">
                <div className="text-left">
                    <div className="text-5xl font-semibold">{timeString}</div>
                    <div>{dateString}</div>
                </div>
                <div className="flex items-center space-x-4">
                    <WifiIcon className="w-5 h-5" />
                    <VolumeIcon className="w-5 h-5" />
                    <BatteryIcon className="w-5 h-5" />
                    <PowerIcon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
