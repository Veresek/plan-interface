export const numToDay = (num: number) => {
	switch (num) {
		case 0:
			return "Monday";
		case 1:
			return "Tuesday";
		case 2:
			return "Wednesday";
		case 3:
			return "Thursday";
		case 4:
			return "Friday";
		case 5:
			return "Saturday";
		case 6:
			return "Sunday";
		default:
			return "Unknown";
	}
};
export const numToHour = (num: number) => {
	switch (num) {
		case 0:
			return "08:00 - 8:45";
		case 1:
			return "08:55 - 9:40";
		case 2:
			return "09:50 - 10:35";
		case 3:
			return "10:45 - 11:30";
		case 4:
			return "11:40 - 12:25";
		case 5:
			return "12:30 - 13:15";
		case 6:
			return "13:45 - 14:30";
		case 7:
			return "14:35 - 15:20";
		case 8:
			return "15:25 - 16:10";
		case 9:
			return "16:15 - 17:00";
		case 10:
			return "17:05 - 17:50";
		default:
			return "Unknown";
	}
};
