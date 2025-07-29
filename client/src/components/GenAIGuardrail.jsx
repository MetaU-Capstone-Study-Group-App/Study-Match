import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../utils/apiConfig";
import { guardrailPromptContent } from "../utils/apiConfig";

const GenAIGuardrail = async (generatedResponse) => {
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
    const MAX_NUM_OF_ITERATIONS = 3;
    let checkCount = 0;
    let finalResponse;
    while (checkCount <= MAX_NUM_OF_ITERATIONS){
        const checkedResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: guardrailPromptContent(generatedResponse),
        });
        if (checkedResponse.text === "yes"){
            finalResponse = generatedResponse;
            break;
        }
        else {
            checkCount++;
            generatedResponse = checkedResponse.text;
        }
    }
    return finalResponse;
}

export default GenAIGuardrail;