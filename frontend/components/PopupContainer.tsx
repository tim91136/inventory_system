import React from "react";

export default function PopupContainer({
	children,
	onClose,
	className,
}: {
	children: React.ReactNode;
	onClose: () => void;
	className?: string;
}) {
	return (
		<div //full page container
			className={"fixed z-50 " + className}
		>
			{children}
		</div>
	);
}
