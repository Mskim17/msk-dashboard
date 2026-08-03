import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AirCardProps {
  aqi: string | null;
  pm25: string | null;
  pm10: string | null;
  indoorTemp?: string | null;
  indoorHum?: string | null;
  outdoorTemp?: string | null;
  outdoorHum?: string | null;
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

export function AirCard({
  aqi,
  pm25,
  pm10,
  indoorTemp,
  indoorHum,
  outdoorTemp,
  outdoorHum,
}: AirCardProps) {
  const pm25Val = pm25 ? parseFloat(pm25) : null;
  const inHumVal = indoorHum ? parseFloat(indoorHum) : null;
  const outHumVal = outdoorHum ? parseFloat(outdoorHum) : null;
  const inTempVal = indoorTemp ? parseFloat(indoorTemp) : null;
  const outTempVal = outdoorTemp ? parseFloat(outdoorTemp) : null;

  // 환기 상태 가이드 계산
  const getVentilationStatus = () => {
    // 1. 미세먼지 우선 차단
    if (pm25Val !== null && pm25Val > 35) {
      return {
        label: "🚫 환기 자제",
        variant: "destructive" as const,
        reason: `초미세먼지(${pm25Val}µg/m³) 농도가 높습니다.`,
      };
    }

    // 2. 습도 비교: 야외 습도가 실내보다 높고, 야외 습도 자체가 75% 이상일 때 환기 비추천
    if (outHumVal !== null && inHumVal !== null) {
      if (outHumVal > inHumVal && outHumVal >= 75) {
        return {
          label: "💧 환기 자제",
          variant: "secondary" as const,
          reason: `야외 습도(${outHumVal}%)가 실내(${inHumVal}%)보다 높아 꿉꿉해집니다.`,
        };
      }
    }

    // 3. 온도 비교 활용 (자연 냉방 환기 가능 안내)
    if (inTempVal !== null && outTempVal !== null) {
      if (inTempVal >= 26 && outTempVal < inTempVal - 2) {
        return {
          label: "🪟 맞바람 환기",
          variant: "outline" as const,
          reason: `야외(${outTempVal}°C)가 실내(${inTempVal}°C)보다 시원합니다. 창문을 열어 열기를 시키세요.`,
        };
      }
    }

    return {
      label: "🪟 환기 가능",
      variant: "outline" as const,
      reason: "외부 공기 상태가 양호합니다.",
    };
  };

  const vent = getVentilationStatus();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">공기질 & 환기</CardTitle>
        <Badge variant={vent.variant}>{vent.label}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${aqi ? aqiColor[aqi] : "bg-gray-400"}`} />
          <span className="text-xl font-bold">{aqi ? aqiKorean[aqi] : "--"}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="bg-muted rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground mb-1">PM2.5</p>
            <p className="font-bold">{pm25 ? `${pm25}` : "--"}</p>
          </div>
          <div className="bg-muted rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground mb-1">PM10</p>
            <p className="font-bold">{pm10 ? `${pm10}` : "--"}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground border-t pt-2">{vent.reason}</p>
      </CardContent>
    </Card>
  );
}