"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
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
    rain: number | null;
  };
  air: { aqi: string | null; pm25: number | null; pm10: number | null };
  updatedAt: string | null;
}

export default function Home() {
  const [data, setData] = useState<SensorData>({
    indoor: { temperature: null, humidity: null },
    outdoor: { weather: null, temperature: null, feelTemperature: null, humidity: null, windSpeed: null, rain: null },
    air: { aqi: null, pm25: null, pm10: null },
    updatedAt: null,
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io();
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("sensorData", (d: SensorData) => setData(d));

    // 카카오맵 초기화 추가
    const initMap = () => {
      if (typeof window === "undefined") return;
      const kakao = (window as any).kakao;
      if (!kakao || !kakao.maps) return;

      const container = document.getElementById("kakao-map");
      if (!container) return;

      const options = {
        center: new kakao.maps.LatLng(37.5587, 126.8638),
        level: 7,
      };
      const map = new kakao.maps.Map(container, options);
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
          content: `<div style="padding:5px;font-size:13px;">
            ${pos.title}<br>
            <a href="https://map.kakao.com/link/to/${pos.title},${pos.lat},${pos.lng}" 
              style="color:blue" target="_blank">길찾기</a>
          </div>`,
        });
        infowindow.open(map, marker);
      });
    };

    // 카카오맵 SDK 로드 후 초기화
    if ((window as any).kakao?.maps) {
      initMap();
    } else {
      const script = document.querySelector('script[src*="dapi.kakao.com"]');
      if (script) {
        script.addEventListener("load", initMap);
      }
    }

    return () => { socket.disconnect(); };
  }, []);

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      {/* 헤더 */}
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

      {/* 센서 카드 그리드 */}
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

      {/* 카카오 지도 */}
      <div className="rounded-xl overflow-hidden border" style={{ height: 350 }}>
        <div id="kakao-map" style={{ width: "100%", height: "100%" }} />
      </div>

      {/* 푸터 */}
      <div className="mt-6 text-center text-xs text-muted-foreground">
        MSK © 2026
      </div>
    </main>
  );
}