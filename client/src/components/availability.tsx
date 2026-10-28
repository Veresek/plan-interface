"use client";
import { getLessons } from "@/lib/lessons";
import { Lesson } from "@/types/types";
import { useEffect, useMemo, useState } from "react";
import { FilterSelect } from "@/components/filter-select";
import {
	distinctNumbers,
	distinctStrings,
	isCompleteLesson,
	numToDay,
	numToHour,
	type ParsedLesson,
} from "@/utils/parseHelpers";

const FREE = "#166534";
const BUSY = "#be123c";
const FREE_TINT = "#16653412";
const BUSY_TINT = "#be123c14";

type Kind = "room" | "teacher";

const KINDS: Record<
	Kind,
	{
		label: string;
		plural: string;
		singular: string;
		pick: (lesson: ParsedLesson) => string;
	}
> = {
	room: {
		label: "Rooms",
		plural: "rooms",
		singular: "Room",
		pick: lesson => lesson.room,
	},
	teacher: {
		label: "Teachers",
		plural: "teachers",
		singular: "Teacher",
		pick: lesson => lesson.teacher_name,
	},
};

const KIND_ITEMS: Record<Kind, string> = {
	room: KINDS.room.label,
	teacher: KINDS.teacher.label,
};

export default function Availability() {
	const [data, setData] = useState<Lesson[] | null>(null);
	const [kind, setKind] = useState<Kind>("room");
	const [target, setTarget] = useState("");

	useEffect(() => {
		getLessons().then(setData);
	}, []);

	const parsed = useMemo(() => (data ?? []).filter(isCompleteLesson), [data]);

	const days = useMemo(() => distinctNumbers((data ?? []).map(r => r.day)), [data]);
	const hours = useMemo(() => distinctNumbers((data ?? []).map(r => r.hour)), [data]);

	const targets = useMemo(
		() => distinctStrings(parsed.map(KINDS[kind].pick)),
		[parsed, kind],
	);

	const targetItems = useMemo(
		() => Object.fromEntries(targets.map(t => [t, t])),
		[targets],
	);

	const selected = targets.includes(target) ? target : (targets[0] ?? "");

	const busy = useMemo(() => {
		const map = new Map<string, ParsedLesson>();
		if (!selected) return map;
		const pick = KINDS[kind].pick;
		for (const lesson of parsed) {
			if (pick(lesson) === selected) {
				map.set(`${lesson.day}-${lesson.hour}`, lesson);
			}
		}
		return map;
	}, [parsed, kind, selected]);

	const totalSlots = days.length * hours.length;
	const busyCount = busy.size;
	const freeCount = totalSlots - busyCount;

	if (!data) {
		return <p className="text-sm text-muted-foreground">Loading…</p>;
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center gap-2">
				<FilterSelect
					value={kind}
					onValueChange={v => setKind(v ?? "room")}
					items={KIND_ITEMS}
					triggerClassName="w-36"
				/>
				<FilterSelect
					value={selected}
					onValueChange={v => setTarget(v ?? "")}
					items={targetItems}
					placeholder="Select…"
					triggerClassName="w-60"
				/>

				<div className="ml-auto flex items-center gap-4 text-xs">
					<Legend color={FREE} label={`${freeCount} free`} />
					<Legend color={BUSY} label={`${busyCount} busy`} />
				</div>
			</div>

			{!selected ? (
				<p className="text-sm text-muted-foreground">
					No {KINDS[kind].plural} found in the plan.
				</p>
			) : (
				<div className="overflow-x-auto rounded-lg border">
					<div
						className="grid min-w-max"
						style={{
							gridTemplateColumns: `9rem repeat(${days.length}, minmax(9rem, 1fr))`,
						}}>
						<div className="border-b border-r bg-muted/40 p-2 text-xs font-medium text-muted-foreground">
							{KINDS[kind].singular}: {selected}
						</div>
						{days.map(d => (
							<div
								key={`h-${d}`}
								className="border-b bg-muted/40 p-2 text-center text-xs font-semibold">
								{numToDay(d)}
							</div>
						))}

						{hours.map(h => (
							<Row key={`r-${h}`} hour={h} days={days} busy={busy} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function Row({
	hour,
	days,
	busy,
}: {
	hour: number;
	days: number[];
	busy: Map<string, ParsedLesson>;
}) {
	return (
		<>
			<div className="border-b border-r bg-muted/20 p-2 text-xs font-medium text-muted-foreground">
				{numToHour(hour)}
			</div>
			{days.map(d => {
				const lesson = busy.get(`${d}-${hour}`);
				if (lesson) {
					return (
						<div
							key={`c-${d}-${hour}`}
							className="border-b border-l p-2 text-xs"
							style={{ backgroundColor: BUSY_TINT }}>
							<div className="font-medium" style={{ color: BUSY }}>
								{lesson.subject}
							</div>
							<div className="text-muted-foreground">
								{lesson.class} · {lesson.room}
							</div>
						</div>
					);
				}
				return (
					<div
						key={`c-${d}-${hour}`}
						className="border-b border-l p-2 text-xs font-medium"
						style={{ backgroundColor: FREE_TINT, color: FREE }}>
						Free
					</div>
				);
			})}
		</>
	);
}

function Legend({ color, label }: { color: string; label: string }) {
	return (
		<span className="flex items-center gap-1.5 text-muted-foreground">
			<span
				className="inline-block size-3 rounded-sm"
				style={{ backgroundColor: color }}
			/>
			{label}
		</span>
	);
}
