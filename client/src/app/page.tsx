import Lessons from "@/components/lessons";
import Teachers from "@/components/teachers";
import Rooms from "@/components/rooms";
export default function Home() {
	return (
		<div className="flex flex-row gap-4 w-full h-screen p-4 bg-muted/40">
			<div className="flex-1 min-w-0 overflow-y-auto rounded-lg border bg-background p-4 shadow-sm">
				<h2 className="mb-3 text-lg font-semibold">Lessons</h2>
				<Lessons />
			</div>
			<div className="flex-1 min-w-0 overflow-y-auto rounded-lg border bg-background p-4 shadow-sm">
				<h2 className="mb-3 text-lg font-semibold">Teachers</h2>
				<Teachers />
			</div>
			<div className="flex-1 min-w-0 overflow-y-auto rounded-lg border bg-background p-4 shadow-sm">
				<h2 className="mb-3 text-lg font-semibold">Rooms</h2>
				<Rooms />
			</div>
		</div>
	);
}
