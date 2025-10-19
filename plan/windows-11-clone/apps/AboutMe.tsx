
import React from 'react';

const AboutMe = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="p-6 h-full flex flex-col bg-gray-50 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">About Me</h1>
      <div className="flex-grow space-y-4">
        <p>
          I am a world-class senior frontend React engineer with deep expertise in Gemini API and UI/UX design. My passion is creating complete and functional web applications with excellent visual aesthetics using tools like React and Tailwind CSS.
        </p>
        <p>
          This Windows 11 clone is a testament to my ability to replicate complex user interfaces and build interactive, desktop-like experiences on the web.
        </p>
        <div className="border-t pt-4">
          <h2 className="font-semibold text-lg">Skills</h2>
          <ul className="list-disc list-inside mt-2">
            <li>React 18+ & TypeScript</li>
            <li>Tailwind CSS</li>
            <li>UI/UX Design Principles</li>
            <li>State Management</li>
            <li>Gemini API Integration</li>
          </ul>
        </div>
      </div>
      <div className="mt-auto pt-4 flex justify-end">
        <button
          onClick={() => alert('Learning more... about a world-class engineer!')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default AboutMe;
