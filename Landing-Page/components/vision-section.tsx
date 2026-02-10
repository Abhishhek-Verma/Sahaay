"use client"

import Image from "next/image"
import { Heart, Users, Shield, Sparkles } from "lucide-react"

export function VisionSection() {
  return (
    <section
      id="vision"
      className="py-24 md:py-32 bg-gradient-to-b from-emerald-50/50 via-white to-white relative overflow-hidden"
    >
      {/* Soft background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual Story */}
          <div className="relative order-2 lg:order-1">
            {/* Photo collage effect */}
            <div className="relative">
              {/* Main photo frame */}
              <div className="relative bg-white p-3 rounded-2xl shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/1200x/ed/c7/d9/edc7d9c8dfc85b9f26217c62e6c8bdf0.jpg"
                    alt="Students supporting each other"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Overlapping accent card */}
              <div className="absolute -bottom-6 -right-6 bg-white p-3 rounded-2xl shadow-lg -rotate-3 hover:rotate-0 transition-transform duration-500 w-48">
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/736x/49/d9/f5/49d9f559989cfd6599f1ff77d81b72d0.jpg"
                    alt="With empathy"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -left-4 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Our Vision</span>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Warm badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200">
              <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Why we exist</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 leading-tight">
              Building a world where
              <span className="text-emerald-700 block mt-2">mental health is never stigmatized</span>
            </h2>

            {/* Story content */}
            <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
              <p>
                We envision campuses where seeking help is seen as strength, not weakness. 
                Where every student feels seen, heard, and supported — no matter what they&apos;re going through.
              </p>
              <p>
                Our dream is simple: <span className="text-emerald-700 font-medium">a world where no student suffers in silence.</span>
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-stone-100">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Safe Space</p>
                  <p className="text-sm text-stone-500">Judgment-free zone</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-stone-100">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Community</p>
                  <p className="text-sm text-stone-500">Peer support first</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
