"use client";
import { getLessons } from "@/lib/lessons";
import { useState, useEffect, useMemo } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/components/filter-select";
import {
	distinctNumbers,
	distinctStrings,
	isCompleteLesson,
	numToDay,
	numToHour,
	type ParsedLesson,
} from "@/utils/parseHelpers";

const ALL = "all";

export default function Lessons() {
	const [data, setData] = useState<ParsedLesson[] | null>(null);
	const [search, setSearch] = useState("");
	const [day, setDay] = useState(ALL);
	const [hour, setHour] = useState(ALL);
	const [room, setRoom] = useState(ALL);
	const [teacher, setTeacher] = useState(ALL);

	useEffect(() => {
		getLessons().then(res => {
			// Unparsed rows (null subject/teacher/room) would render as "null"
			// in the table and pollute the filter dropdowns.
			setData(res.filter(isCompleteLesson));
		});
	}, []);

	const dayItems = useMemo(() => {
		const items: Record<string, string> = { [ALL]: "All days" };
		for (const d of distinctNumbers((data ?? []).map(row => row.day))) {
			items[String(d)] = numToDay(d);
		}
		return items;
	}, [data]);

	const hourItems = useMemo(() => {
		const items: Record<string, string> = { [ALL]: "All hours" };
		for (const h of distinctNumbers((data ?? []).map(row => row.hour))) {
			items[String(h)] = numToHour(h);
		}
		return items;
	}, [data]);

	const roomItems = useMemo(() => {
		const items: Record<string, string> = { [ALL]: "All rooms" };
		for (const r of distinctStrings((data ?? []).map(row => row.room))) {
			items[r] = r;
		}
		return items;
	}, [data]);

	const teacherItems = useMemo(() => {
		const items: Record<string, string> = { [ALL]: "All teachers" };
		for (const t of distinctStrings((data ?? []).map(row => row.teacher_name))) {
			items[t] = t;
		}
		return items;
	}, [data]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return (data ?? []).filter(
			row =>
				(day === ALL || row.day === Number(day)) &&
				(hour === ALL || row.hour === Number(hour)) &&
				(room === ALL || row.room === room) &&
				(teacher === ALL || row.teacher_name === teacher) &&
				(q === "" ||
					row.subject.toLowerCase().includes(q) ||
					row.teacher_name.toLowerCase().includes(q) ||
					row.room.toLowerCase().includes(q))
		);
	}, [data, search, day, hour, room, teacher]);

	return (
		<div>
			<div className="mb-4 flex flex-wrap items-center gap-2">
				<Input
					placeholder="Search subject, teacher, room..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="max-w-60"
				/>
				<FilterSelect
					value={day}
					onValueChange={v => setDay(v ?? ALL)}
					items={dayItems}
					triggerClassName="w-40"
				/>
				<FilterSelect
					value={hour}
					onValueChange={v => setHour(v ?? ALL)}
					items={hourItems}
					triggerClassName="w-44"
				/>
				<FilterSelect
					value={room}
					onValueChange={v => setRoom(v ?? ALL)}
					items={roomItems}
					triggerClassName="w-36"
				/>
				<FilterSelect
					value={teacher}
					onValueChange={v => setTeacher(v ?? ALL)}
					items={teacherItems}
					triggerClassName="w-48"
				/>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Day</TableHead>
						<TableHead>Hour</TableHead>
						<TableHead>Room</TableHead>
						<TableHead>Subject</TableHead>
						<TableHead>Teacher</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filtered.map(row => (
						<LessonRow key={row.id} {...row} />
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function LessonRow(row: ParsedLesson) {
	return (
		<TableRow>
			<TableCell>{numToDay(row.day)}</TableCell>
			<TableCell>{numToHour(row.hour)}</TableCell>
			<TableCell>{row.room}</TableCell>
			<TableCell>{row.subject}</TableCell>
			<TableCell>{row.teacher_name}</TableCell>
		</TableRow>
	);
}
