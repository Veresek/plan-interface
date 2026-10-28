export type Lesson = {
	id: number;
	day: number;
	hour: number;
	class: string;
	teacher_id: string | null;
	teacher_name: string | null;
	room: string | null;
	subject: string | null;
	raw_text: string | null;
	is_parsed: 0 | 1;
};
export type Room = {
	short_name: string;
	long_name: string;
};
export type Teacher = {
	id: string;
	name: string;
};
