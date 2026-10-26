"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function FilterSelect<T extends string>({
	value,
	onValueChange,
	items,
	placeholder,
	triggerClassName,
}: {
	value: T;
	onValueChange: (value: T | null) => void;
	items: Record<string, string>;
	placeholder?: string;
	triggerClassName?: string;
}) {
	return (
		<Select value={value} onValueChange={onValueChange} items={items}>
			<SelectTrigger className={triggerClassName}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{Object.entries(items).map(([itemValue, label]) => (
					<SelectItem key={itemValue} value={itemValue}>
						{label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
