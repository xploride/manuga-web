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
  const scores = {
    eye: 0,
    fatigue: 0,
    circulation: 0,
    immunity: 0,
    digestion: 0,
    joints: 0,
    vitality: 0,
    recovery: 0,
    muscle: 0,
  }

  const reasons = {
    eye: [],
    fatigue: [],
    circulation: [],
    immunity: [],
    digestion: [],
    joints: [],
    vitality: [],
    recovery: [],
    muscle: [],
  }

  // 질문 3: 컴퓨터 사용시간 → 눈 건강
  const computerTime = answers[3]?.[0]
  if (computerTime === "4~8시간" || computerTime === "8시간 이상") {
    scores.eye += 40
    reasons.eye.push({ source: `컴퓨터 사용시간 ${computerTime}`, points: 40 })
  } else if (computerTime === "1~4시간") {
    scores.eye += 20
    reasons.eye.push({ source: `컴퓨터 사용시간 ${computerTime}`, points: 20 })
  }

  // 질문 4: 앉아있는 시간 → 혈행 건강, 활력
  const sittingTime = answers[4]?.[0]
  if (sittingTime === "6~8시간" || sittingTime === "8시간 이상") {
    scores.circulation += 30
    scores.vitality += 20
    reasons.circulation.push({ source: `앉아있는 시간 ${sittingTime}`, points: 30 })
    reasons.vitality.push({ source: `앉아있는 시간 ${sittingTime}`, points: 20 })
  }

  // 질문 5: 걷는 시간 → 혈행, 활력
  const walkingTime = answers[5]?.[0]
  if (walkingTime === "30분 이하") {
    scores.circulation += 20
    scores.vitality += 20
    reasons.circulation.push({ source: `걷는 시간 ${walkingTime}`, points: 20 })
    reasons.vitality.push({ source: `걷는 시간 ${walkingTime}`, points: 20 })
  }

  // 질문 6: 햇빛 노출 → 면역 (비타민D)
  const sunExposure = answers[6]?.[0]
  if (sunExposure === "거의 없음" || sunExposure === "30분 이하") {
    scores.immunity += 25
    reasons.immunity.push({ source: `햇빛 노출 ${sunExposure}`, points: 25 })
  }

  // 질문 7: 신체활용 강도 → 회복, 근육, 피로
  const activityLevel = answers[7]?.[0]
  if (activityLevel === "매우높음 (중량물·육체노동)") {
    scores.recovery += 30
    scores.muscle += 25
    reasons.recovery.push({ source: `신체활용 강도 매우높음`, points: 30 })
    reasons.muscle.push({ source: `신체활용 강도 매우높음`, points: 25 })
  } else if (activityLevel === "높음") {
    scores.recovery += 20
    scores.muscle += 15
    reasons.recovery.push({ source: `신체활용 강도 높음`, points: 20 })
    reasons.muscle.push({ source: `신체활용 강도 높음`, points: 15 })
  }

  // 질문 8: 운동 빈도 → 회복, 활력
  const exerciseFreq = answers[8]?.[0]
  if (exerciseFreq === "안함") {
    scores.vitality += 30
    reasons.vitality.push({ source: `운동 빈도 ${exerciseFreq}`, points: 30 })
  } else if (exerciseFreq === "주1~2회") {
    scores.recovery += 20
    reasons.recovery.push({ source: `운동 빈도 ${exerciseFreq}`, points: 20 })
  } else if (exerciseFreq === "주3~4회" || exerciseFreq === "주5회 이상") {
    scores.recovery += 30
    reasons.recovery.push({ source: `운동 빈도 ${exerciseFreq}`, points: 30 })
  }

  // 질문 9: 건강 목표 (다중선택)
  const goals = answers[9] || []
  if (goals.includes("눈건강")) {
    scores.eye += 30
    reasons.eye.push({ source: "건강 목표: 눈건강", points: 30 })
  }
  if (goals.includes("운동회복")) {
    scores.recovery += 30
    reasons.recovery.push({ source: "건강 목표: 운동회복", points: 30 })
  }
  if (goals.includes("근육증가")) {
    scores.muscle += 30
    reasons.muscle.push({ source: "건강 목표: 근육증가", points: 30 })
  }
  if (goals.includes("면역관리")) {
    scores.immunity += 30
    reasons.immunity.push({ source: "건강 목표: 면역관리", points: 30 })
  }
  if (goals.includes("장건강")) {
    scores.digestion += 30
    reasons.digestion.push({ source: "건강 목표: 장건강", points: 30 })
  }
  if (goals.includes("혈행건강")) {
    scores.circulation += 30
    reasons.circulation.push({ source: "건강 목표: 혈행건강", points: 30 })
  }
  if (goals.includes("관절관리")) {
    scores.joints += 30
    reasons.joints.push({ source: "건강 목표: 관절관리", points: 30 })
  }
  if (goals.includes("활력관리")) {
    scores.vitality += 30
    reasons.vitality.push({ source: "건강 목표: 활력관리", points: 30 })
  }

  // 질문 10: 현재 고민 (다중선택)
  const concerns = answers[10] || []
  if (concerns.includes("눈피로")) {
    scores.eye += 25
    reasons.eye.push({ source: "현재 고민: 눈피로", points: 25 })
  }
  if (concerns.includes("만성피로")) {
    scores.fatigue += 25
    reasons.fatigue.push({ source: "현재 고민: 만성피로", points: 25 })
  }
  if (concerns.includes("수면부족")) {
    scores.fatigue += 25
    reasons.fatigue.push({ source: "현재 고민: 수면부족", points: 25 })
  }
  if (concerns.includes("자고 일어나도 피곤함")) {
    scores.fatigue += 25
    reasons.fatigue.push({ source: "현재 고민: 자고 일어나도 피곤함", points: 25 })
  }
  if (concerns.includes("근육회복 느림")) {
    scores.recovery += 25
    reasons.recovery.push({ source: "현재 고민: 근육회복 느림", points: 25 })
  }
  if (concerns.includes("관절불편")) {
    scores.joints += 25
    reasons.joints.push({ source: "현재 고민: 관절불편", points: 25 })
  }
  if (concerns.includes("장트러블")) {
    scores.digestion += 25
    reasons.digestion.push({ source: "현재 고민: 장트러블", points: 25 })
  }

  // 질문 11: 식습관 → 다양한 카테고리
  const diet = answers[11]?.[0]
  if (diet === "불규칙함") {
    scores.immunity += 20
    scores.digestion += 20
    reasons.immunity.push({ source: "식습관: 불규칙함", points: 20 })
    reasons.digestion.push({ source: "식습관: 불규칙함", points: 20 })
  }

  // 질문 12: 수면 상태 → 피로
  const sleep = answers[12]?.[0]
  if (sleep === "부족함" || sleep === "매우부족함") {
    scores.fatigue += 30
    reasons.fatigue.push({ source: `수면 상태 ${sleep}`, points: 30 })
  }

  // TOP 3 카테고리 선택
  const sortedCategories = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key, score]) => ({
      key,
      label: CATEGORY_SCORES[key],
      score,
      nutrients: NUTRIENT_MAPPING[key] || [],
      reasons: reasons[key],
    }))

  return {
    categories: sortedCategories,
    allScores: scores,
    reasons,
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
