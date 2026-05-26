export default function UsersSkeleton() {
  return (
    <div className="w-full h-96 animate-pulse flex flex-col gap-3 p-4">
      <div className="h-4 w-40 bg-purple-500/10 rounded" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-3 bg-purple-500/5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-purple-500/10" />
          <div className="flex-1 h-3 bg-purple-500/10 rounded" />
          <div className="w-16 h-3 bg-purple-500/10 rounded" />
        </div>
      ))}
    </div>
  )
}