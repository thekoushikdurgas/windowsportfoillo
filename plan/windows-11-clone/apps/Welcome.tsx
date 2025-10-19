
import React from 'react';

const Welcome = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="p-6 h-full flex flex-col bg-cover bg-center text-white" style={{backgroundImage: "url('https://picsum.photos/seed/welcome/800/600')"}}>
        <div className="bg-black bg-opacity-50 p-6 rounded-lg flex-grow flex flex-col">
            <h1 className="text-3xl font-bold mb-4">Welcome to Windows 11 Clone</h1>
            <div className="flex-grow space-y-4">
                <p>
                This is a web-based simulation of the Windows 11 operating system.
                </p>
                <p>
                You can open applications from the Start Menu or the desktop, move them around, resize them, and interact with them just like on a real desktop.
                </p>
                <p>
                    Try opening the "About Me" app to learn more about the creator!
                </p>
            </div>
            <div className="mt-auto pt-4 flex justify-end">
                <button
                onClick={() => alert('Welcome to the future of web applications!')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition"
                >
                Learn More
                </button>
            </div>
        </div>
    </div>
  );
};

export default Welcome;
