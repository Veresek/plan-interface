"use client";
import { useState, useEffect } from "react";
import { getRooms } from "@/lib/rooms";
export default function Rooms() {
	const [data, setData] = useState(null);
	useEffect(() => {
		getRooms().then(res => {
			setData(res);
		});
	}, []);
	return <div>Rooms: {data != null ? JSON.stringify(data) : "Loading..."}</div>;
}
