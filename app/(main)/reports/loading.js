import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="px-5 space-y-6">
      <div className="h-10 w-48 bg-muted animate-pulse rounded-lg" />
      <div className="h-4 w-64 bg-muted animate-pulse rounded" />
      <BarLoader className="mt-4" width={"100%"} color="#f97316" />
      <div className="h-32 bg-muted/50 animate-pulse rounded-xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-24 bg-muted/50 animate-pulse rounded-xl" />
        <div className="h-24 bg-muted/50 animate-pulse rounded-xl" />
        <div className="h-24 bg-muted/50 animate-pulse rounded-xl" />
      </div>
      <div className="h-64 bg-muted/50 animate-pulse rounded-xl" />
    </div>
  );
}
