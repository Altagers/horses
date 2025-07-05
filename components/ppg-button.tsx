"use client"

import type React from "react"

interface PpgButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "bubbles" | "blossom" | "buttercup" | "mojo" // Character/theme colors
  className?: string
  sparkles?: boolean // Option to add sparkles
}

export function PpgButton({
  children,
  variant = "primary",
  className = "",
  sparkles = false,
  ...props
}: PpgButtonProps) {
  const baseClasses = `
    font-heading text-2xl uppercase tracking-wider
    px-8 py-3 rounded-2xl border-2 border-black
    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    transition-all duration-150 ease-in-out
    hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]
    active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]
    relative overflow-hidden group
  `

  const getVariantClasses = () => {
    switch (variant) {
      case "bubbles": // Light Blue
        return "bg-[#73D2F3] text-black hover:bg-[#62c1e0]"
      case "blossom": // Pink
        return "bg-[#F283B3] text-black hover:bg-[#e070a0]"
      case "buttercup": // Lime Green (like "CONTINUE" button)
        return "bg-[#A2E5B3] text-black hover:bg-[#8fcf9f]"
      case "mojo": // Purple (for fun)
        return "bg-[#C084FC] text-white hover:bg-[#ae70dd]"
      default: // Primary - a vibrant yellow/orange
        return "bg-[#F9A826] text-black hover:bg-[#e0941f]"
    }
  }

  return (
    <button className={`${baseClasses} ${getVariantClasses()} ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
      {sparkles && (
        <>
          {/* Simple CSS Sparkles - can be enhanced with SVGs or more complex animations */}
          <span className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping delay-100"></span>
          <span className="absolute bottom-1 right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping delay-200"></span>
          <span className="absolute top-2 right-3 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping delay-300"></span>
        </>
      )}
    </button>
  )
}
