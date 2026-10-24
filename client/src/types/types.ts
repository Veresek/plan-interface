export type Lesson = {
	id: number;
	day: number;
	hour: number;
	class: string;
	teacher_id: string;
	teacher_name: string;
	room: string;
	subject: string;
	raw_text: string;
	is_parsed: boolean;
};
export type Room = {
	short_name: string;
	long_name: string;
};
export type Teacher = {
	id: string;
	name: string;
};
