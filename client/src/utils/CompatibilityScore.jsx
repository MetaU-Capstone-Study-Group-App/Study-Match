import SchoolStanding from "../data/SchoolStanding";

// Calculates average score for each Big Five Personality Trait using personality quiz results
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

// Calculates personality compatibility score between two users using mean absolute deviation (1 = perfectly compatible, 0 = not compatible)
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

// Calculates distance (in miles) between two addresses using their latitude and longitude coordinates and the Haversine formula
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

// Calculates location compatibility score between two users using the distance between their addresses and the max reasonable distance a user can travel (75 miles)
const calculateLocationScore = (distanceBetweenLocations) => {
    const MAX_DISTANCE_IN_MILES = 75;
    return 1 - (distanceBetweenLocations / MAX_DISTANCE_IN_MILES);
}

// Uses mean absolute deviation of two class standings to calculate class standing compatibility score
const calculateClassStandingScore = (firstSchoolInfo, secondSchoolInfo) => {
    const NUM_OF_CLASS_STANDINGS = 4;
    const standingDifference = Math.abs(SchoolStanding[secondSchoolInfo.class_standing] - SchoolStanding[firstSchoolInfo.class_standing]);
    return 1 - (standingDifference / NUM_OF_CLASS_STANDINGS);
}

// Returns 1 if users attend the same school and 0 otherwise
const calculateSchoolScore = (firstSchoolInfo, secondSchoolInfo) => {
    const firstUserSchool = firstSchoolInfo.school.toLowerCase().replace(/\s/g, '');
    const secondUserSchool = secondSchoolInfo.school.toLowerCase().replace(/\s/g, '');
    if (firstUserSchool === secondUserSchool){
        return 1;
    }
    else {
        return 0;
    }
}

// Divides the intersection of two sets of goals by their union to calculate goals compatibility score
const calculateGoalsScore = (firstUserGoals, secondUserGoals) => {
    const firstUserGoalIds = [];
    for (const goal of firstUserGoals){
        firstUserGoalIds.push(goal.goal_id)
    }
    const secondUserGoalIds = [];
    for (const goal of secondUserGoals){
        secondUserGoalIds.push(goal.goal_id)
    }
    const firstUserSet = new Set(firstUserGoalIds);
    const secondUserSet = new Set(secondUserGoalIds);
    const unionSet = firstUserSet.union(secondUserSet);
    const intersectionSet = firstUserSet.intersection(secondUserSet);
    return intersectionSet.size / unionSet.size;
}

const CompatibilityScore = async (fetchData, user) => {
    
}

export default CompatibilityScore;