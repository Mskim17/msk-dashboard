import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = Number(process.env.PORT) || 3000;

// 날씨 API
const fetchWeather = async () => {
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${process.env.WEATHER_API_KEY}`
  );
  const data = await res.json();
  const rain = data.rain?.["1h"] || 0;
  return {
    weather: data.weather[0].main,
    temperature: (data.main.temp - 273.15).toFixed(1),
    feelTemperature: (data.main.feels_like - 273.15).toFixed(1),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    rain,
  };
};

// 공기질 API
const fetchAirQuality = async () => {
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=37.5587&lon=126.8638&appid=${process.env.WEATHER_API_KEY}`
  );
  const data = await res.json();
  const aqi = data.list[0].main.aqi;
  const aqiLabel = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi];
  return {
    aqi: aqiLabel,
    pm25: data.list[0].components.pm2_5,
    pm10: data.list[0].components.pm10,
  };
};

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  // 센서 데이터 저장
  let sensorData = {
    indoor: { temperature: null as string | null, humidity: null as string | null },
    outdoor: { weather: null as string | null, temperature: null as string | null, feelTemperature: null as string | null, humidity: null as string | null, windSpeed: null as string | null, rain: null as number | null },
    air: { aqi: null as string | null, pm25: null as number | null, pm10: null as number | null },
    updatedAt: null as string | null,
  };

  // 날씨 데이터 갱신 (10분마다)
  const refreshWeather = async () => {
    try {
      const [weather, air] = await Promise.all([fetchWeather(), fetchAirQuality()]);
      sensorData.outdoor = weather;
      sensorData.air = air;
      sensorData.updatedAt = new Date().toLocaleString("ko-KR");
      io.emit("sensorData", sensorData);
      console.log("날씨 갱신:", sensorData.updatedAt);
    } catch (e) {
      console.error("날씨 API 오류:", e);
    }
  };

  refreshWeather();
  setInterval(refreshWeather, 10 * 60 * 1000);

  io.on("connection", (socket) => {
    console.log("클라이언트 연결:", socket.id);

    // 연결 즉시 현재 데이터 전송
    socket.emit("sensorData", sensorData);

    // 라즈베리파이 센서 데이터 수신
    socket.on("sensorUpdate", (data: { temperature: string; humidity: string }) => {
      sensorData.indoor = data;
      sensorData.updatedAt = new Date().toLocaleString("ko-KR");
      io.emit("sensorData", sensorData);
    });

    socket.on("disconnect", () => {
      console.log("클라이언트 해제:", socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`MSK Dashboard running on http://localhost:${PORT}`);
  });
});