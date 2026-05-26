export default function AnalyticsSkeleton() {
  return (
    <div className="w-full h-96 animate-pulse flex flex-col gap-4 p-4">
      <div className="h-4 w-32 bg-purple-500/10 rounded" />
      <div className="flex-1 bg-purple-500/10 rounded-xl" />
    </div>
  )
}