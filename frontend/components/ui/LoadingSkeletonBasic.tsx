import React from "react";

export default function LoadingSkeletonBasic({
	tailwindClasses,
}: {
	tailwindClasses?: string;
}) {
	return (
		<div
			className={
				"w-full h-full rounded-md loading-skeleton-basic " +
				tailwindClasses
			}
		></div>
	);
}
