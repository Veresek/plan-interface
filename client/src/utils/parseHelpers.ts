import { Lesson } from "@/types/types";

// A lesson the scraper fully resolved. Unparsed lessons (is_parsed = 0) come
// from the API with null subject/teacher/room and only raw_text set; they still
// occupy a real day/hour slot, so they count toward slot totals but must never
// surface as "null" in an entity view.
export type ParsedLesson = Lesson & {
	subject: string;
	teacher_name: string;
	room: string;
};

export const isCompleteLesson = (lesson: Lesson): lesson is ParsedLesson =>
	Boolean(lesson.subject && lesson.teacher_name && lesson.room);

const DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const HOURS: [string, string][] = [
	["08:00", "8:45"],
	["08:55", "9:40"],
	["09:50", "10:35"],
	["10:45", "11:30"],
	["11:40", "12:25"],
	["12:30", "13:15"],
	["13:45", "14:30"],
	["14:35", "15:20"],
	["15:25", "16:10"],
	["16:15", "17:00"],
	["17:05", "17:50"],
];

export const numToDay = (num: number) => DAYS[num] ?? "Unknown";

export const numToHourStart = (num: number) => HOURS[num]?.[0] ?? "Unknown";

export const numToHour = (num: number) => {
	const hour = HOURS[num];
	return hour ? `${hour[0]} - ${hour[1]}` : "Unknown";
};

export const distinctNumbers = (values: number[]) =>
	[...new Set(values)].sort((a, b) => a - b);

export const distinctStrings = (values: string[]) => [...new Set(values)].sort();
