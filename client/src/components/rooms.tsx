"use client";
import { useState, useEffect, useMemo } from "react";
import { Room } from "@/types/types";
import { getRooms } from "@/lib/rooms";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function Rooms() {
	const [data, setData] = useState<Room[] | null>(null);
	const [search, setSearch] = useState("");

	useEffect(() => {
		getRooms().then(res => {
			setData(res);
		});
	}, []);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return (data ?? []).filter(
			row =>
				q === "" ||
				row.short_name.toLowerCase().includes(q) ||
				row.long_name.toLowerCase().includes(q),
		);
	}, [data, search]);

	return (
		<div>
			<div className="mb-4 flex flex-wrap items-center gap-2">
				<Input
					placeholder="Search rooms..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="max-w-60"
				/>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Short Name</TableHead>
						<TableHead>Long Name</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filtered.map(row => (
						<RoomRow key={row.short_name} {...row} />
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function RoomRow(row: Room) {
	return (
		<TableRow key={row.short_name}>
			<TableCell>{row.short_name}</TableCell>
			<TableCell>{row.long_name}</TableCell>
		</TableRow>
	);
}
