const MINUTES_IN_HOUR = 60;

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

const getFreeTimes = (busyTimesPerDay) => {
    const STUDY_GROUPS_START = 8 * 60;
    const STUDY_GROUPS_END = 20 * 60;
    const DAYS_IN_WEEK = 7;
    const freeTimes = [];
    let currentEndTime = STUDY_GROUPS_END;
    const mergedOverlapBusyTimes = [];

    const stringToTime = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours * MINUTES_IN_HOUR + minutes;
    }

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
                    freeTimes[day[0].day_of_week].push({start_time: STUDY_GROUPS_START, end_time: currentEndTime});
                }
                else {
                    if (!(busyTime.end_time >= STUDY_GROUPS_END) && (busyTime.end_time !== currentEndTime)){
                        freeTimes[day[0].day_of_week].push({start_time: busyTime.end_time, end_time: currentEndTime});
                    }
                }
                currentEndTime = busyTime.start_time;
            }
        })
        if ((currentEndTime > STUDY_GROUPS_START) && (STUDY_GROUPS_START !== currentEndTime)){
            freeTimes[day[0].day_of_week].push({start_time: STUDY_GROUPS_START, end_time: currentEndTime});
        }
    }

    for (let i = 1; i <= DAYS_IN_WEEK; i++){
        if (!freeTimes[i]){
            freeTimes[i] = [];
            freeTimes[i].push({start_time: STUDY_GROUPS_START, end_time: STUDY_GROUPS_END});
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
                oneHourFreeTimes.push({start_time: currentStart, end_time: currentEnd, day_of_week: dayOfWeek});
                currentEnd = currentStart;
            }
            else {
                oneHourFreeTimes.push({start_time: freeTime.start_time, end_time: currentEnd, dayOfWeek: dayOfWeek});
                break;
            }
        }
    }
}

const MatchByAvailability = async (busyTimes, fetchData) => {
    const busyTimesPerDay = sortBusyTimes(busyTimes);
    const freeTimes = getFreeTimes(busyTimesPerDay);
    const usersInEachClass = [];

    const userClasses = await fetchData('availability/userClasses/', "GET", {"Content-Type": "application/json"});
    for (const userClass of userClasses){
        if (!usersInEachClass[userClass.class_id]){
            usersInEachClass[userClass.class_id] = [];
        }
        if (!usersInEachClass[userClass.class_id].includes(userClass.user_id)){
            usersInEachClass[userClass.class_id].push(userClass.user_id);
        }
    }
}

export default MatchByAvailability;