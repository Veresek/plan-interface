import { Lesson } from "@/types/types";
export async function getLessons(): Promise<Lesson[]> {
	const response = await fetch("/api/lessons/find");
	const data = response.json();
	return data;
}
