import { Teacher } from "@/types/types";
export async function getTeachers(): Promise<Teacher[]> {
	const response = await fetch("/api/teachers/all");
	const data = response.json();
	return data;
}
