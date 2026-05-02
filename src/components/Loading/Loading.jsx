import {Card, Skeleton} from "@heroui/react";

export default function Loading() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="w-full max-w-3xl mx-auto glass-card p-6 border-none" radius="lg">
          <div className="flex gap-4 items-center mb-4">
            <Skeleton className="rounded-full w-12 h-12" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-1/3 h-3 rounded-lg" />
              <Skeleton className="w-1/4 h-2 rounded-lg" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="w-full h-24 rounded-2xl" />
            <div className="flex gap-2">
              <Skeleton className="w-16 h-8 rounded-full" />
              <Skeleton className="w-16 h-8 rounded-full" />
              <Skeleton className="w-16 h-8 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
