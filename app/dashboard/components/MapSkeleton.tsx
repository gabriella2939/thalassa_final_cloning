export default function MapSkeleton() {
  return (
    <div className="w-full h-full bg-[#0a0a0a] rounded-2xl flex items-center justify-center border-2 border-purple-500/20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        <div className="text-[10px] text-purple-400 tracking-widest animate-pulse">LOADING MAP...</div>
      </div>
    </div>
  )
}