import { Lesson } from "@/types/types";
export async function getLessons(): Promise<Lesson[]> {
	const response = await fetch("http://localhost:3000/lessons/find");
	const data = response.json();
	return data;
}
