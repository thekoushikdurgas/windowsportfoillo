import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, Download } from "lucide-react";
import type { App } from "@shared/schema";

export function AppStoreApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: apps, isLoading } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  const defaultApps: App[] = apps || [
    {
      id: "1",
      name: "Photo Editor Pro",
      description: "Professional photo editing with advanced filters and tools",
      category: "Creativity",
      icon: "image",
      version: "2.5.0",
      developer: "Creative Studio",
      featured: 1,
    },
    {
      id: "2",
      name: "Code Editor",
      description: "Powerful code editor with syntax highlighting and IntelliSense",
      category: "Development",
      icon: "code",
      version: "1.8.2",
      developer: "Dev Tools Inc",
      featured: 1,
    },
    {
      id: "3",
      name: "Music Player",
      description: "Listen to your favorite music with high-quality audio",
      category: "Entertainment",
      icon: "music",
      version: "3.2.1",
      developer: "Media Corp",
      featured: 0,
    },
    {
      id: "4",
      name: "Task Manager",
      description: "Organize your tasks and boost productivity",
      category: "Productivity",
      icon: "check-square",
      version: "1.4.5",
      developer: "Productivity Labs",
      featured: 1,
    },
  ];

  const categories = ["all", ...Array.from(new Set(defaultApps.map(a => a.category)))];

  const filteredApps = defaultApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredApps = defaultApps.filter(app => app.featured === 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
        <div className="w-8 h-8 border-2 border-[#0078D4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#1a1a1a] to-[#252525]">
      {/* Header */}
      <div className="px-8 py-8">
        <h1 className="text-2xl font-semibold text-white mb-6">App Store</h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search apps"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#0078D4]/50"
            data-testid="input-app-search"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all hover-elevate active-elevate-2 ${
                selectedCategory === category
                  ? 'bg-[#0078D4] text-white'
                  : 'bg-white/5 text-white/70 border border-white/10'
              }`}
              data-testid={`category-${category}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      {selectedCategory === "all" && !searchQuery && (
        <div className="px-8 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Featured Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredApps.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-lg hover-elevate active-elevate-2 transition-all"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                data-testid={`featured-app-${app.id}`}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#0078D4] to-[#0067C0] flex items-center justify-center flex-shrink-0">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white mb-1" data-testid={`app-name-${app.id}`}>
                      {app.name}
                    </h3>
                    <p className="text-xs text-white/60 mb-2 line-clamp-2">
                      {app.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-white/60">4.5</span>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-[#0078D4] text-white hover-elevate active-elevate-2 transition-all flex-shrink-0"
                    data-testid={`button-install-${app.id}`}
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Apps */}
      <div className="px-8 pb-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          {searchQuery ? "Search Results" : "All Apps"}
        </h2>
        <div className="space-y-2">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-lg hover-elevate active-elevate-2 transition-all"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              data-testid={`app-${app.id}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0078D4] to-[#0067C0] flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white" data-testid={`app-title-${app.id}`}>
                    {app.name}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-1">
                    {app.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-white/40">{app.developer}</span>
                    <span className="text-xs text-white/40">v{app.version}</span>
                  </div>
                </div>
                <button
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-[#0078D4] text-white hover-elevate active-elevate-2 transition-all"
                  data-testid={`button-get-${app.id}`}
                >
                  Get
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
