import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AirCardProps {
  aqi: string | null;
  pm25: string | null;
  pm10: string | null;
}

const aqiColor: Record<string, string> = {
  Good: "bg-green-500",
  Fair: "bg-yellow-500",
  Moderate: "bg-orange-500",
  Poor: "bg-red-500",
  "Very Poor": "bg-purple-500",
};

const aqiKorean: Record<string, string> = {
  Good: "좋음",
  Fair: "보통",
  Moderate: "보통",
  Poor: "나쁨",
  "Very Poor": "매우나쁨",
};

export function AirCard({ aqi, pm25, pm10 }: AirCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">공기질</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${aqi ? aqiColor[aqi] : "bg-gray-400"}`} />
          <span className="text-xl font-bold">{aqi ? aqiKorean[aqi] : "--"}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-muted rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground mb-1">PM2.5</p>
            <p className="font-bold">{pm25 ? `${pm25}` : "--"}</p>
          </div>
          <div className="bg-muted rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground mb-1">PM10</p>
            <p className="font-bold">{pm10 ? `${pm10}` : "--"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}