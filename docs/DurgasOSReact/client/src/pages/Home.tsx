import { useState } from "react";
import { BootScreen } from "@/components/BootScreen";
import { Desktop } from "@/components/Desktop";

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <div className="w-full h-screen overflow-hidden">
      {isBooting ? (
        <BootScreen onBootComplete={() => setIsBooting(false)} />
      ) : (
        <Desktop />
      )}
    </div>
  );
}
