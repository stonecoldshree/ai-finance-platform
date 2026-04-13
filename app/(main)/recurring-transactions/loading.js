import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="px-5 space-y-6 pt-4">
      <Skeleton className="h-10 w-72 rounded-lg" />
      <Skeleton className="h-4 w-48 rounded" />
      <div className="space-y-4 mt-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
