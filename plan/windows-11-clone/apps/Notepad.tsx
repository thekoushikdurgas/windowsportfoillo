import React from 'react';

const Notepad = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <textarea
        className="w-full h-full p-2 border-0 resize-none focus:outline-none font-mono text-base"
        placeholder="Start typing..."
        aria-label="Notepad text area"
      />
    </div>
  );
};

export default Notepad;