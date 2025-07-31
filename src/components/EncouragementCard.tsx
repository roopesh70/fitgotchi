"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

type EncouragementCardProps = {
  message: string | null;
  isPending: boolean;
};

export default function EncouragementCard({
  message,
  isPending,
}: EncouragementCardProps) {
  return (
    <Card className="shadow-lg rounded-xl bg-accent/30 border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent-foreground">
          <Sparkles className="text-primary" />A word of encouragement!
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <p className="text-card-foreground/80 font-medium">{message}</p>
        )}
      </CardContent>
    </Card>
  );
}
