"use client"

import { useState, useEffect } from "react"
import { Heart, Shield, Sparkles, Quote } from "lucide-react"

export function ProblemSection() {
  const problems = [
    {
      title: "Academic Pressure",
      emotion: "Stressed",
      image: "https://i.pinimg.com/1200x/73/24/a1/7324a1eb27870a4632f85ee0e5812c31.jpg",
      color: "bg-amber-100",
    },
    {
      title: "Social Isolation",
      emotion: "Lonely",
      image: "https://i.pinimg.com/1200x/cc/b4/2b/ccb42b58db10b5221cad4142fbe4e0a3.jpg",
      color: "bg-rose-100",
    },
    {
      title: "Anxiety",
      emotion: "Worried",
      image: "https://i.pinimg.com/736x/6b/27/4a/6b274af221ed1a07a44a85e489ddb0ab.jpg",
      color: "bg-purple-100",
    },
    {
      title: "Depression",
      emotion: "Heavy",
      image: "https://i.pinimg.com/736x/e0/c3/4d/e0c34d605cc96f34fbb21cb997e027cb.jpg",
      color: "bg-blue-100",
    },
    // {
    //   title: "Sleep Issues",
    //   emotion: "Exhausted",
    //   image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop",
    //   color: "bg-indigo-100",
    // },
    // {
    //   title: "Finding Hope",
    //   emotion: "Positive",
    //   image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    //   color: "bg-emerald-100",
    // },
  ]

  return (
    <section id="problem" className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Soft organic shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-100 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-100 rounded-full opacity-20 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Photo Grid */}
          <div className="relative">
            {/* Main grid */}
            <div className="grid grid-cols-2 gap-4">
              {problems.map((problem, idx) => (
                <div
                  key={idx}
                  className={`relative ${problem.color} rounded-3xl p-4 border-2 border-white shadow-lg hover:scale-105 transition-transform duration-300`}
                  style={{
                    transform: idx % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)',
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-3">
                    <img
                      src={problem.image}
                      alt={problem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Emotion badge */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-md border-2 border-slate-200">
                    <span className="text-sm font-bold text-slate-800">
                      {problem.emotion}
                    </span>
                  </div>

                  {/* Decorative elements */}
                  {idx === 0 && (
                    <div className="absolute -top-3 -right-3 text-2xl">⭐</div>
                  )}
                  {idx === 2 && (
                    <div className="absolute -bottom-3 -left-3 text-2xl">💜</div>
                  )}
                  {idx === 5 && (
                    <div className="absolute -top-3 -right-3 text-2xl">✨</div>
                  )}
                </div>
              ))}
            </div>

            {/* Floating accent element */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-rose-200 rounded-full opacity-50 blur-2xl" />
          </div>

          {/* Right: Human-centered Content */}
          <div className="space-y-8">
            {/* Warm badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-full text-sm font-medium">
              <Heart className="w-4 h-4 fill-current" />
              You are not alone in this
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">
              A safe space to heal and grow
            </h2>

            {/* Story paragraph */}
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
              <p>
                Every day, thousands of students quietly carry the weight of stress, anxiety, and uncertainty. We've been there too. That's why we created a space where you don't have to pretend everything is okay.
              </p>
              <p>
                Whether it's 2 AM panic before an exam, or that heavy feeling you can't quite name — we're here to listen, not judge.
              </p>
            </div>

            {/* Quote */}
            <div className="relative bg-slate-50 rounded-2xl p-6 border-l-4 border-rose-400">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-rose-200" />
              <p className="text-lg italic text-slate-700 mb-2">
                "For the first time, I felt like someone actually understood what I was going through."
              </p>
              <p className="text-sm text-slate-500 font-medium">
                — A student who found support
              </p>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-slate-200">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-slate-800 text-sm">
                  Completely Anonymous
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-slate-200">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-slate-800 text-sm">
                  2,000+ Students Helped
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}