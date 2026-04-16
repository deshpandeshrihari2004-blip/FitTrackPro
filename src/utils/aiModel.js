/**
 * Pure-JS Classification Engine (No native dependencies)
 * Replaces brain.js for 100% stability on Vercel/Serverless.
 */
const predictClassification = (input) => {
  const { age, bmi, activity, goal } = input;

  // Rule-based classification approximating the neural network logic
  if (activity <= 0.2) {
    if (goal <= 0.3) return 'beginner_loss';
    if (goal >= 0.7) return 'beginner_gain';
    return 'intermediate_maintain';
  }
  
  if (activity <= 0.6) {
    if (goal >= 0.7) return 'intermediate_gain';
    return 'intermediate_maintain';
  }

  if (activity > 0.6) {
    if (goal >= 0.7) return 'advanced_gain';
    return 'advanced_maintain';
  }

  return 'intermediate_maintain'; // Default fallback
};

/**
 * Get an AI-driven personalized recommendation.
 * @param {Object} profile - Extract from the user DB profile
 * @returns {Object} Suggestion object with workout and diet focus
 */
export const getAIRecommendation = (profile) => {
  if (!profile) return null;
  
  const age = profile.healthData?.age || profile.age;
  const weight = profile.healthData?.weight || profile.weight;
  const height = profile.healthData?.height || profile.height || 175;
  const activityLevel = profile.healthData?.activityLevel || profile.fitnessLevel || 'beginner';
  const goalValue = profile.healthData?.goal || profile.goal || 'maintenance';

  let bmi = profile.healthData?.bmi || profile.bmi;
  if (!bmi && weight && height) {
    bmi = weight / ((height / 100) ** 2);
  }
  bmi = bmi || 22;
  
  const activityMap = { beginner: 0, intermediate: 0.5, advanced: 1.0 };
  const goalMap = { 
    'Weight Loss': 0, 'Maintenance': 0.5, 'Muscle Gain': 1.0, 
    'weightLoss': 0, 'maintenance': 0.5, 'muscleGain': 1.0 
  };

  const input = {
    age: (parseInt(age) || 25) / 100,
    bmi: (parseFloat(bmi) || 22) / 40,
    activity: activityMap[activityLevel.toLowerCase()] || 0,
    goal: goalMap[goalValue] || 0.5
  };

  // Use the new stable predictor
  const highestClass = predictClassification(input);
  
  const suggestions = {
    beginner_loss: {
      workout: "Low-impact cardio (walking/cycling) for 30 mins, 3x per week. Focus on steady-state activity.",
      diet: "Focus on whole, single-ingredient foods. Aim for a 300kcal deficit.",
      protein: "1.2g per kg of bodyweight.",
      vitamins: "Multivitamin & Omega-3."
    },
    intermediate_gain: {
      workout: "4-day hypertrophy split (Upper/Lower). Focus on progressive overload on compound lifts.",
      diet: "Slight caloric surplus (250kcal). High complex carbohydrates for training energy.",
      protein: "1.8g to 2.0g per kg of bodyweight.",
      vitamins: "Creatine Monohydrate (5g daily) & Vitamin D."
    },
    advanced_gain: {
      workout: "5-6 day periodized PPL (Push/Pull/Legs) split. Include high volume and intensity techniques.",
      diet: "Calculated mass gain surplus. Strict macro tracking focusing on clean sources.",
      protein: "2.2g per kg of bodyweight.",
      vitamins: "Complete micronutrient stack including ZMA for recovery."
    },
    intermediate_maintain: {
      workout: "Functional hypertrophy or GPP (General Physical Preparedness) twice weekly.",
      diet: "Maintenance calories. Priority on nutrient timing around workouts.",
      protein: "1.5g per kg of bodyweight.",
      vitamins: "Vitamin D3 + K2."
    },
    advanced_maintain: {
      workout: "Activity-specific conditioning combined with maintenance-level strength training.",
      diet: "Performance-focused fueling. High-quality fats for hormonal health.",
      protein: "1.8g per kg of bodyweight.",
      vitamins: "Omega-3, Magnesium, and B-Complex."
    },
    beginner_gain: {
      workout: "Basic linear progression routine (e.g., 5x5) focusing on form and foundational strength.",
      diet: "Moderate caloric surplus. Focus on protein and complex carbs.",
      protein: "1.6g per kg of bodyweight.",
      vitamins: "Basic multivitamin."
    }
  };

  return suggestions[highestClass] || suggestions['intermediate_maintain'];
};