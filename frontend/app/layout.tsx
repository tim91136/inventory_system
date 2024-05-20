import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import MainNavigation from "@/components/MainNavigation";

import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "inventory management system",
	description: "",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased dark",
					fontSans.variable
				)}
			>
				<header id="main-header" className="z-50 shadow">
					<MainNavigation />
				</header>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
