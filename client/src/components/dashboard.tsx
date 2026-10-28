"use client";
import { getLessons } from "@/lib/lessons";
import { Lesson } from "@/types/types";
import { useEffect, useMemo, useState } from "react";
import {
	isCompleteLesson,
	numToDay,
	numToHourStart,
	type ParsedLesson,
} from "@/utils/parseHelpers";
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const chartConfig = {
	value: {
		label: "Lessons",
		color: "#1d4ed8",
	},
} satisfies ChartConfig;

function countBy<R, K>(rows: R[], key: (row: R) => K) {
	const counts = new Map<K, number>();
	for (const row of rows) {
		const k = key(row);
		counts.set(k, (counts.get(k) ?? 0) + 1);
	}
	return counts;
}

function slotCounts(
	rows: Lesson[],
	slot: (row: Lesson) => number,
	label: (num: number) => string,
) {
	return [...countBy(rows, slot).entries()]
		.sort((a, b) => a[0] - b[0])
		.map(([num, value]) => ({ label: label(num), value }));
}

function sortedCounts(
	rows: ParsedLesson[],
	key: (row: ParsedLesson) => string,
) {
	return [...countBy(rows, key).entries()]
		.map(([label, value]) => ({ label, value }))
		.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

export default function Dashboard() {
	const [data, setData] = useState<Lesson[] | null>(null);

	useEffect(() => {
		getLessons().then(setData);
	}, []);

	const valid = useMemo(() => (data ?? []).filter(isCompleteLesson), [data]);

	const stats = useMemo(() => {
		const rows = data ?? [];
		return {
			lessons: rows.length,
			teachers: new Set(valid.map(r => r.teacher_name)).size,
			rooms: new Set(valid.map(r => r.room)).size,
			classes: new Set(rows.map(r => r.class)).size,
			subjects: new Set(valid.map(r => r.subject)).size,
		};
	}, [data, valid]);

	const byDay = useMemo(
		() => slotCounts(data ?? [], r => r.day, numToDay),
		[data],
	);
	const byHour = useMemo(
		() => slotCounts(data ?? [], r => r.hour, numToHourStart),
		[data],
	);

	const teacherLoad = useMemo(
		() => sortedCounts(valid, r => r.teacher_name),
		[valid],
	);
	const roomLoad = useMemo(() => sortedCounts(valid, r => r.room), [valid]);

	if (!data) {
		return <p className="text-sm text-muted-foreground">Loading…</p>;
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				<Kpi label="Lessons" value={stats.lessons} />
				<Kpi label="Teachers" value={stats.teachers} />
				<Kpi label="Rooms" value={stats.rooms} />
				<Kpi label="Classes" value={stats.classes} />
				<Kpi label="Subjects" value={stats.subjects} />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Panel title="Lessons per day" subtitle="How the week is distributed">
					<ColumnChart data={byDay} />
				</Panel>
				<Panel title="Lessons per hour" subtitle="Load across the school day">
					<ColumnChart data={byHour} />
				</Panel>
				<Panel title="Teacher load" subtitle="All teachers by weekly lessons">
					<BarList data={teacherLoad} />
				</Panel>
				<Panel title="Room occupancy" subtitle="All rooms by weekly lessons">
					<BarList data={roomLoad} />
				</Panel>
			</div>
		</div>
	);
}

function Kpi({ label, value }: { label: string; value: number }) {
	return (
		<Card>
			<CardContent>
				<div className="text-3xl font-semibold tabular-nums">{value}</div>
				<div className="mt-1 text-sm text-muted-foreground">{label}</div>
			</CardContent>
		</Card>
	);
}

function Panel({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{subtitle && <CardDescription>{subtitle}</CardDescription>}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

function ColumnChart({ data }: { data: { label: string; value: number }[] }) {
	return (
		<ChartContainer config={chartConfig} className="h-64 w-full">
			<BarChart data={data} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
				<CartesianGrid vertical={false} strokeDasharray="3 3" />
				<XAxis
					dataKey="label"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
				/>
				<ChartTooltip content={<ChartTooltipContent />} cursor={false} />
				<Bar dataKey="value" fill="var(--color-value)" radius={4}>
					<LabelList
						dataKey="value"
						position="top"
						offset={4}
						className="fill-muted-foreground text-[10px] tabular-nums"
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}

function BarList({ data }: { data: { label: string; value: number }[] }) {
	return (
		<div className="h-80 overflow-y-auto">
			<ChartContainer
				config={chartConfig}
				className="aspect-auto w-full"
				style={{ height: Math.max(320, data.length * 32) }}>
				<BarChart
					data={data}
					layout="vertical"
					margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
					<CartesianGrid horizontal={false} strokeDasharray="3 3" />
					<YAxis
						type="category"
						dataKey="label"
						width={130}
						tickLine={false}
						axisLine={false}
						tickMargin={8}
					/>
					<XAxis type="number" hide />
					<ChartTooltip content={<ChartTooltipContent />} cursor={false} />
					<Bar dataKey="value" fill="var(--color-value)" radius={4}>
						<LabelList
							dataKey="value"
							position="right"
							offset={6}
							className="fill-muted-foreground text-[10px] tabular-nums"
						/>
					</Bar>
				</BarChart>
			</ChartContainer>
		</div>
	);
}
