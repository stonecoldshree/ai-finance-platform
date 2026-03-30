import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="space-y-6 px-5">
      <div className="h-10 w-48 bg-muted animate-pulse rounded-lg" />
      <div className="h-4 w-64 bg-muted animate-pulse rounded" />
      <BarLoader className="mt-4" width={"100%"} color="#f97316" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-24 bg-muted/50 animate-pulse rounded-xl" />
        <div className="h-24 bg-muted/50 animate-pulse rounded-xl" />
        <div className="h-24 bg-muted/50 animate-pulse rounded-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 bg-muted/50 animate-pulse rounded-xl" />
        <div className="h-48 bg-muted/50 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
