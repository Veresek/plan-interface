"use client";
import { useState } from "react";
import Lessons from "@/components/lessons";
import Teachers from "@/components/teachers";
import Rooms from "@/components/rooms";
import Dashboard from "@/components/dashboard";
import Availability from "@/components/availability";
import { cn } from "cn";

const TAB_IDS = ["dashboard", "lessons", "teachers", "rooms", "availability"] as const;

type TabId = (typeof TAB_IDS)[number];

const TABS: Record<TabId, { label: string; Component: () => React.ReactNode }> = {
	dashboard: { label: "Dashboard", Component: Dashboard },
	lessons: { label: "Lessons", Component: Lessons },
	teachers: { label: "Teachers", Component: Teachers },
	rooms: { label: "Rooms", Component: Rooms },
	availability: { label: "Availability", Component: Availability },
};

export default function Home() {
	const [tab, setTab] = useState<TabId>("dashboard");
	const active = TABS[tab];

	return (
		<div className="flex h-screen w-full flex-col gap-4 bg-muted/40 p-4">
			<nav className="flex flex-wrap gap-1 rounded-lg border bg-background p-1 shadow-sm">
				{TAB_IDS.map(id => (
					<button
						key={id}
						type="button"
						onClick={() => setTab(id)}
						aria-current={id === tab}
						className={cn(
							"rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
							id === tab
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:bg-muted hover:text-foreground",
						)}>
						{TABS[id].label}
					</button>
				))}
			</nav>

			<div className="min-h-0 flex-1 overflow-y-auto rounded-lg border bg-background p-4 shadow-sm">
				<h2 className="mb-3 text-lg font-semibold">{active.label}</h2>
				<active.Component />
			</div>
		</div>
	);
}
