export default function EventSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-sky-100 bg-white p-4">
      <div className="h-44 rounded-lg bg-sky-100" />
      <div className="mt-4 h-4 w-1/2 rounded bg-sky-100" />
      <div className="mt-2 h-4 w-3/4 rounded bg-sky-100" />
      <div className="mt-3 h-3 w-full rounded bg-sky-100" />
      <div className="mt-2 h-3 w-2/3 rounded bg-sky-100" />
    </div>
  )
}
