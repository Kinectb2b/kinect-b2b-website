'use client';

const quickLinks = [
  {
    title: "Pipedrive CRM",
    description: "Manage your deals and pipeline",
    icon: "🎯",
    url: "https://kinectb2b.pipedrive.com",
    color: "from-green-500 to-green-600"
  },
  {
    title: "Affiliate Portal",
    description: "Track referrals and commissions",
    icon: "💼",
    url: "https://kinect-b2b.com/affiliate/login",
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Google Calendar",
    description: "Check your schedule",
    icon: "📅",
    url: "https://calendar.google.com",
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Kinect B2B Website",
    description: "Main company website",
    icon: "🌐",
    url: "https://kinect-b2b.com",
    color: "from-gray-600 to-gray-700"
  },
];

const communication = [
  {
    title: "Zoom",
    description: "Start or join a meeting",
    icon: "📹",
    url: "https://zoom.us/start/videomeeting",
    color: "from-blue-400 to-blue-500"
  },
  {
    title: "Google Meet",
    description: "Start a video call",
    icon: "🎥",
    url: "https://meet.google.com/new",
    color: "from-green-400 to-teal-500"
  },
  {
    title: "Gmail",
    description: "Check your email",
    icon: "📧",
    url: "https://mail.google.com",
    color: "from-red-400 to-red-500"
  },
  {
    title: "Slack",
    description: "Team communication",
    icon: "💬",
    url: "https://slack.com",
    color: "from-purple-400 to-pink-500"
  },
];

const socialMedia = [
  {
    title: "LinkedIn",
    description: "Professional networking",
    icon: "💼",
    url: "https://www.linkedin.com",
    color: "from-blue-600 to-blue-700"
  },
  {
    title: "Meta Business Suite",
    description: "Manage Facebook & Instagram",
    icon: "📱",
    url: "https://business.facebook.com",
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Alignable",
    description: "Local business network",
    icon: "🤝",
    url: "https://www.alignable.com",
    color: "from-teal-500 to-teal-600"
  },
];

export default function QuickActions() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          ⚡ Quick Actions
        </h2>
        <p className="text-gray-500 mt-1">One-click access to all your tools</p>
      </div>

      {/* Main Tools */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">🔧 Main Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className={`bg-gradient-to-br ${link.color} rounded-2xl p-5 text-white transition-all duration-200 hover:scale-105 hover:shadow-xl`}>
                <div className="text-4xl mb-3">{link.icon}</div>
                <h4 className="font-bold text-lg">{link.title}</h4>
                <p className="text-white/80 text-sm">{link.description}</p>
                <div className="mt-3 text-white/60 text-sm flex items-center gap-1 group-hover:text-white transition">
                  Open →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Communication Tools */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">💬 Communication</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {communication.map((tool, index) => (
            <a
              key={index}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 transition-all duration-200 hover:border-green-500 hover:shadow-lg">
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h4 className="font-bold text-gray-900">{tool.title}</h4>
                <p className="text-gray-500 text-sm">{tool.description}</p>
                <div className="mt-3 text-gray-400 text-sm flex items-center gap-1 group-hover:text-green-600 transition">
                  Open →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">📣 Social Media</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {socialMedia.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className={`bg-gradient-to-br ${social.color} rounded-2xl p-5 text-white transition-all duration-200 hover:scale-105 hover:shadow-xl`}>
                <div className="text-4xl mb-3">{social.icon}</div>
                <h4 className="font-bold text-lg">{social.title}</h4>
                <p className="text-white/80 text-sm">{social.description}</p>
                <div className="mt-3 text-white/60 text-sm flex items-center gap-1 group-hover:text-white transition">
                  Open →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Tip */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h4 className="font-bold text-yellow-800">Pro Tip</h4>
            <p className="text-yellow-700 mt-1">
              Bookmark this dashboard so you can access all your tools from one place. 
              Need a tool added? Let your admin know!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}