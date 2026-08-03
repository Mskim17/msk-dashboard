export interface RecommendationResult {
  action: string;
  reason: string;
  discomfortIndex?: number;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

export function getApplianceRecommendation(
  indoorTempStr: string | null,
  indoorHumStr: string | null,
  outdoorHumStr: string | null
): RecommendationResult {
  if (!indoorTempStr || !indoorHumStr) {
    return { action: "데이터 없음", reason: "온습도 데이터를 불러오는 중입니다.", badgeVariant: "outline" };
  }

  const temp = parseFloat(indoorTempStr);
  const hum = parseFloat(indoorHumStr);

  if (isNaN(temp) || isNaN(hum)) {
    return { action: "데이터 오류", reason: "유효하지 않은 온습도 값입니다.", badgeVariant: "outline" };
  }

  // 1. 겨울철 난방 조건 (실내 18°C 미만)
  if (temp < 18) {
    let reason = `실내 온도가 ${temp}°C로 낮아 난방 가동을 권장합니다.`;
    if (hum < 35) {
      reason += " (습도가 35% 미만이므로 가습기 동시 가동 추천)";
    }
    return {
      action: "🔥 난방 추천",
      reason,
      badgeVariant: "destructive",
    };
  }

  // 불쾌지수(DI) 계산
  const di = 0.81 * temp + 0.01 * hum * (0.99 * temp - 14.3) + 46.3;
  const roundedDI = Math.round(di * 10) / 10;

  // 2. 에어컨 조건 (내 느낌 기준: 31°C 이상 AND 불쾌지수 80 이상)
  if (temp >= 31 && di >= 80) {
    return {
      action: "❄️ 에어컨 추천",
      reason: `기온(${temp}°C)과 불쾌지수(${roundedDI})가 모두 높습니다. 에어컨을 켜세요.`,
      discomfortIndex: roundedDI,
      badgeVariant: "destructive",
    };
  }

  // 3. 제습기 조건 (30°C 미만인데 습도가 70% 이상으로 꿉꿉할 때)
  if (temp < 30 && hum >= 70) {
    return {
      action: "💧 제습기 추천",
      reason: `기온은 ${temp}°C, 습도(${hum}%)가 높아 제습기를 권장합니다.`,
      discomfortIndex: roundedDI,
      badgeVariant: "secondary",
    };
  }

  // 4. 쾌적 상태
  return {
    action: "🍃 실내 쾌적",
    reason: `실내 온도(${temp}°C)와 습도(${hum}%)가 적정한 수준입니다.`,
    discomfortIndex: roundedDI,
    badgeVariant: "default",
  };
}