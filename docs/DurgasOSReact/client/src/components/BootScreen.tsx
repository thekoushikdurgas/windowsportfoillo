import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface BootScreenProps {
  onBootComplete: () => void;
}

export function BootScreen({ onBootComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onBootComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onBootComplete]);

  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center"
      data-testid="boot-screen"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Windows Logo */}
        <div className="w-[120px] h-[120px] grid grid-cols-2 gap-2">
          <div className="bg-[#0078D4] rounded-sm"></div>
          <div className="bg-[#0078D4] rounded-sm"></div>
          <div className="bg-[#0078D4] rounded-sm"></div>
          <div className="bg-[#0078D4] rounded-sm"></div>
        </div>

        {/* Loading Spinner */}
        <div className="flex flex-col items-center gap-6">
          <Loader2 
            className="w-8 h-8 text-white animate-spin" 
            data-testid="boot-spinner"
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-white text-base font-light tracking-wide">
              DurgasOS
            </p>
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0078D4] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
