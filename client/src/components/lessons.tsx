"use client";
import { getLessons } from "@/lib/lessons";
import { Lesson } from "../types/types";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { numToDay, numToHour } from "@/utils/parseHelpers";

const ALL = "all";

export default function Lessons() {
	const [data, setData] = useState<Lesson[] | null>(null);
	const [search, setSearch] = useState("");
	const [day, setDay] = useState(ALL);
	const [hour, setHour] = useState(ALL);
	const [room, setRoom] = useState(ALL);
	const [teacher, setTeacher] = useState(ALL);

	useEffect(() => {
		getLessons().then(res => {
			setData(res);
		});
	}, []);

	const dayItems = useMemo(() => {
		const items: Record<string, string> = { [ALL]: "All days" };
		for (const d of [...new Set(data?.map(row => row.day) ?? [])].sort((a, b) => a - b)) {
			items[String(d)] = numToDay(d);
		}
		return items;
	}, [data]);

	const hourItems = useMemo(() => {
		const items: Record<string, string> = { [ALL]: "All hours" };
		for (const h of [...new Set(data?.map(row => row.hour) ?? [])].sort((a, b) => a - b)) {
			items[String(h)] = numToHour(h);
		}
		return items;
	}, [data]);

	const roomItems = useMemo(() => {
		const items: Record<string, string> = { [ALL]: "All rooms" };
		for (const r of [...new Set(data?.map(row => row.room) ?? [])].sort()) {
			items[r] = r;
		}
		return items;
	}, [data]);

	const teacherItems = useMemo(() => {
		const items: Record<string, string> = { [ALL]: "All teachers" };
		for (const t of [...new Set(data?.map(row => row.teacher_name) ?? [])].sort()) {
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
				<Select value={day} onValueChange={v => setDay(v ?? ALL)} items={dayItems}>
					<SelectTrigger className="w-40">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(dayItems).map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={hour} onValueChange={v => setHour(v ?? ALL)} items={hourItems}>
					<SelectTrigger className="w-44">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(hourItems).map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={room} onValueChange={v => setRoom(v ?? ALL)} items={roomItems}>
					<SelectTrigger className="w-36">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(roomItems).map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={teacher} onValueChange={v => setTeacher(v ?? ALL)} items={teacherItems}>
					<SelectTrigger className="w-48">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(teacherItems).map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
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

function LessonRow(row: Lesson) {
	return (
		<TableRow key={row.id}>
			<TableCell>{numToDay(row.day)}</TableCell>
			<TableCell>{numToHour(row.hour)}</TableCell>
			<TableCell>{row.room}</TableCell>
			<TableCell>{row.subject}</TableCell>
			<TableCell>{row.teacher_name}</TableCell>
		</TableRow>
	);
}
