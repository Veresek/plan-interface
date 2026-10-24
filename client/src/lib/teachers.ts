import { Teacher } from "@/types/types";
export async function getTeachers(): Promise<Teacher[]> {
	const response = await fetch("http://localhost:3000/teachers/all");
	const data = response.json();
	return data;
}
