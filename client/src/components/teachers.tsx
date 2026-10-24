"use client";
import { useState, useEffect, useMemo } from "react";
import { Teacher } from "@/types/types";
import { getTeachers } from "@/lib/teachers";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function Teachers() {
	const [data, setData] = useState<Teacher[] | null>(null);
	const [search, setSearch] = useState("");

	useEffect(() => {
		getTeachers().then(res => {
			setData(res);
		});
	}, []);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return (data ?? []).filter(
			row =>
				q === "" ||
				row.id.toLowerCase().includes(q) ||
				row.name.toLowerCase().includes(q),
		);
	}, [data, search]);

	return (
		<div>
			<div className="mb-4 flex flex-wrap items-center gap-2">
				<Input
					placeholder="Search teachers..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="max-w-60"
				/>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Name</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filtered.map(row => (
						<TeacherRow key={row.id} {...row} />
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function TeacherRow(row: Teacher) {
	return (
		<TableRow key={row.id}>
			<TableCell>{row.id}</TableCell>
			<TableCell>{row.name}</TableCell>
		</TableRow>
	);
}
