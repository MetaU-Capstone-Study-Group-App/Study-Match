// Personalized weights for each individual metric used to calculate the overall compatibility score
const ScoreWeights = async (fetchData, userId) => {
    const personalizedWeights = await fetchData(`user/weights/${userId}`, "GET");

    return (
        {
            personalityScore: personalizedWeights.personality_weight,
            locationScore: personalizedWeights.location_weight,
            goalsScore: personalizedWeights.goals_weight,
            schoolScore: personalizedWeights.school_weight,
            classStandingScore: personalizedWeights.class_standing_weight,
        }
    )
}

export default ScoreWeights;