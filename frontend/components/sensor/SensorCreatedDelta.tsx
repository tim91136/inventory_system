"use client";

import { time } from "console";
import React from "react";

export default function SensorCreatedDelta({ created }: { created: string }) {
	let today = new Date();
	let createdDate = new Date(created);

	let createdDelta = today.getTime() - createdDate.getTime();

	let daysSinceCreated = Math.floor(createdDelta / (1000 * 60 * 60 * 24)); // convert milliseconds to days
	let hoursSinceCreated = Math.floor(createdDelta / (1000 * 60 * 60)); // convert milliseconds to hours
	let minutesSinceCreated = Math.round(createdDelta / (1000 * 60)); // convert milliseconds to minutes

	let timeSinceCreated = "";

	if (daysSinceCreated > 0) {
		timeSinceCreated = `${daysSinceCreated} ${
			daysSinceCreated > 1 ? "days" : "day"
		} ago`;
	} else if (hoursSinceCreated > 0) {
		timeSinceCreated = `${hoursSinceCreated} ${
			hoursSinceCreated > 1 ? "hours" : "hour"
		} ago`;
	} else if (minutesSinceCreated > 0) {
		timeSinceCreated = `${minutesSinceCreated} ${
			minutesSinceCreated > 1 ? "minutes" : "minute"
		} ago`;
	} else { timeSinceCreated = "Just now"; }

	return <div>{timeSinceCreated}</div>;
}
