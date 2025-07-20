import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../utils/apiConfig";

// Generates 5 study goals using class name, resources inputted by the current user, and previous study goals generated for the group (if any)
const GoalsGenerator = async (className, userResource, previousGoals) => {
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `A study group of college students meets every week to study for the ${className} university course. 
        Generate five main study goals for this study group to focus on during their meetings that highlight the most important topics and themes that must be covered for this class.
        Use this resource to help compile the five main study goals for the class: ${userResource}. Number the goals in a list from 1 to 5 and have each goal be short and concise, only 1 sentence per goal.
        If ${previousGoals} is not null, use these study goals, as well the new resource, to generate the new five main study goals.`,
    });
    return (
        response.text
    )
}

export default GoalsGenerator;