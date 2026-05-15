"use client";
import { useEffect, useState } from "react";
import { SensorCard } from "@/components/SensorCard";
import { WeatherCard } from "@/components/WeatherCard";
import { AirCard } from "@/components/AirCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SensorData {
  indoor: { temperature: string | null; humidity: string | null };
  outdoor: {
    weather: string | null;
    temperature: string | null;
    feelTemperature: string | null;
    humidity: string | null;
    windSpeed: string | null;
    rain: string | null;
  };
  air: { aqi: string | null; pm25: string | null; pm10: string | null };
  updatedAt: string | null;
}

const API_URL = "/api/proxy/dashboard";

export default function Home() {
  const [data, setData] = useState<SensorData>({
    indoor: { temperature: null, humidity: null },
    outdoor: { weather: null, temperature: null, feelTemperature: null, humidity: null, windSpeed: null, rain: null },
    air: { aqi: null, pm25: null, pm10: null },
    updatedAt: null,
  });
  const [connected, setConnected] = useState(false);
  
  const fetchData = async () => {
    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("API 오류");
      const json = await res.json();
      setData(json);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);

    // 카카오맵 초기화
    const initMap = () => {
      const kakao = (window as any).kakao;
      if (!kakao?.maps) return;

      // autoload=false 일 때 수동으로 load 호출
      kakao.maps.load(() => {
        const container = document.getElementById("kakao-map");
        if (!container) return;

        const map = new kakao.maps.Map(container, {
          center: new kakao.maps.LatLng(37.5587, 126.8638),
          level: 7,
        });
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

        const positions = [
          { title: "가양9단지", lat: 37.5587, lng: 126.8638 },
          { title: "성수아이파크", lat: 37.5472, lng: 127.0558 },
        ];

        positions.forEach((pos) => {
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(pos.lat, pos.lng),
          });
          marker.setMap(map);
          const infowindow = new kakao.maps.InfoWindow({
            position: new kakao.maps.LatLng(pos.lat, pos.lng),
            content: `<div style="padding:5px;font-size:13px;">${pos.title}<br>
              <a href="https://map.kakao.com/link/to/${pos.title},${pos.lat},${pos.lng}" 
                style="color:blue" target="_blank">길찾기</a></div>`,
          });
          infowindow.open(map, marker);
        });
      });
    };

    if ((window as any).kakao?.maps) {
      initMap();
    } else {
      const script = document.querySelector('script[src*="dapi.kakao.com"]');
      script?.addEventListener("load", initMap);
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">🏠 MSK House</h1>
          <p className="text-sm text-muted-foreground">
            {data.updatedAt ? `마지막 갱신: ${data.updatedAt}` : "데이터 로딩 중..."}
          </p>
        </div>
        <Badge variant={connected ? "default" : "destructive"}>
          {connected ? "● 연결됨" : "○ 연결 끊김"}
        </Badge>
      </div>

      <Separator className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <SensorCard
          title="실내 온습도"
          temperature={data.indoor.temperature}
          humidity={data.indoor.humidity}
        />
        <WeatherCard
          weather={data.outdoor.weather}
          temperature={data.outdoor.temperature}
          feelTemperature={data.outdoor.feelTemperature}
          humidity={data.outdoor.humidity}
          windSpeed={data.outdoor.windSpeed}
          rain={data.outdoor.rain}
        />
        <AirCard
          aqi={data.air.aqi}
          pm25={data.air.pm25}
          pm10={data.air.pm10}
        />
      </div>
      
      <div className="rounded-xl overflow-hidden border" style={{ height: 350 }}>
        <div id="kakao-map" style={{ width: "100%", height: "100%" }} />
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        MSK © 2026
      </div>
    </main>
  );
}