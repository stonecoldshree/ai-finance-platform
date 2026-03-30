import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <div className="h-12 w-48 bg-muted animate-pulse rounded-lg" />
      </div>
      <BarLoader className="mt-4" width={"100%"} color="#f97316" />
      <div className="mt-8 space-y-6">
        <div className="h-32 bg-muted/50 animate-pulse rounded-xl" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 bg-muted/50 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/50 animate-pulse rounded-xl" />
          <div className="h-28 bg-muted/50 animate-pulse rounded-xl" />
        </div>
        <div className="h-64 bg-muted/50 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
