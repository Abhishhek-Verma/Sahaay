"use client"

import { UserPlus, ClipboardCheck, HeartHandshake, TrendingUp, ArrowRight, Sparkles } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your private, secure account in just minutes. No complex forms, no barriers.",
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-emerald-500",
      borderColor: "border-emerald-200",
    },
    {
      icon: ClipboardCheck,
      title: "Self-Check",
      description: "Complete a gentle wellbeing assessment using our AI-guided screening tools.",
      color: "from-teal-400 to-cyan-500",
      bgColor: "bg-teal-500",
      borderColor: "border-teal-200",
    },
    {
      icon: HeartHandshake,
      title: "Get Support",
      description: "Connect instantly with AI first aid, peer communities, or book counsellor sessions.",
      color: "from-cyan-400 to-sky-500",
      bgColor: "bg-cyan-800",
      borderColor: "border-cyan-200",
    },
    {
      icon: TrendingUp,
      title: "Grow & Reflect",
      description: "Track your progress, celebrate milestones, and build lasting wellness habits.",
      color: "from-sky-400 to-blue-500",
      bgColor: "bg-sky-500",
      borderColor: "border-sky-200",
    },
  ]

  return (
    <section id="flow" className="py-24 bg-gradient-to-b from-slate-50 via-white to-teal-50/50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-100/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100/80 border border-teal-200 mb-6">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Simple Process</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-6 text-balance">
            From Stress to Support,
            <span className="block text-teal-600 mt-2">Step by Step</span>
          </h2>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your wellness journey simplified into four meaningful steps. Start today and feel the difference.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1

            return (
              <div key={index} className="relative group">
                {/* Connection line for desktop */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5">
                    <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-200 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-hover:text-teal-400 transition-colors" />
                  </div>
                )}

                {/* Card */}
                <div className={`
                  relative bg-white rounded-3xl p-8 border-2 ${step.borderColor}
                  shadow-lg shadow-slate-500/5
                  hover:shadow-xl hover:shadow-teal-500/10
                  hover:-translate-y-2
                  transition-all duration-500 ease-out
                  h-full flex flex-col
                `}>
                  {/* Step number badge */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                    0{index + 1}
                  </div>

                  {/* Icon container */}
                  <div className={`
                    w-16 h-16 rounded-2xl ${step.bgColor} 
                    flex items-center justify-center mb-6
                    group-hover:scale-110 group-hover:rotate-3
                    transition-all duration-300
                  `}>
                    <Icon className={`w-8 h-8 bg-gradient-to-br ${step.color} bg-clip-text`} style={{ color: 'transparent', background: `linear-gradient(to right, var(--tw-gradient-stops))`, WebkitBackgroundClip: 'text' }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed text-sm flex-grow">
                    {step.description}
                  </p>

                  {/* Bottom indicator */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${step.color}`} />
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Step {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl shadow-xl shadow-teal-500/20">
            <div className="text-left">
              <p className="text-white/80 text-sm uppercase tracking-wider mb-1">Ready to begin?</p>
              <p className="text-white text-xl font-semibold">Start your wellness journey today</p>
            </div>
            <button 
              onClick={() => window.location.href = "http://localhost:4028"}
              className="group flex items-center gap-2 px-8 py-4 bg-white text-teal-700 rounded-full font-semibold hover:bg-teal-50 transition-all duration-300 hover:shadow-lg whitespace-nowrap"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
