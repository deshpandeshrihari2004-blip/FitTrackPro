import { generateAIWorkoutPlan, generateAINutritionPlan } from './ml';

export async function generateWorkoutPlan(profile: any, type: string = 'Gym') {
  // Attempt AI Generation
  try {
    const aiPlan = await generateAIWorkoutPlan(profile, type);
    if (aiPlan) return aiPlan;
  } catch (e) {
    console.error("AI Workout Failed, using static fallback", e);
  }

  // Static Fallback
  const days = profile.goal === 'Muscle Gain' ? 5 : 3;
  let baseExercises: any[] = [];
  if (type === 'Home Workout') {
    baseExercises = [
      { name: 'Push-ups', duration: '10 mins', sets: '4', reps: '15-20', restDuration: '60s', videoUrls: ['https://www.youtube.com/embed/IODxDxX7oi4', 'https://www.youtube.com/embed/tWjBnQwJCA', 'https://www.youtube.com/embed/WcjhGffCBEs'], instructions: 'Lower body until chest touches floor.' },
      { name: 'Bodyweight Squats', duration: '15 mins', sets: '4', reps: '20', restDuration: '60s', videoUrls: ['https://www.youtube.com/embed/gbJIINJndPc', 'https://www.youtube.com/embed/mGvzVjuY8N0', 'https://www.youtube.com/embed/YaXPRqUwItQ'], instructions: 'Keep back straight, descend deep.' },
      { name: 'Plank', duration: '5 mins', sets: '3', reps: '60s hold', restDuration: '45s', videoUrls: ['https://www.youtube.com/embed/pSHjTRCQxIw', 'https://www.youtube.com/embed/B296mZDhrP4', 'https://www.youtube.com/embed/ASdvN_XEl_c'], instructions: 'Maintain straight line.' }
    ];
  } else if (type === 'Cardio Only') {
    baseExercises = [
      { name: 'Treadmill Sprint Intervals', duration: '20 mins', sets: '1', reps: '10 intervals', restDuration: '30s (walk)', videoUrls: ['https://www.youtube.com/embed/2OWvA4z4vWc', 'https://www.youtube.com/embed/ml6cT4AZdqI', 'https://www.youtube.com/embed/AOMU7b0U0iM'], instructions: 'Sprint 30s, walk 30s.' },
      { name: 'Jump Rope', duration: '10 mins', sets: '3', reps: '3 mins', restDuration: '60s', videoUrls: ['https://www.youtube.com/embed/FJmRQ5iTXCE', 'https://www.youtube.com/embed/u3zgHI8QnqE', 'https://www.youtube.com/embed/1BZDJsG50kI'], instructions: 'Continuous light jumps.' },
    ];
  } else if (type === 'Calisthenics') {
    baseExercises = [
      { name: 'Pull-ups', duration: '15 mins', sets: '4', reps: '8-12', restDuration: '90s', videoUrls: ['https://www.youtube.com/embed/eGo4IYPNBG4', 'https://www.youtube.com/embed/vw5Xmu5A2H4', 'https://www.youtube.com/embed/aAggnpPyR6E'], instructions: 'Strict form pull-ups.' },
      { name: 'Dips', duration: '10 mins', sets: '4', reps: '10-15', restDuration: '90s', videoUrls: ['https://www.youtube.com/embed/2z8JmcrW-As', 'https://www.youtube.com/embed/wjUmnZH5T8', 'https://www.youtube.com/embed/0326dy_-CzM'], instructions: 'Lean forward slightly for chest emphasis.' },
      { name: 'Pistol Squats', duration: '10 mins', sets: '3', reps: '5 per leg', restDuration: '120s', videoUrls: ['https://www.youtube.com/embed/vqjzqdQIoOU', 'https://www.youtube.com/embed/PZilDqEq6T0', 'https://www.youtube.com/embed/vj2nQjJ7Ufs'], instructions: 'Single leg balance squat.' }
    ];
  } else {
    // Default Gym
    baseExercises = [
      { name: 'Barbell Bench Press', duration: '15 mins', sets: '4', reps: '8-10', restDuration: '120s', videoUrls: ['https://www.youtube.com/embed/rxD321l2svE', 'https://www.youtube.com/embed/rT7DgCr-3pg', 'https://www.youtube.com/embed/vthMCtgVtFw'], instructions: 'Control eccentric, press powerfully.' },
      { name: 'Barbell Squat', duration: '20 mins', sets: '4', reps: '6-8', restDuration: '180s', videoUrls: ['https://www.youtube.com/embed/bEv6CCg2BC8', 'https://www.youtube.com/embed/gcNh17Ckjgg', 'https://www.youtube.com/embed/YaXPRqUwItQ'], instructions: 'Break parallel, keep chest up.' },
      { name: 'Cable Rows', duration: '15 mins', sets: '3', reps: '10-12', restDuration: '90s', videoUrls: ['https://www.youtube.com/embed/GZbfZ033f74', 'https://www.youtube.com/embed/UCXxvVItLoM', 'https://www.youtube.com/embed/sP_4vybjVJs'], instructions: 'Squeeze shoulder blades together.' }
    ];
  }
  return { frequency: `${days} days/week`, exercises: baseExercises };
}

