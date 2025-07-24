import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../utils/apiConfig";

const GenAIGuardrail = async (generatedResponse) => {
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
    let checkCount = 0;
    let finalResponse;
    while (checkCount <= 3){
        const checkedResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a guardrail bot and have been given this response: ${generatedResponse}. 
            Check for the following issues, and if any issues are found, fix the issues and rewrite the response.
            Is the response in a list format with 5 different study goals? Does the response not contain any harmful biases or derogatory information?
            Is the tone safe and appropriate for college students? Is the result factually correct? Do all five study goals relate to the same class?
            Does a college student have the right to access and know all of the information in the response? 
            If the answer to any of these questions is no, rewrite the response in the same format while fixing the issues. 
            If the response to all of these questions is yes, output only the word "yes" without the response.`,
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
    return (
        finalResponse
    )
}

export default GenAIGuardrail;