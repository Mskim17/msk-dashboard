"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getApplianceRecommendation } from "@/lib/recommendation";

interface ApplianceCardProps {
  indoorTemp: string | null;
  indoorHum: string | null;
  outdoorHum: string | null;
}

export function ApplianceCard({
  indoorTemp,
  indoorHum,
  outdoorHum,
}: ApplianceCardProps) {
  const rec = getApplianceRecommendation(indoorTemp, indoorHum, outdoorHum);

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">가전 제어 가이드</CardTitle>
        <Badge variant={rec.badgeVariant}>{rec.action}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{rec.reason}</p>
        {rec.discomfortIndex !== undefined && (
          <div className="mt-3 text-xs text-muted-foreground border-t pt-2">
            현재 불쾌지수: <span className="font-semibold text-foreground">{rec.discomfortIndex}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}