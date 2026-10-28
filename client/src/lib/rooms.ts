import { Room } from "@/types/types";
export async function getRooms() : Promise<Room[]> {
	const response = await fetch("/api/rooms/all");
	const data = response.json();
	return data;
}
