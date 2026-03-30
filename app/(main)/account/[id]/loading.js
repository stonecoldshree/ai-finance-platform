import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <div className="h-12 w-56 bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
        </div>
        <div className="text-right">
          <div className="h-8 w-36 bg-muted animate-pulse rounded ml-auto" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded mt-2 ml-auto" />
        </div>
      </div>
      <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      <div className="h-72 bg-muted/50 animate-pulse rounded-xl" />
      <div className="h-64 bg-muted/50 animate-pulse rounded-xl" />
    </div>
  );
}
