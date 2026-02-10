import { Card, CardContent } from "@/components/ui/card"
import { Bot, CalendarDays, Headphones, MessageCircle, BarChart3, Shield, Sparkles, Heart, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Bot,
      title: "AI-Guided First Aid",
      description: "Instant coping support when you need it most. Our AI provides personalized techniques and guidance.",
      color: "from-violet-500/20 to-purple-500/20",
      borderColor: "group-hover:border-violet-300",
      iconColor: "text-violet-600",
      size: "large",
    },
    {
      icon: CalendarDays,
      title: "Confidential Booking",
      description: "Private appointments with qualified counsellors at your convenience.",
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "group-hover:border-emerald-300",
      iconColor: "text-emerald-600",
      size: "small",
    },
    {
      icon: Headphones,
      title: "Resource Hub",
      description: "Guides, meditations, and videos for self-care.",
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "group-hover:border-amber-300",
      iconColor: "text-amber-600",
      size: "small",
    },
    {
      icon: MessageCircle,
      title: "Peer Support",
      description: "Connect with fellow students who understand. Safe, moderated community spaces.",
      color: "from-rose-500/20 to-pink-500/20",
      borderColor: "group-hover:border-rose-300",
      iconColor: "text-rose-600",
      size: "large",
    },
    {
      icon: BarChart3,
      title: "Admin Dashboard",
      description: "Anonymous insights for better campus wellness decisions and resource planning.",
      color: "from-cyan-500/20 to-blue-500/20",
      borderColor: "group-hover:border-cyan-300",
      iconColor: "text-cyan-600",
      size: "small",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your data is encrypted and never shared. Complete confidentiality guaranteed.",
      color: "from-indigo-500/20 to-blue-500/20",
      borderColor: "group-hover:border-indigo-300",
      iconColor: "text-indigo-600",
      size: "small",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-emerald-50/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Comprehensive Support</span>
          </div>
          
          {/* <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6 text-balance">
            Everything You Need
            <span className="block text-emerald-700 mt-2">Under One Roof</span>
          </h2> */}
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A complete ecosystem of tools designed specifically for student mental wellness — accessible, private, and always here for you.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isLarge = feature.size === "large"
            
            return (
              <Card
                key={index}
                className={`
                  group relative overflow-hidden border-slate-200/60 
                  hover:shadow-2xl hover:shadow-emerald-500/10 
                  transition-all duration-500 ease-out
                  hover:-translate-y-1 cursor-pointer
                  ${feature.borderColor}
                  ${isLarge ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : ""}
                `}
              >
                {/* Gradient background */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${feature.color} 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-500
                `} />
                
                <CardContent className={`
                  relative z-10 h-full flex flex-col
                  ${isLarge ? "p-8 md:p-10" : "p-6 md:p-8"}
                `}>
                  {/* Icon */}
                  <div className={`
                    w-12 h-12 rounded-2xl bg-white shadow-lg 
                    flex items-center justify-center mb-5
                    group-hover:scale-110 group-hover:rotate-3
                    transition-all duration-300
                    ${feature.iconColor}
                  `}>
                    <Icon className={`${isLarge ? "w-6 h-6" : "w-5 h-5"}`} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className={`
                    font-semibold text-slate-900 mb-3 
                    group-hover:text-slate-800 transition-colors
                    ${isLarge ? "text-2xl" : "text-xl"}
                  `}>
                    {feature.title}
                  </h3>
                  
                  <p className={`
                    text-slate-600 leading-relaxed 
                    group-hover:text-slate-700 transition-colors
                    ${isLarge ? "text-lg" : "text-base"}
                  `}>
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-medium text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <span>Learn more</span>
                    <Zap className="w-4 h-4 group-hover:animate-pulse" />
                  </div>
                </CardContent>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white shadow-xl shadow-emerald-500/10 border border-emerald-100">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span className="text-slate-700 font-medium">
              Trusted by <span className="text-emerald-700 font-semibold">10,000+</span> students across campuses
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
