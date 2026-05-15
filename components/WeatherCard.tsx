import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Cloud, Umbrella } from "lucide-react";

interface WeatherCardProps {
  weather: string | null;
  temperature: string | null;
  feelTemperature: string | null;
  humidity: string | null;
  windSpeed: string | null;
  rain: number | null;
}

const weatherEmoji: Record<string, string> = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Snow: "❄️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Mist: "🌫️",
  Fog: "🌫️",
};

export function WeatherCard({ weather, temperature, feelTemperature, humidity, windSpeed, rain }: WeatherCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">외부 날씨</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{weather ? weatherEmoji[weather] || "🌤️" : "🌤️"}</span>
          <div>
            <p className="text-3xl font-bold">{temperature ? `${temperature}` : "--"}</p>
            <p className="text-xs text-muted-foreground">체감 {feelTemperature ? `${feelTemperature}` : "--"}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>{humidity ? `${humidity}` : "--"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-4 w-4 text-gray-500" />
            <span>{windSpeed ? `${windSpeed}` : "--"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Umbrella className="h-4 w-4 text-blue-400" />
            <span>{rain ? `${rain}mm` : "0mm"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Droplets({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
}