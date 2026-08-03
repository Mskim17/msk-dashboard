export interface ApplianceStatus {
  action: "AIR_CONDITIONER" | "DEHUMIDIFIER" | "VENTILATE_DEHUMIDIFY" | "OFF";
  title: string;
  reason: string;
  badgeVariant: "default" | "destructive" | "secondary" | "outline";
  icon: string;
  di: number | null;
}

export function getApplianceRecommendation(
  inTempStr: string | null,
  inHumStr: string | null,
  outHumStr: string | null
): ApplianceStatus {
  const inTemp = parseFloat(inTempStr || "");
  const inHum = parseFloat(inHumStr || "");
  const outHum = parseFloat(outHumStr || "");

  if (isNaN(inTemp) || isNaN(inHum)) {
    return {
      action: "OFF",
      title: "데이터 수집 중",
      reason: "실내 온습도 데이터를 대기하고 있습니다.",
      badgeVariant: "outline",
      icon: "⏳",
      di: null,
    };
  }

  // 불쾌지수(DI) 계산 formula
  const di = parseFloat(
    (0.81 * inTemp + 0.01 * inHum * (0.99 * inTemp - 14.3) + 46.3).toFixed(1)
  );

  // 1. 에어컨 가동 조건 (온도 31°C 이상 또는 불쾌지수 80 이상)
  if (inTemp >= 31 || di >= 80) {
    return {
      action: "AIR_CONDITIONER",
      title: "에어컨 가동 추천",
      reason: `실내 온도(${inTemp}°C) 및 불쾌지수(${di})가 높습니다. 냉방이 필요합니다.`,
      badgeVariant: "destructive",
      icon: "❄️",
      di,
    };
  }

  // 2. 제습 관련 조건 (실내 습도 70% 이상)
  if (inHum >= 70) {
    if (!isNaN(outHum) && outHum < inHum - 10) {
      return {
        action: "VENTILATE_DEHUMIDIFY",
        title: "환기 후 제습 추천",
        reason: `외부 습도(${outHum}%)가 실내(${inHum}%)보다 낮습니다. 환기 후 제습기를 틀어주세요.`,
        badgeVariant: "secondary",
        icon: "🪟",
        di,
      };
    }
    return {
      action: "DEHUMIDIFIER",
      title: "제습기 가동 추천",
      reason: `실내 습도(${inHum}%)가 높아 다소 꿉꿉합니다. 창문을 닫고 제습기를 틀어주세요.`,
      badgeVariant: "secondary",
      icon: "💧",
      di,
    };
  }

  // 3. 쾌적한 상태
  return {
    action: "OFF",
    title: "쾌적한 환경 유지 중",
    reason: `실내 온습도 및 불쾌지수(${di})가 적정 범위 내에 있습니다.`,
    badgeVariant: "outline",
    icon: "✅",
    di,
  };
}