const MINUTES_IN_HOUR = 60;
const DAYS_IN_WEEK = 7;

const sortBusyTimes = (busyTimes) => {
    const busyTimesPerDay = [];

    for (const busyTime of busyTimes){
        const day_of_week = busyTime.day_of_week;
        if (!busyTimesPerDay[day_of_week]){
            busyTimesPerDay[day_of_week] = [];
        }
        busyTimesPerDay[day_of_week].push(busyTime);
    }
    return busyTimesPerDay;
}

const getFreeTimes = (busyTimesPerDay, stringToTime) => {
    const STUDY_GROUPS_START = 0;
    const STUDY_GROUPS_END = 24 * 60;
    const freeTimes = [];
    let currentEndTime = STUDY_GROUPS_END;
    const mergedOverlapBusyTimes = [];

    const busyTimesPerDayInMins = busyTimesPerDay.map((busyTimes) => {
        return busyTimes.map((busyTime) => ({
            day_of_week: busyTime.day_of_week,
            start_time: stringToTime(busyTime.start_time),
            end_time: stringToTime(busyTime.end_time),
        })).sort((a,b) => b.start_time - a.start_time)
    })

    for (const day of busyTimesPerDayInMins){
        if(!day){
            continue;
        }
        mergedOverlapBusyTimes[day[0].day_of_week] = [];
        for (let i = 0; i < day.length; i++){
            if ((day[i+1]) && day[i].start_time < day[i+1].end_time){
                mergedOverlapBusyTimes[day[0].day_of_week].push({start_time: day[i+1].start_time , end_time: day[i].end_time, day_of_week: day[0].day_of_week});
                i++;
            }
            else {
                mergedOverlapBusyTimes[day[0].day_of_week].push({start_time: day[i].start_time, end_time: day[i].end_time, day_of_week: day[0].day_of_week})
            }
        }
    }

    for (const day of mergedOverlapBusyTimes){
        if(!day){
            continue;
        }
        freeTimes[day[0].day_of_week] = [];
        currentEndTime = STUDY_GROUPS_END;
        day.map((busyTime) => {
            if (busyTime.start_time < currentEndTime){
                if ((busyTime.end_time < STUDY_GROUPS_START) && (STUDY_GROUPS_START !== currentEndTime)){
                    freeTimes[day[0].day_of_week].push({start_time: STUDY_GROUPS_START, end_time: currentEndTime, day_of_week: day[0].day_of_week});
                }
                else {
                    if (!(busyTime.end_time >= STUDY_GROUPS_END) && (busyTime.end_time !== currentEndTime)){
                        freeTimes[day[0].day_of_week].push({start_time: busyTime.end_time, end_time: currentEndTime, day_of_week: day[0].day_of_week});
                    }
                }
                currentEndTime = busyTime.start_time;
            }
        })
        if ((currentEndTime > STUDY_GROUPS_START) && (STUDY_GROUPS_START !== currentEndTime)){
            freeTimes[day[0].day_of_week].push({start_time: STUDY_GROUPS_START, end_time: currentEndTime, day_of_week: day[0].day_of_week});
        }
    }

    for (let i = 1; i <= DAYS_IN_WEEK; i++){
        if (!freeTimes[i]){
            freeTimes[i] = [];
            freeTimes[i].push({start_time: STUDY_GROUPS_START, end_time: STUDY_GROUPS_END, day_of_week: i});
        }
    }
    return freeTimes;
}

const getOneHourFreeTimes = (day, dayOfWeek) => {
    const oneHourFreeTimes = [];
    for (const freeTime of day){
        let currentEnd = freeTime.end_time;
        while (currentEnd > freeTime.start_time){
            if (currentEnd - MINUTES_IN_HOUR >= freeTime.start_time){
                const currentStart = currentEnd - MINUTES_IN_HOUR;
                oneHourFreeTimes.push({day_of_week: dayOfWeek, start_time: currentStart, end_time: currentEnd});
                currentEnd = currentStart;
            }
            else {
                oneHourFreeTimes.push({dayOfWeek: dayOfWeek, start_time: freeTime.start_time, end_time: currentEnd});
                break;
            }
        }
    }
    return oneHourFreeTimes;
}

const splitPreferredTimes = (preferredTimes) => {
    const oneHourPreferredTimes = [];
    let currentEnd = preferredTimes.preferred_end_time;
    while (currentEnd > preferredTimes.preferred_start_time){
        if (currentEnd - MINUTES_IN_HOUR >= preferredTimes.preferred_start_time){
            const currentStart = currentEnd - MINUTES_IN_HOUR;
            oneHourPreferredTimes.push({start_time: currentStart, end_time: currentEnd});
            currentEnd = currentStart;
        }
        else {
            oneHourPreferredTimes.push({start_time: preferredTimes.preferred_start_time, end_time: currentEnd});
            break;
        }
    }
    return oneHourPreferredTimes;
}