export async function generateNutritionPlan(profile: any) {
  // Attempt AI Generation
  try {
    const aiPlan = await generateAINutritionPlan(profile);
    if (aiPlan) return aiPlan;
  } catch(e) {
    console.error("AI Nutrition Failed, using static fallback", e);
  }

  // Static Fallback
  const dietType = profile.dietType;
  const calories = profile.dailyCalories;
  const goal = profile.goal;

  let toEat: string[] = [];
  let toAvoid: string[] = ['Refined Sugars', 'Processed Junk Food', 'Excessive Seed Oils'];
  let pPct = 0.30, cPct = 0.45, fPct = 0.25;
  if (goal === 'Weight Loss') { pPct = 0.40; cPct = 0.35; fPct = 0.25; }
  else if (goal === 'Muscle Gain') { pPct = 0.35; cPct = 0.45; fPct = 0.20; }

  const proteinGrams = Math.round((calories * pPct) / 4);
  const carbGrams = Math.round((calories * cPct) / 4);
  const fatGrams = Math.round((calories * fPct) / 9);
  const macros = { protein: `${proteinGrams}g`, carbs: `${carbGrams}g`, fats: `${fatGrams}g` };

  const genericVeg = ['Lentils', 'Chickpeas', 'Tofu', 'Spinach', 'Greek Yogurt', 'Whey Protein', 'Almonds', 'Quinoa'];
  const genericMeat = ['Chicken Breast', 'Turkey', 'Salmon', 'Tuna'];
  const genericEggs = ['Whole Eggs', 'Egg Whites'];

  let meals: { name: string, recipe: string, approx: number }[] = [];

  if (dietType === 'Veg') {
    toEat = [...genericVeg, 'Paneer', 'Oats'];
    toAvoid.push('All Meat', 'Eggs');
    meals = [
      { name: 'Breakfast', recipe: 'Protein Oats with Almonds & Banana', approx: Math.round(calories * 0.25) },
      { name: 'Lunch', recipe: 'Paneer Tikka with Quinoa and Spinach', approx: Math.round(calories * 0.35) },
      { name: 'Dinner', recipe: 'Lentil Curry (Dal) with Sweet Potato', approx: Math.round(calories * 0.30) },
      { name: 'Snack', recipe: 'Greek Yogurt with Berries and Whey', approx: Math.round(calories * 0.10) },
    ];
  } else if (dietType === 'Eggetarian') {
    toEat = [...genericVeg, ...genericEggs, 'Oats'];
    toAvoid.push('All Meat');
    meals = [
      { name: 'Breakfast', recipe: '3 Whole Eggs Scramble with Spinach & Oats', approx: Math.round(calories * 0.25) },
      { name: 'Lunch', recipe: 'Chickpea Salad with Boiled Egg Whites', approx: Math.round(calories * 0.35) },
      { name: 'Dinner', recipe: 'Tofu Stir-fry with Brown Rice', approx: Math.round(calories * 0.30) },
      { name: 'Snack', recipe: 'Greek Yogurt with Whey Protein', approx: Math.round(calories * 0.10) },
    ];
  } else if (dietType === 'Non Veg + Veg') {
    toEat = [...genericMeat, ...genericEggs, ...genericVeg, 'Paneer'];
    toAvoid.push('Heavy Processed Meats');
    meals = [
      { name: 'Breakfast', recipe: 'Protein Oats / Scrambled Eggs (Alternate)', approx: Math.round(calories * 0.25) },
      { name: 'Lunch', recipe: 'Paneer Wrap OR Chicken Breast with Quinoa', approx: Math.round(calories * 0.35) },
      { name: 'Dinner', recipe: 'Baked Salmon OR Tofu Stir-fry', approx: Math.round(calories * 0.30) },
      { name: 'Snack', recipe: 'Greek Yogurt & Mixed Nuts', approx: Math.round(calories * 0.10) },
    ];
  } else {
    toEat = [...genericMeat, ...genericEggs, 'Oats', 'Rice'];
    toAvoid.push('Excessive Red Meat'); 
    meals = [
      { name: 'Breakfast', recipe: 'Scrambled Eggs with Turkey Sausage', approx: Math.round(calories * 0.25) },
      { name: 'Lunch', recipe: 'Grilled Chicken Breast with Brown Rice', approx: Math.round(calories * 0.35) },
      { name: 'Dinner', recipe: 'Baked Salmon with Sweet Potato', approx: Math.round(calories * 0.30) },
      { name: 'Snack', recipe: 'Whey Protein Shake', approx: Math.round(calories * 0.10) },
    ];
  }

  return { macros, toEat, toAvoid, meals };
}
