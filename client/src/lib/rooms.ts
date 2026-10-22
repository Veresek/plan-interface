export async function getRooms() {
	const response = await fetch("http://localhost:3000/rooms/all");
	const data = response.json();
	return data;
}
