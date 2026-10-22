export async function getLessons() {
	const response = await fetch("http://localhost:3000/lessons/find");
	const data = response.json();
	return data;
}
