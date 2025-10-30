import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock, Search, Globe, FileText } from "lucide-react";

export function BrowserApp() {
  const [url, setUrl] = useState("durgasos://welcome");
  const [inputUrl, setInputUrl] = useState("durgasos://welcome");

  const handleNavigate = () => {
    setUrl(inputUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNavigate();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* Browser Navigation Bar */}
      <div 
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover-elevate active-elevate-2 transition-all"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover-elevate active-elevate-2 transition-all"
            data-testid="button-forward"
          >
            <ArrowRight className="w-4 h-4 text-white/60" />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover-elevate active-elevate-2 transition-all"
            data-testid="button-refresh"
          >
            <RotateCw className="w-4 h-4 text-white/60" />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover-elevate active-elevate-2 transition-all"
            data-testid="button-home"
          >
            <Home className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center gap-2 px-3 h-8 rounded-lg bg-white/5 border border-white/10">
          <Lock className="w-3 h-3 text-white/40" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-xs text-white/90 focus:outline-none placeholder:text-white/40"
            placeholder="Search or enter address"
            data-testid="input-url"
          />
          <Search className="w-3 h-3 text-white/40" />
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-y-auto">
        {url === "durgasos://welcome" ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0078D4] to-[#0067C0] flex items-center justify-center mb-6">
              <Globe className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white mb-3">
              Welcome to DurgasOS Browser
            </h1>
            <p className="text-sm text-white/60 max-w-md mb-8">
              Your secure and fast web browser. Enter a URL in the address bar to get started.
            </p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
              {[
                { name: "Search Engine", url: "https://google.com", icon: Search },
                { name: "News", url: "https://news.ycombinator.com", icon: FileText },
                { name: "Developer Docs", url: "https://developer.mozilla.org", icon: FileText },
              ].map((site) => {
                const IconComponent = site.icon;
                return (
                  <button
                    key={site.url}
                    onClick={() => {
                      setInputUrl(site.url);
                      setUrl(site.url);
                    }}
                    className="p-4 rounded-lg hover-elevate active-elevate-2 transition-all"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                    data-testid={`quick-link-${site.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex justify-center mb-2">
                      <IconComponent className="w-8 h-8 text-white/70" />
                    </div>
                    <div className="text-xs text-white/90 font-medium">{site.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-sm text-white/60 mb-2">Loading: {url}</p>
              <p className="text-xs text-white/40">
                External navigation simulated in this demo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
