const calculateIndividualPersonalityScore = async (userId, fetchData) => {
    const quizResponses = await fetchData(`quiz/responses/${userId}`, "GET");
    const personalityTraitScores = new Map();
    for (const response of quizResponses){
        if (!personalityTraitScores.has(response.question_trait)){
            personalityTraitScores.set(response.question_trait, new Array());
        }
        const personalityTrait = personalityTraitScores.get(response.question_trait);
        personalityTrait.push(response.response);
    }
    for (const [trait, scores] of personalityTraitScores.entries()){
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        personalityTraitScores.set(trait, averageScore);
    }
    return personalityTraitScores;
}

const calculatePairPersonalityScore = async (firstUserId, secondUserId, fetchData) => {
    const firstUserScores = await calculateIndividualPersonalityScore(firstUserId, fetchData);
    const secondUserScores = await calculateIndividualPersonalityScore(secondUserId, fetchData);
    const firstUserArray = Array.from(firstUserScores.values());
    const secondUserArray = Array.from(secondUserScores.values());
    let difference = 0;
    const MAX_TRAIT_DIFFERENCE = 5 * 4;
    for (let i = 0; i < firstUserArray.length; i++){
        difference += Math.abs(firstUserArray[i] - secondUserArray[i]);
    }
    return 1 - (difference / MAX_TRAIT_DIFFERENCE);
}

const CompatibilityScore = async (fetchData, user) => {
    const personalityScore = await calculatePairPersonalityScore(72, 73, fetchData);
}

export default CompatibilityScore;