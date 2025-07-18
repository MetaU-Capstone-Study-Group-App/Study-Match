import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../utils/apiConfig";

const GoalsGenerator = async ({className}) => {
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `A study group of college students meets every week to study for the ${className} university course. 
        Generate five main study goals for this study group to focus on during their meetings that highlight the most important topics and themes that must be covered for this class.`,
    });
    return (
        response.text
    )
}

export default GoalsGenerator;