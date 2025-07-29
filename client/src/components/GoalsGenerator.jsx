import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../utils/apiConfig";
import { goalsGeneratorPrompt } from "../utils/apiConfig";

// Generates 5 study goals using class name, resources inputted by the current user, and previous study goals generated for the group (if any)
const GoalsGenerator = async (className, userResource, previousGoals) => {
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: goalsGeneratorPrompt(className, userResource, previousGoals),
    });
    return response.text;
}

export default GoalsGenerator;