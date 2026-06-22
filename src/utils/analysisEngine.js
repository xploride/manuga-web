// 설문 답변 기반 영양소 추천 엔진

const CATEGORY_SCORES = {
  eye: "눈 건강",
  fatigue: "피로 관리",
  circulation: "혈행 건강",
  immunity: "면역 관리",
  digestion: "장 건강",
  joints: "관절 관리",
  vitality: "활력 관리",
  recovery: "운동 회복",
  muscle: "근육 증가",
}

const NUTRIENT_MAPPING = {
  eye: ["루테인", "비타민A"],
  fatigue: ["마그네슘", "비타민B군"],
  circulation: ["오메가3"],
  immunity: ["비타민C", "아연", "비타민D"],
  digestion: ["유산균"],
  joints: ["칼슘", "마그네슘"],
  vitality: ["비타민B군", "마그네슘"],
  recovery: ["단백질", "마그네슘"],
  muscle: ["단백질", "아연"],
}

export function calculateAnalysis(answers) {
  // 영양소별 점수 및 이유 저장
  const nutrientScores = {
    루테인: 0,
    비타민D: 0,
    비타민B군: 0,
    마그네슘: 0,
    단백질: 0,
    아연: 0,
    비타민C: 0,
    유산균: 0,
    오메가3: 0,
    칼슘: 0,
  }

  const nutrientReasons = {
    루테인: [],
    비타민D: [],
    비타민B군: [],
    마그네슘: [],
    단백질: [],
    아연: [],
    비타민C: [],
    유산균: [],
    오메가3: [],
    칼슘: [],
  }

  const addScore = (nutrient, points, reason) => {
    nutrientScores[nutrient] += points
    nutrientReasons[nutrient].push({ source: reason, points })
  }

  // 질문 3: 컴퓨터 사용시간
  const computerTime = answers[3]?.[0]
  if (computerTime === "4~8시간") {
    addScore("루테인", 30, "컴퓨터 사용시간 4~8시간")
  } else if (computerTime === "8시간 이상") {
    addScore("루테인", 40, "컴퓨터 사용시간 8시간 이상")
  }

  // 질문 4: 앉아있는 시간
  const sittingTime = answers[4]?.[0]
  if (sittingTime === "6시간 이상") {
    addScore("오메가3", 20, "앉아있는 시간 6시간 이상")
  }

  // 질문 5: 걷는 시간
  const walkingTime = answers[5]?.[0]
  if (walkingTime === "30분 이하") {
    addScore("오메가3", 15, "걷는 시간 30분 이하")
  }

  // 질문 6: 햇빛 노출
  const sunExposure = answers[6]?.[0]
  if (sunExposure === "거의 없음") {
    addScore("비타민D", 50, "햇빛 노출 거의 없음")
  } else if (sunExposure === "30분 이하") {
    addScore("비타민D", 30, "햇빛 노출 30분 이하")
  }

  // 질문 8: 운동 빈도
  const exerciseFreq = answers[8]?.[0]
  if (exerciseFreq === "안함") {
    addScore("비타민B군", 20, "운동 빈도 안함")
  } else if (exerciseFreq === "주3~4회" || exerciseFreq === "주5회 이상") {
    addScore("단백질", 30, `운동 빈도 ${exerciseFreq}`)
    addScore("마그네슘", 20, `운동 빈도 ${exerciseFreq}`)
  }

  // 질문 9: 건강 목표 (다중선택)
  const goals = answers[9] || []
  if (goals.includes("운동회복")) {
    addScore("단백질", 30, "건강 목표: 운동회복")
    addScore("마그네슘", 30, "건강 목표: 운동회복")
  }
  if (goals.includes("근육증가")) {
    addScore("단백질", 50, "건강 목표: 근육증가")
    addScore("아연", 10, "건강 목표: 근육증가")
  }
  if (goals.includes("면역관리")) {
    addScore("비타민C", 40, "건강 목표: 면역관리")
    addScore("아연", 20, "건강 목표: 면역관리")
  }
  if (goals.includes("장건강")) {
    addScore("유산균", 50, "건강 목표: 장건강")
  }
  if (goals.includes("혈행건강")) {
    addScore("오메가3", 50, "건강 목표: 혈행건강")
  }
  if (goals.includes("관절관리")) {
    addScore("칼슘", 40, "건강 목표: 관절관리")
    addScore("마그네슘", 20, "건강 목표: 관절관리")
  }
  if (goals.includes("활력관리")) {
    addScore("비타민B군", 30, "건강 목표: 활력관리")
    addScore("마그네슘", 20, "건강 목표: 활력관리")
  }
  if (goals.includes("눈건강")) {
    addScore("루테인", 30, "건강 목표: 눈건강")
  }

  // 질문 10: 현재 고민 (다중선택)
  const concerns = answers[10] || []
  if (concerns.includes("눈피로")) {
    addScore("루테인", 60, "현재 고민: 눈피로")
  }
  if (concerns.includes("만성피로")) {
    addScore("비타민B군", 40, "현재 고민: 만성피로")
    addScore("마그네슘", 30, "현재 고민: 만성피로")
  }
  if (concerns.includes("수면부족")) {
    addScore("마그네슘", 40, "현재 고민: 수면부족")
  }
  if (concerns.includes("자고 일어나도 피곤함")) {
    addScore("마그네슘", 30, "현재 고민: 자고 일어나도 피곤함")
    addScore("비타민B군", 20, "현재 고민: 자고 일어나도 피곤함")
  }
  if (concerns.includes("근육회복 느림")) {
    addScore("단백질", 40, "현재 고민: 근육회복 느림")
  }
  if (concerns.includes("관절불편")) {
    addScore("칼슘", 40, "현재 고민: 관절불편")
  }
  if (concerns.includes("장트러블")) {
    addScore("유산균", 40, "현재 고민: 장트러블")
  }

  // 질문 11: 식습관
  const diet = answers[11]?.[0]
  if (diet === "불규칙함") {
    addScore("비타민C", 20, "식습관: 불규칙함")
    addScore("유산균", 20, "식습관: 불규칙함")
  } else if (diet === "배달음식위주") {
    addScore("비타민C", 15, "식습관: 배달음식위주")
    addScore("유산균", 15, "식습관: 배달음식위주")
  }

  // 질문 12: 수면 상태
  const sleep = answers[12]?.[0]
  if (sleep === "부족함" || sleep === "매우부족함") {
    addScore("마그네슘", 30, `수면 상태 ${sleep}`)
  }

  // TOP 3 영양소 선정
  const nutrientCategoryMap = {
    루테인: "눈 건강",
    비타민D: "면역 관리",
    비타민B군: "피로 관리, 활력 관리",
    마그네슘: "피로 관리, 운동 회복, 관절 관리, 활력 관리",
    단백질: "운동 회복, 근육 증가",
    아연: "면역 관리, 근육 증가",
    비타민C: "면역 관리",
    유산균: "장 건강",
    오메가3: "혈행 건강",
    칼슘: "관절 관리",
  }

  const topNutrients = Object.entries(nutrientScores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .slice(0, 3)
    .map(([name, score]) => ({
      name,
      score,
      reasons: nutrientReasons[name],
      relatedCategory: nutrientCategoryMap[name],
    }))

  return {
    nutrients: topNutrients,
    allNutrientScores: nutrientScores,
    allReasons: nutrientReasons,
  }
}

export function getCategoryDetails(categoryKey, categoryReasons = []) {
  const baseDetails = {
    eye: {
      label: "눈 건강",
      icon: "👁️",
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      suggestion: "루테인 섭취를 고려해볼 수 있습니다.",
      mainNutrient: "루테인",
      relatedNutrients: ["비타민A"],
    },
    fatigue: {
      label: "피로 관리",
      icon: "🌙",
      bg: "bg-indigo-50",
      color: "text-indigo-500",
      suggestion: "마그네슘 섭취를 고려해볼 수 있습니다.",
      mainNutrient: "마그네슘",
      relatedNutrients: ["비타민B군"],
    },
    circulation: {
      label: "혈행 건강",
      icon: "❤️",
      bg: "bg-rose-50",
      color: "text-rose-500",
      suggestion: "오메가3 섭취를 고려해볼 수 있습니다.",
      mainNutrient: "오메가3",
      relatedNutrients: ["비타민E"],
    },
    immunity: {
      label: "면역 관리",
      icon: "🛡️",
      bg: "bg-amber-50",
      color: "text-amber-600",
      suggestion: "비타민C 섭취를 고려해볼 수 있습니다.",
      mainNutrient: "비타민C",
      relatedNutrients: ["아연", "비타민D"],
    },
    digestion: {
      label: "장 건강",
      icon: "🔄",
      bg: "bg-purple-50",
      color: "text-purple-500",
      suggestion: "유산균 섭취를 고려해볼 수 있습니다.",
      mainNutrient: "유산균",
      relatedNutrients: ["식이섬유"],
    },
    joints: {
      label: "관절 관리",
      icon: "🦴",
      bg: "bg-blue-50",
      color: "text-blue-500",
      suggestion: "칼슘 섭취를 고려해볼 수 있습니다.",
      mainNutrient: "칼슘",
      relatedNutrients: ["마그네슘"],
    },
    vitality: {
      label: "활력 관리",
      icon: "⚡",
      bg: "bg-cyan-50",
      color: "text-cyan-600",
      suggestion: "비타민B군 섭취를 고려해볼 수 있습니다.",
      mainNutrient: "비타민B군",
      relatedNutrients: ["마그네슘"],
    },
    recovery: {
      label: "운동 회복",
      icon: "💪",
      bg: "bg-rose-50",
      color: "text-rose-500",
      suggestion: "단백질 섭취를 고려해볼 수 있습니다.",
      mainNutrient: "단백질",
      relatedNutrients: ["마그네슘"],
    },
    muscle: {
      label: "근육 증가",
      icon: "🏋️",
      bg: "bg-orange-50",
      color: "text-orange-500",
      suggestion: "단백질 섭취를 고려해볼 수 있습니다.",
      mainNutrient: "단백질",
      relatedNutrients: ["아연"],
    },
  }

  const details = baseDetails[categoryKey] || baseDetails.eye

  // 동적 reason 생성
  const reasonTexts = categoryReasons.map(r => r.source)
  const reason = reasonTexts.length > 0
    ? reasonTexts.join(", ") + "에 따라 이 카테고리가 추천되었습니다."
    : "영양 관리가 필요한 상태입니다."

  return {
    ...details,
    reason,
    reasonList: categoryReasons,
  }
}
