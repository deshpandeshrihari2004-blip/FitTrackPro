import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export function calculateFitnessLevelAndGoals(age: number, weight: number, goal: string, height: number = 170, bodyFat?: number | null) {
  let fitnessLevel = 'Beginner';
  let dailyCalories = 2000;

  if (age < 30 && weight < 70) {
    fitnessLevel = 'Intermediate';
  } else if (age >= 30 && age < 50 && weight < 80) {
    fitnessLevel = 'Intermediate';
  } else if (weight > 100) {
    fitnessLevel = 'Beginner'; 
  } else {
    fitnessLevel = 'Beginner'; 
  }

  let baseBmr;
  if (bodyFat) {
    const leanBodyMass = weight * (1 - (bodyFat / 100));
    baseBmr = 370 + (21.6 * leanBodyMass);
  } else {
    baseBmr = 10 * weight + 6.25 * height - 5 * age + 5; 
  }
  
  if (goal === 'Weight Loss') {
    dailyCalories = Math.round(baseBmr * 1.2 - 500);
  } else if (goal === 'Muscle Gain') {
    dailyCalories = Math.round(baseBmr * 1.5 + 300);
  } else {
    dailyCalories = Math.round(baseBmr * 1.3);
  }

  return { fitnessLevel, dailyCalories };
}

// -------------------------------------------------------------
// Core Generative AI System
// -------------------------------------------------------------

function getAI() {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export async function generateAINutritionPlan(profile: any) {
  const genAI = getAI();
  if (!genAI) {
    // Graceful fallback to static if API key not present
    return null; 
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          macros: {
            type: SchemaType.OBJECT,
            properties: {
              protein: { type: SchemaType.STRING },
              carbs: { type: SchemaType.STRING },
              fats: { type: SchemaType.STRING }
            },
            required: ['protein', 'carbs', 'fats']
          },
          meals: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING },
                recipe: { type: SchemaType.STRING },
                approx: { type: SchemaType.NUMBER }
              },
              required: ['name', 'recipe', 'approx']
            }
          },
          toEat: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          toAvoid: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
        },
        required: ['macros', 'meals', 'toEat', 'toAvoid']
      }
    }
  });

  const prompt = `Act as an expert clinical dietitian. Generate a precise daily diet plan for someone with the following metrics:
  Calories: ${profile.dailyCalories} kcal
  Goal: ${profile.goal}
  Diet Type Required: ${profile.dietType || "Standard"}
  Weight: ${profile.weight}kg
  Gender: ${profile.gender || "Unspecified"}
  
  Provide exact macros that sum nicely to the calorie goal. Provide 4 meals (Breakfast, Lunch, Dinner, Snack) with distinct recipes suited to the diet type. Output valid JSON adhering perfectly to the schema.`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function generateAIWorkoutPlan(profile: any, type: string) {
  const genAI = getAI();
  if (!genAI) return null;

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          frequency: { type: SchemaType.STRING },
          exercises: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING },
                duration: { type: SchemaType.STRING },
                sets: { type: SchemaType.STRING },
                reps: { type: SchemaType.STRING },
                restDuration: { type: SchemaType.STRING },
                videoUrls: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING }
                },
                instructions: { type: SchemaType.STRING }
              },
              required: ['name', 'duration', 'sets', 'reps', 'restDuration', 'videoUrls', 'instructions']
            }
          }
        },
        required: ['frequency', 'exercises']
      }
    }
  });

  const prompt = `Act as an elite strength and conditioning coach. Generate a masterlevel ${type} routine for someone with:
  Goal: ${profile.goal}
  Fitness Level: ${profile.fitnessLevel}
  
  Provide 3-4 advanced exercises. The videoUrls MUST be an array of 2 valid Youtube Embed Links (e.g., https://www.youtube.com/embed/XXXXX) that are generally associated with tutorials for the exercise. Ensure restDuration is precise (e.g., "90s"). Output valid JSON adhering perfectly to the schema.`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function getNutritionSuggestion(query: string, dietType: string) {
  const genAI = getAI();
  
  if (!genAI) {
    // Hardcoded fallback rules
    const q = query.toLowerCase();
    if (q.includes('snack')) return `Looking for a snack on your ${dietType} diet? Try an apple with a small portion of almond butter.`;
    return `Keep following your ${dietType} principles! Focus on whole foods, stay hydrated, and try not to overthink it.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `You are a world-class nutritionist. The user is on a ${dietType} diet. They asked you: "${query}". Provide a highly specific, scientific but easy-to-understand response in 2-3 sentences.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.warn("Gemini API call failed. Falling back to static suggestions.", error);
    const q = query.toLowerCase();
    if (q.includes('snack')) return `Looking for a snack on your ${dietType} diet? Try an apple with a small portion of almond butter.`;
    return `Keep following your ${dietType} principles! Focus on whole foods, stay hydrated, and try not to overthink it.`;
  }
}
