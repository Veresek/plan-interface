import { Room } from "@/types/types";
export async function getRooms() : Promise<Room[]> {
	const response = await fetch("http://localhost:3000/rooms/all");
	const data = response.json();
	return data;
}