const findSharedAvailability = async (usersInEachClass, fetchData, stringToTime) => {
    const sharedUserAvailability = new Map();
    const classIds = [];
    let classCount = 0;
    for (const classId in usersInEachClass){
        classIds.push(classId);
    }
    for (const c of usersInEachClass){
        if (!c){
            continue;
        }
        for (const user of c){
            if (!sharedUserAvailability.has(classIds[classCount])){
                sharedUserAvailability.set(classIds[classCount], new Map());
            }
            const availabilityForClass = sharedUserAvailability.get(classIds[classCount]);
            const userEvents = await fetchData(`availability/busyTime/${user}`, "GET", {"Content-Type": "application/json"});
            const busyTimesPerDay = sortBusyTimes(userEvents);
            const freeTimes = getFreeTimes(busyTimesPerDay, stringToTime);
            for (const day of freeTimes){
                let existingDayOfWeek;
                if (!day){
                    continue;
                }
                for (let i = 0; i < day.length; i++){
                    if (day[i].day_of_week){
                        existingDayOfWeek = day[i].day_of_week;
                        break;
                    }
                }
                const oneHourFreeTimes = getOneHourFreeTimes(day, existingDayOfWeek);
                for (let freeTime of oneHourFreeTimes){
                    freeTime = JSON.stringify(freeTime);
                    if (availabilityForClass.has(freeTime)){
                        const usersAtTimeArray = availabilityForClass.get(freeTime);
                        usersAtTimeArray.push(user);
                    }
                    else {
                        availabilityForClass.set(freeTime, [user]);
                    }
                }
            }
        }
        classCount++;
    }
    const finalSharedUserAvailability = new Map();
    for (const [outerMapKey, innerMap] of sharedUserAvailability){
        finalSharedUserAvailability.set(outerMapKey, new Map());
        const finalAvailabilityForClass = finalSharedUserAvailability.get(outerMapKey);
        for (const [innerMapKey, innerMapValue] of innerMap){
            const parsedKey = JSON.parse(innerMapKey);
            finalAvailabilityForClass.set(parsedKey, innerMapValue);
        }
    }
    return finalSharedUserAvailability;
}

const findGroupsByAvailability = async (fetchData, stringToTime, sharedUserAvailability) => {
    const existingGroups = await fetchData("group/existingGroup/", "GET");

    const filteredExistingGroups = existingGroups.map((group) => {
        return [group.id, group.class_id, {
            day_of_week: group.day_of_week,
            start_time: stringToTime(group.start_time),
            end_time: stringToTime(group.end_time)
        }]
    })

    for (const c of sharedUserAvailability){
        for (const groupsPerClass of c){
            for (const possibleGroup of groupsPerClass){
                for (const existingGroup of filteredExistingGroups){
                    if (c[0] == existingGroup[1]){
                        if (JSON.stringify(possibleGroup[0]) === JSON.stringify(existingGroup[2])){
                            existingGroup.users = possibleGroup[1];
                        }
                    }
                }
            }
        }
    }
    return filteredExistingGroups;
}

const filterByPreferredTime = async (groupsByAvailability, allUsers, fetchData, stringToTime) => {
    const filteredByTimeGroups = new Map();
    for (const user of allUsers){
        let userCount = 0;
        for (const group of groupsByAvailability){
            if (group["users"]){
                for (const usersInGroup of group["users"]){
                    if (user.id === usersInGroup){
                        userCount++;
                    }
                }
            }
        }
        if (userCount > 1){
            if (!filteredByTimeGroups.has(user.id)){
                filteredByTimeGroups.set(user.id, new Array());
            }
            const groupsForUser = filteredByTimeGroups.get(user.id);
            const preferredTimes = await fetchData(`user/preferredTimes/${user.id}`, "GET");
            const preferredTimesInMins = {
                preferred_start_time: stringToTime(preferredTimes.preferred_start_time),
                preferred_end_time: stringToTime(preferredTimes.preferred_end_time)
            }
            const splitTimes = splitPreferredTimes(preferredTimesInMins);
            for (const group of groupsByAvailability){
                for (const preferredTime of splitTimes){
                    if (JSON.stringify({start_time: group[2].start_time, end_time: group[2].end_time}) === JSON.stringify(preferredTime)){
                        if (group["users"]){
                            for (const userInList of group["users"]){
                                if (userInList === user.id){
                                    groupsForUser.push(group);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return filteredByTimeGroups;
}

const createUserExistingGroups = async (fetchData, filteredByTimeGroups) => {
    for (const group of filteredByTimeGroups){
        const user_id = group[0];
        for (const existingGroup of group[1]){
            const existing_group_id = existingGroup[0];
            const newGroupData = {
                user_id,
                existing_group_id
            }
            const newUserExistingGroup = await fetchData("group/userExistingGroup/", "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newGroupData));
        }
    }
}

const MatchByAvailability = async (fetchData, allUsers) => {
    const usersInEachClass = [];
    
    const stringToTime = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours * MINUTES_IN_HOUR + minutes;
    }

    const userClasses = await fetchData('availability/userClasses/', "GET", {"Content-Type": "application/json"});
    for (const userClass of userClasses){
        if (!usersInEachClass[userClass.class_id]){
            usersInEachClass[userClass.class_id] = [];
        }
        if (!usersInEachClass[userClass.class_id].includes(userClass.user_id)){
            usersInEachClass[userClass.class_id].push(userClass.user_id);
        }
    }
    const sharedUserAvailability = await findSharedAvailability(usersInEachClass, fetchData, stringToTime);
    const groupsByAvailability = await findGroupsByAvailability(fetchData, stringToTime, sharedUserAvailability);
    const filteredByTimeGroups = await filterByPreferredTime(groupsByAvailability, allUsers, fetchData, stringToTime);
    createUserExistingGroups(fetchData, filteredByTimeGroups)
}

export default MatchByAvailability;