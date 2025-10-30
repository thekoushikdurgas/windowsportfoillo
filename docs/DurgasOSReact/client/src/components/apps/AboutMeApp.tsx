import { useQuery } from "@tanstack/react-query";
import { Mail, Briefcase, GraduationCap, Code, User } from "lucide-react";
import type { Profile } from "@shared/schema";

export function AboutMeApp() {
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-[#0078D4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const defaultProfile = profile || {
    name: "John Doe",
    title: "Full Stack Developer",
    bio: "Passionate developer with expertise in building modern web applications. I love creating intuitive user experiences and solving complex problems.",
    email: "john.doe@example.com",
    skills: ["React", "TypeScript", "Node.js", "Python", "SQL"],
    experience: "5+ years in software development",
    education: "Bachelor's in Computer Science",
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#1a1a1a] to-[#252525]">
      {/* Hero Section */}
      <div className="relative px-8 py-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#0078D4] to-[#0067C0] flex items-center justify-center shadow-xl">
            <User className="w-16 h-16 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2" data-testid="text-profile-name">
          {defaultProfile.name}
        </h1>
        <p className="text-base text-white/70" data-testid="text-profile-title">
          {defaultProfile.title}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Mail className="w-4 h-4 text-white/60" />
          <a
            href={`mailto:${defaultProfile.email}`}
            className="text-sm text-[#0078D4] hover:underline"
            data-testid="link-email"
          >
            {defaultProfile.email}
          </a>
        </div>
      </div>

      {/* Content Grid */}
      <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bio Card */}
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#0078D4]/20 flex items-center justify-center">
              <Code className="w-5 h-5 text-[#0078D4]" />
            </div>
            <h2 className="text-base font-semibold text-white">About</h2>
          </div>
          <p className="text-sm text-white/70 leading-relaxed" data-testid="text-bio">
            {defaultProfile.bio}
          </p>
        </div>

        {/* Experience Card */}
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#0078D4]/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#0078D4]" />
            </div>
            <h2 className="text-base font-semibold text-white">Experience</h2>
          </div>
          <p className="text-sm text-white/70" data-testid="text-experience">
            {defaultProfile.experience}
          </p>
        </div>

        {/* Education Card */}
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#0078D4]/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#0078D4]" />
            </div>
            <h2 className="text-base font-semibold text-white">Education</h2>
          </div>
          <p className="text-sm text-white/70" data-testid="text-education">
            {defaultProfile.education}
          </p>
        </div>

        {/* Skills Card */}
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#0078D4]/20 flex items-center justify-center">
              <Code className="w-5 h-5 text-[#0078D4]" />
            </div>
            <h2 className="text-base font-semibold text-white">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2" data-testid="skills-list">
            {defaultProfile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#0078D4]/20 text-[#0078D4] border border-[#0078D4]/30"
                data-testid={`skill-${index}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
