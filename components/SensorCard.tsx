import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets } from "lucide-react";

interface SensorCardProps {
  temperature: string | null;
  humidity: string | null;
  title: string;
  icon?: "indoor" | "outdoor";
}

export function SensorCard({ temperature, humidity, title }: SensorCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">
                {temperature ? `${temperature}℃` : "--"}
              </p>
              <p className="text-xs text-muted-foreground">온도</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">
                {humidity ? `${humidity}%` : "--"}
              </p>
              <p className="text-xs text-muted-foreground">습도</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}