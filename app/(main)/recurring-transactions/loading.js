import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="px-5 space-y-6">
      <div className="h-10 w-72 bg-muted animate-pulse rounded-lg" />
      <div className="h-4 w-48 bg-muted animate-pulse rounded" />
      <BarLoader className="mt-4" width={"100%"} color="#f97316" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}
