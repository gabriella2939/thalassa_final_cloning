import React from 'react'

type SkeletonBoxProps = {
  className?: string
  style?: React.CSSProperties
}

export function SkeletonBox({
  className = "",
  style
}: SkeletonBoxProps) {
  return (
    <div
      className={`bg-purple-500/10 rounded animate-pulse ${className}`}
      style={style}
    />
  )
}

export function SpinnerLoader({
  text = "LOADING..."
}: {
  text?: string
}) {
  return (
    <div className="min-h-screen bg-[#050408] flex flex-col items-center justify-center gap-6 font-mono">
      
      {/* Spinner */}
      <div className="relative w-16 h-16">
        
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/20"></div>

        {/* Main Spinner */}
        <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

        {/* Inner Spinner */}
        <div
          className="absolute inset-2 rounded-full border border-t-purple-300/40 border-r-transparent border-b-transparent border-l-transparent animate-spin"
          style={{
            animationDirection: 'reverse',
            animationDuration: '0.8s'
          }}
        ></div>
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-1">
        
        <div className="text-[10px] text-purple-400 tracking-[0.4em] font-bold">
          {text}
        </div>

        {/* Dots */}
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-purple-500/60 animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#050408] font-mono p-6 animate-pulse">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <SkeletonBox className="h-6 w-40" />
        <SkeletonBox className="h-6 w-24" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0c0914] border border-purple-500/10 rounded-xl p-4"
          >
            <SkeletonBox className="h-3 w-16 mb-3" />
            <SkeletonBox className="h-8 w-24 mb-2" />
            <SkeletonBox className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-4">

        {/* Chart */}
        <div
          className="col-span-2 bg-[#0c0914] border border-purple-500/10 rounded-xl p-4"
          style={{ height: '320px' }}
        >
          <SkeletonBox className="h-4 w-32 mb-4" />
          <SkeletonBox className="h-full w-full rounded-lg" />
        </div>

        {/* Side Cards */}
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0c0914] border border-purple-500/10 rounded-xl p-4"
            >
              <SkeletonBox className="h-3 w-20 mb-2" />
              <SkeletonBox className="h-6 w-32" />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export function TableSkeleton({
  rows = 5
}: {
  rows?: number
}) {
  return (
    <div className="min-h-screen bg-[#050408] font-mono p-8 animate-pulse">

      {/* Title */}
      <SkeletonBox className="h-8 w-64 mb-8" />

      {/* Table */}
      <div className="bg-[#0c0914] border border-purple-500/10 rounded-xl overflow-hidden">

        {/* Header */}
        <div className="flex gap-4 p-4 border-b border-purple-500/10">
          {[...Array(5)].map((_, i) => (
            <SkeletonBox
              key={i}
              className="h-3 flex-1"
            />
          ))}
        </div>

        {/* Rows */}
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 border-b border-purple-500/5"
          >
            {[...Array(5)].map((_, j) => (
              <SkeletonBox
                key={j}
                className="h-4 flex-1"
                style={{
                  opacity: 1 - i * 0.1
                }}
              />
            ))}
          </div>
        ))}

      </div>
    </div>
  )
}