import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="px-5 space-y-8">
      <div className="h-10 w-64 bg-muted animate-pulse rounded-lg" />
      <BarLoader className="mt-4" width={"100%"} color="#f97316" />
      <div className="flex items-center gap-4">
        <div className="h-10 w-[200px] bg-muted animate-pulse rounded" />
        <div className="h-10 w-[170px] bg-muted animate-pulse rounded" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="h-24 bg-muted/50 animate-pulse rounded-xl" />
        <div className="h-24 bg-muted/50 animate-pulse rounded-xl" />
        <div className="h-24 bg-muted/50 animate-pulse rounded-xl" />
        <div className="h-24 bg-muted/50 animate-pulse rounded-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-80 bg-muted/50 animate-pulse rounded-xl" />
        <div className="h-80 bg-muted/50 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
