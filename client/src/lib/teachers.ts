export async function getTeachers() {
	const response = await fetch("http://localhost:3000/teachers/all");
	const data = response.json();
	return data;
}
