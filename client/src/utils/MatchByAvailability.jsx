const MINUTES_IN_HOUR = 60;
const DAYS_IN_WEEK = 7;
const MAX_USERS_PER_GROUP = 4;

// Sorts times during which a user is busy by day
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

// Converts time in minutes to a string in military time (EX: 840 -> "14:00")
const minutesToTimeString = (mins) => {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(mins);
    date.setSeconds(0);
    const timeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    })
    return timeString;
}

// Calculates all time slots during which a user is free
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

// Splits free time slots into individual one hour time slots
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

// Splits a user's preferred time slot into individual one hour time slots
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

// Returns all one hour time slots where users are taking the same class and are all free during that time
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

// Divides users into groups of four
const splitUsers = (usersArray) => {
    const newUserGroups = [];
    for (let i = 0; i < usersArray?.length; i += MAX_USERS_PER_GROUP){
        newUserGroups.push(usersArray.slice(i, i + MAX_USERS_PER_GROUP));
    }
    return newUserGroups;
}

// Creates study groups where users are taking the same class, are all free during that specific time, and have a max of 4 users
const findGroupsByAvailability = async (fetchData, stringToTime, sharedUserAvailability) => {
    const existingGroups = await fetchData("group/existingGroup/", "GET");
    const filteredExistingGroupsMap = new Map();

    const filteredExistingGroups = existingGroups.map((group) => {
        const groupKey = `${group.class_id}-${group.day_of_week}-${stringToTime(group.start_time)}-${stringToTime(group.end_time)}`;
        if (!filteredExistingGroupsMap.has(groupKey)){
            filteredExistingGroupsMap.set(groupKey, []);
        }
        filteredExistingGroupsMap.get(groupKey).push(group);
    })

    for (const c of sharedUserAvailability){
        const classId = c[0];
        const classAvailabilityMap = c[1];
        for (const [timeSlot, usersArray] of classAvailabilityMap.entries()){
            const {day_of_week, start_time, end_time} = timeSlot;
            const groupKey = `${classId}-${day_of_week}-${start_time}-${end_time}`;
            const matchedExistingGroups = filteredExistingGroupsMap.get(groupKey);
            let usersRemaining = [...usersArray];
            if (matchedExistingGroups && usersArray.length !== 0){
                for (const group of matchedExistingGroups){
                    if (!group.users){
                        group.users = [];
                    }
                    const availableGroupSpace = MAX_USERS_PER_GROUP - group.users.length;
                    if (availableGroupSpace > 0){
                        const usersToAdd = usersRemaining.splice(0, availableGroupSpace);
                        group.users.push(usersToAdd);
                    }
                    if (usersRemaining.length === 0){
                        break;
                    }
                }
                if (usersRemaining.length > 0){
                    const groupsOfFour = splitUsers(usersRemaining);
                    for (const splitGroup of groupsOfFour){
                        const {day_of_week, start_time, end_time} = timeSlot;
                        const newGroupData = {
                            class_id: parseInt(classId),
                            day_of_week,
                            start_time: minutesToTimeString(start_time),
                            end_time: minutesToTimeString(end_time)
                        }
                        const newExistingGroup = await fetchData("group/existingGroup/", "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newGroupData));
                        if (!newExistingGroup.users){
                            newExistingGroup.users = [splitGroup];
                        }
                        existingGroups.push(newExistingGroup);
                        matchedExistingGroups.push(newExistingGroup);
                    }
                }
            }
        }
    }
    return filteredExistingGroupsMap;
}

// Filters possible study groups to only include those within a user's preferred time slot
// If there are no existing groups during a user's preferred time slot, the other possible study groups where the user is free will be displayed
const filterByPreferredTime = async (groupsByAvailability, allUsers, fetchData, stringToTime) => {
    const filteredByTimeGroups = new Map();
    for (const user of allUsers){
        let userCount = 0;
        for (const groups of groupsByAvailability){
            for (const group of groups[1]){
                if (group["users"]){
                    for (const users of group["users"]){
                        for (const usersInGroup of users){
                            if (user.id === usersInGroup){
                                userCount++;
                            }
                        }
                    }
                }
            }
        }
        if (!filteredByTimeGroups.has(user.id)){
            filteredByTimeGroups.set(user.id, new Array());
        }
        const groupsForUser = filteredByTimeGroups.get(user.id);
        if (userCount > 0){
            const preferredTimes = await fetchData(`user/preferredTimes/${user.id}`, "GET");
            const preferredTimesInMins = {
                preferred_start_time: stringToTime(preferredTimes.preferred_start_time),
                preferred_end_time: stringToTime(preferredTimes.preferred_end_time)
            }
            const splitTimes = splitPreferredTimes(preferredTimesInMins);
            for (const groups of groupsByAvailability){
                for (const group of groups[1]){
                    for (const preferredTime of splitTimes){
                        if (JSON.stringify({start_time: stringToTime(group.start_time), end_time: stringToTime(group.end_time)}) === JSON.stringify(preferredTime)){
                            if (group["users"]){
                                for (const userInList of group["users"][0]){
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
        if (groupsForUser.length === 0){
            for (const groups of groupsByAvailability.values()){
                if (groups.length === 1){
                    if (groups.users){
                        for (const userInList of groups.users){
                            if (userInList === user.id){
                                groupsForUser.push(groups);
                            }
                        }
                    }
                }
                else {
                    for (const existingGroup of groups){
                        if (existingGroup["users"]){
                            for (const userInList of existingGroup["users"]){
                                if (userInList === user.id){
                                    groupsForUser.push(existingGroup);
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

// Saves study groups in the database after they are created
const createUserExistingGroups = async (fetchData, filteredByTimeGroups) => {
    for (const group of filteredByTimeGroups){
        const user_id = group[0];
        for (const existingGroup of group[1]){
            const groupExists = await fetchData(`group/userExistingGroup/${user_id}/${existingGroup.id}`, "GET");
            if (!groupExists){
                const newGroupData = {
                    user_id,
                    existing_group_id: existingGroup.id
                }
                const newUserExistingGroup = await fetchData("group/userExistingGroup/", "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newGroupData));
            }
        }
    }
}

// Matches users into study groups based on the classes they're taking, availability, and preferred times
const MatchByAvailability = async (fetchData, allUsers) => {
    const usersInEachClass = [];
    
    const stringToTime = (timeString) => {
        timeString = String(timeString);
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
    await createUserExistingGroups(fetchData, filteredByTimeGroups);
}

export default MatchByAvailability;