import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
      <BarLoader className="mt-4" width={"100%"} color="#f97316" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 bg-muted/50 animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}
