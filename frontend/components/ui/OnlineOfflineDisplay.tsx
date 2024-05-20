"use client";

import React from "react";

export default function OnlineOfflineDisplay({ online }: { online: boolean }) {
	return (
		<>
			{online ? (
				<span className="dark:bg-green-800 bg-green-500 tracking-wide border dark:text-foreground text-background rounded-md border-green-500 p-1 font-medium">
					Online
				</span>
			) : (
				<span className="bg-red-800 tracking-wide dark:text-foreground text-background border rounded-md border-red-500 p-1 font-medium">
					Offline
				</span>
			)}
		</>
	);
}
