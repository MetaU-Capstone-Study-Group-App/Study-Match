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

const calculateLocationDistance = (firstUserCoordinates, secondUserCoordinates) => {
    const PI_VALUE = Math.PI;
    const DEGREES_IN_PI_RADIANS = 180;
    const RADIUS_OF_EARTH_IN_MILES = 3959;
    const latitudeDistance = (secondUserCoordinates.latitude - firstUserCoordinates.latitude) * PI_VALUE / DEGREES_IN_PI_RADIANS;
    const longitudeDistance = (secondUserCoordinates.longitude - firstUserCoordinates.longitude) * PI_VALUE / DEGREES_IN_PI_RADIANS;
    const firstLatitudeInRadians = firstUserCoordinates.latitude * PI_VALUE / DEGREES_IN_PI_RADIANS;
    const secondLatitudeInRadians = secondUserCoordinates.latitude * PI_VALUE / DEGREES_IN_PI_RADIANS;
    const a = Math.pow(Math.sin(latitudeDistance / 2), 2) + Math.pow(Math.sin(longitudeDistance / 2), 2) * Math.cos(firstLatitudeInRadians) * Math.cos(secondLatitudeInRadians);
    const centralAngle = 2 * Math.asin(Math.sqrt(a));
    return centralAngle * RADIUS_OF_EARTH_IN_MILES;
}

const calculateLocationScore = (distanceBetweenLocations) => {
    const MAX_DISTANCE_IN_MILES = 75;
    return 1 - (distanceBetweenLocations / MAX_DISTANCE_IN_MILES);
}

export default CompatibilityScore;