export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const guardrailPromptContent = (generatedResponse) => {
    return (
        `You are a guardrail bot and have been given this response: ${generatedResponse}. 
        Check for the following issues, and if any issues are found, fix the issues and rewrite the response.
        Is the response in a list format with 5 different study goals? Does the response not contain any harmful biases or derogatory information?
        Is the tone safe and appropriate for college students? Is the result factually correct? Do all five study goals relate to the same class?
        Does a college student have the right to access and know all of the information in the response? 
        If the answer to any of these questions is no, rewrite the response in the same format while fixing the issues. 
        If the response to all of these questions is yes, output only the word "yes" without the response.`
    )
}

export const goalsGeneratorPrompt = (className, userResource, previousGoals) => {
    return (
        `A study group of college students meets every week to study for the ${className} university course. 
        Generate five main study goals for this study group to focus on during their meetings that highlight the most important topics and themes that must be covered for this class.
        Use this resource to help compile the five main study goals for the class: ${userResource}. Number the goals in a list from 1 to 5 and have each goal be short and concise, only 1 sentence per goal.
        If ${previousGoals} is not null, use these study goals, as well the new resource, to generate the new five main study goals.
        Make sure no words are in bold in the response.`
    )
}