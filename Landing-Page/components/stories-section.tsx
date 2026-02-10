"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Star,Sparkles } from "lucide-react"

export function StoriesSection() {
  const stories = [
    {
      quote: "This space helped me when I felt I couldn't speak to anyone. The AI support was there at 2 AM when my anxiety peaked.",
      name: "Arjun",
      role: "Computer Science Student",
      image: "https://i.pinimg.com/1200x/7b/00/6b/7b006b81162b0fe19cfca38feb1c9bd0.jpg",
      bgColor: "bg-sky-200",
      shape: "rounded-3xl",
      badge: "💡",
    },
    {
      quote: "Counselling felt safe for the first time. I could book sessions without anyone knowing, and that privacy gave me courage.",
      name: "Astha",
      role: "Psychology Student",
      image: "https://i.pinimg.com/736x/f9/e3/cd/f9e3cd2175f691ed060f470c0b2d1c3c.jpg",
      bgColor: "bg-orange-200",
      shape: "rounded-full",
      showBadge: true,
    },
    {
      quote: "I found my voice and learned to ask for help. The peer support showed me I wasn't the only one struggling.",
      name: "Rahul",
      role: "Engineering Student",
      image: "https://i.pinimg.com/1200x/f8/e3/29/f8e3293e7b037d4ae607c49468e65e46.jpg",
      bgColor: "bg-emerald-200",
      shape: "rounded-full",
      badge: "🤝",
    },
    {
      quote: "The resource hub became my daily companion. Meditation guides and coping strategies helped me through exam stress.",
      name: "Sneha",
      role: "Medical Student",
      image: "https://i.pinimg.com/736x/a4/74/8f/a4748f6181d9ac767f64835b535880e8.jpg",
      bgColor: "bg-orange-300",
      shape: "rounded-3xl",
      decorative: true,
      badge: "🧘‍♀️",
    },
  ]

  return (
    <section id="stories" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />
        {/* Small decorative stars */}
        <div className="absolute top-32 left-1/4 text-2xl">✦</div>
        <div className="absolute top-40 right-1/3 text-xl">→</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 mb-6">
           <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-emerald-700">Peacefull Support</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 text-balance leading-relaxed">
            Bring your inner{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-emerald-700">peace</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 15 Q 100 5, 195 15"
                  stroke="#f97316"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <ArrowRight className="inline-block ml-2 w-8 h-8 text-slate-900" strokeWidth={2} />
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">Real stories from students who found their path to wellness</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          {stories.map((story, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              {/* Image Container */}
              <div className="relative mb-6">
                <div
                  className={`${story.bgColor} ${story.shape} p-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    story.decorative ? "w-32 h-32 -rotate-45" : "w-32 h-32"
                  }`}
                >
                  <div
                    className={`relative w-full h-full overflow-hidden ${
                      story.decorative ? "rounded-2xl rotate-45" : story.shape
                    }`}
                  >
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Badge decoration */}
                {/* {story.showBadge && (
                  <div className="absolute -top-2 -left-2 bg-white rounded-lg px-2 py-1 shadow-md border-2 border-slate-900 text-lg">
                    {story.badge}
                  </div>
                )} */}
              </div>

              {/* Text Content */}
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{story.name}</h3>
              <p className="text-sm text-slate-500 mb-3">{story.role}</p>
              
              {/* Star Rating */}
              <div className="flex space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-emerald-400 text-slate-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-600 leading-relaxed max-w-[240px] italic">
                "{story.quote}"
              </p>
            </div>
          ))}
        </div>

        {/* Inspirational Message */}
        <div className="text-center mb-12">
          <p className="text-lg italic text-emerald-700">
            Every story shared here is a beacon of hope, lighting the way for others who seek healing and peace.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white rounded-3xl shadow-xl shadow-slate-500/5 border border-slate-100">
            <p className="text-slate-600">
              <span className="font-bold text-emerald-900">2,000+ students</span> have found their peace
            </p>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <button className="text-slate-700 font-semibold hover:text-emerald-700 transition-colors flex items-center gap-2 group">
              Share your story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}