import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getApplianceRecommendation } from "@/lib/recommendation";

interface ApplianceCardProps {
  indoorTemp: string | null;
  indoorHum: string | null;
  outdoorHum: string | null;
}

export function ApplianceCard({ indoorTemp, indoorHum, outdoorHum }: ApplianceCardProps) {
  const status = getApplianceRecommendation(indoorTemp, indoorHum, outdoorHum);

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">스마트 가전 제어 가이드</CardTitle>
        <span className="text-xl">{status.icon}</span>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{status.title}</span>
          <Badge variant={status.badgeVariant}>{status.action}</Badge>
        </div>
        
        <p className="text-xs text-muted-foreground leading-relaxed">
          {status.reason}
        </p>

        {status.di !== null && (
          <div className="pt-2 border-t flex justify-between items-center text-xs text-muted-foreground">
            <span>실내 불쾌지수 (DI)</span>
            <span className="font-semibold text-foreground">{status.di}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}