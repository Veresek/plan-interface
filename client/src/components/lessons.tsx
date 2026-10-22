"use client";
import { getLessons } from "@/lib/lessons";
import { useState, useEffect } from "react";
export default function Lessons() {
	const [data, setData] = useState(null);
	useEffect(() => {
		getLessons().then(res => {
			setData(res);
		});
	}, []);
	return (
		<div>Lessons: {data != null ? JSON.stringify(data) : "Loading..."}</div>
	);
}

function LessonComponent() {}
