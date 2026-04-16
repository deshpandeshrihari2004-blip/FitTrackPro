import * as brain from 'brain.js';
const net = new brain.NeuralNetwork({ hiddenLayers: [4] });
const trainingData = [
  { input: { age: 25/100, bmi: 28/40, activity: 0, goal: 0 }, output: { beginner_loss: 1 } },
  { input: { age: 40/100, bmi: 32/40, activity: 0, goal: 0 }, output: { beginner_loss: 1 } },
  { input: { age: 30/100, bmi: 22/40, activity: 0.5, goal: 1 }, output: { intermediate_gain: 1 } },
  { input: { age: 20/100, bmi: 19/40, activity: 1.0, goal: 1 }, output: { advanced_gain: 1 } },
  { input: { age: 50/100, bmi: 25/40, activity: 0.5, goal: 0.5 }, output: { intermediate_maintain: 1 } },
  { input: { age: 22/100, bmi: 24/40, activity: 1.0, goal: 0.5 }, output: { advanced_maintain: 1 } },
  { input: { age: 35/100, bmi: 26/40, activity: 0, goal: 1 }, output: { beginner_gain: 1 } },
];

net.train(trainingData, {
  iterations: 2000,
  errorThresh: 0.011,
  log: false
});

/**
 * Get an AI-driven personalized recommendation.
 * @param {Object} userData - Extract from the user DB profile
 * @returns {Object} Suggestion object with workout and diet focus
 */
export const getAIRecommendation = (profile) => {
  if (!profile) return null;
  
  // Handle both Legacy (healthData wrapper) and Prisma (direct fields)
  const age = profile.healthData?.age || profile.age;
  const weight = profile.healthData?.weight || profile.weight;
  const height = profile.healthData?.height || profile.height || 175; // fallback height
  const activityLevel = profile.healthData?.activityLevel || profile.fitnessLevel || 'beginner';
  const goal = profile.healthData?.goal || profile.goal || 'maintenance';

  // Calculate BMI if not provided
  let bmi = profile.healthData?.bmi || profile.bmi;
  if (!bmi && weight && height) {
    bmi = weight / ((height / 100) ** 2);
  }
  bmi = bmi || 22; // default fallback
  
  const activityMap = { beginner: 0, intermediate: 0.5, advanced: 1.0 };
  const goalMap = { 'Weight Loss': 0, 'Maintenance': 0.5, 'Muscle Gain': 1.0, 'maintenance': 0.5, 'weightLoss': 0, 'muscleGain': 1.0 };

  const input = {
    age: Math.min(parseInt(age) / 100, 1),
    bmi: Math.min(parseFloat(bmi) / 40, 1),
    activity: activityMap[activityLevel.toLowerCase()] || 0,
    goal: goalMap[goal] || 0.5
  };

  // Run the neural network
  const result = net.run(input);
  
  // Find highest probability classification
  let highestClass = '';
  let highestProb = 0;
  for (const [key, prob] of Object.entries(result)) {
    if (prob > highestProb) {
      highestProb = prob;
      highestClass = key;
    }
  }

  // Map the classification back to human-readable suggestions
  const suggestions = {
    beginner_loss: {
      workout: "Start with light cardio and bodyweight exercises (3 days a week). Focus on consistency rather than intensity.",
      diet: "Caloric deficit of 300-500 calories. Prioritize high volume, low-calorie dense veg/non-veg foods.",
      protein: "At least 1.2g per kg of bodyweight.",
      vitamins: "Consider a generic multivitamin and Omega-3."
    },
    intermediate_gain: {
      workout: "Hypertrophy-focused split (Push/Pull/Legs) 4 days a week. Progressive overload is key.",
      diet: "Caloric surplus of 200-300 calories. High carb and high protein intake required.",
      protein: "1.8g to 2.2g per kg of bodyweight.",
      vitamins: "Multivitamin, Vitamin D, and potentially Creatine."
    },
    advanced_gain: {
      workout: "Advanced periodized training (5-6 days a week). Incorporate heavy compound lifts and isolation.",
      diet: "Strict macronutrient tracking with a clean caloric surplus.",
      protein: "2.2g+ per kg of bodyweight.",
      vitamins: "Multivitamin, Omega-3, Magnesium, Zinc."
    },
    intermediate_maintain: {
      workout: "Balanced functional training or Full Body 3 days a week to maintain muscle and joint health.",
      diet: "Maintenance calories. Balanced macros.",
      protein: "1.5g per kg of bodyweight.",
      vitamins: "Daily multivitamin."
    },
    advanced_maintain: {
      workout: "High-intensity functional training or sport-specific conditioning.",
      diet: "Maintenance calories matched to daily high energy expenditure.",
      protein: "1.8g per kg of bodyweight.",
      vitamins: "Complete mineral and multivitamin stack."
    },
    beginner_gain: {
      workout: "Learn the basic compound movements (squat, bench, deadlift) with light weights. 3 days a week.",
      diet: "Slight caloric surplus. Ensure enough energy to build muscle.",
      protein: "1.6g per kg of bodyweight.",
      vitamins: "Standard multivitamin."
    }
  };

  return suggestions[highestClass] || suggestions['intermediate_maintain'];
};