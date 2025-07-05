"use client"

import type React from "react"

interface ButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary"
  onClick?: () => void
  className?: string
}

export function Button({ children, variant = "primary", onClick, className = "" }: ButtonProps) {
  const baseClasses =
    "px-8 py-3 font-bold text-white rounded-md transition-transform hover:scale-105 active:scale-95 shadow-lg"
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-300",
    secondary: "bg-white text-blue-600 border-2 border-blue-500 hover:bg-blue-50 shadow-blue-200",
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
