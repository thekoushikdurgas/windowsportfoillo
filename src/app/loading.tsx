export default function Loading() {
  return (
    <div className="windows-boot-screen">
      <div className="flex flex-col items-center gap-8">
        <div className="windows-boot-logo">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">W11</span>
          </div>
        </div>
        <div className="text-white text-lg font-medium">Loading Windows 11...</div>
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
