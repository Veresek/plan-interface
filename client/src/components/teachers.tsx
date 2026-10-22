"use client";
import { useState, useEffect } from "react";
import { getTeachers } from "@/lib/teachers";
export default function Teachers() {
	const [data, setData] = useState(null);
	useEffect(() => {
		getTeachers().then(res => {
			setData(res);
		});
	}, []);
	return (
		<div>Teachers: {data != null ? JSON.stringify(data) : "Loading..."}</div>
	);
}
