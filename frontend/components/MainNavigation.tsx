"use client";

import React from "react";
import Link from "next/link";
import useUser from "@/lib/auth/useUser";
import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect, useRouter, usePathname } from "next/navigation";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

export default function MainNavigation() {
	return (
		<div className="flex justify-between px-std-sm py-2 items-center h-full">
				<Link href="/" className="text-xl font-bold hover:text-blue-700"> 
                	Inventory System
            	</Link>
			<nav className="flex gap-4 items-right">
				<NavigationUserMenu />
			</nav>
		</div>
	);
}

export function NavigationUserMenu() {
	const { loading, error, loggedOut, mutate: mutateUser, user } = useUser();

	const router = useRouter();

	const handleLogout = async () => {
		await fetch("/inventory_api/auth/logout");
		mutateUser();
		router.push("/auth/login");
	};

	React.useEffect(() => {
		if (loggedOut) {
			console.log("logged out");
			router.push("/auth/login");
		}
		if (loggedOut) {
			toast.warning("You are currently logged out", {
				action: {
					label: "Log in",
					onClick: () => {
						router.push("/auth/login");
					},
				},
				position: "top-center",
				important: true,
			});
		}
	}, [loggedOut]);

	return (
		<>
			{loggedOut ? (
				<Link
					className="hover:brightness-125 transition-transform bg-tgalpha-red-dark text-background dark:text-background dark:bg-foreground rounded p-2"
					href="/auth/login"
				>
					Log in
				</Link>
			) : (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Avatar className="hover:brightness-125">
								<AvatarImage src="" />
								<AvatarFallback className="font-semibold bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-foreground dark:text-background">
									{user?.username.split("")[0]}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>
								My Account ({user?.username})
							</DropdownMenuLabel>
							<DropdownMenuLabel>
								{user?.is_admin ? "- Admin Rights -" : "- No Admin Rights -"}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="flex gap-2 hover:cursor-pointer"
								onClick={async () => {
									await handleLogout();
									toast.success("Logged out successfully");
								}}
							>
								<>
									<span>Log out</span>
									<LogOutIcon className="w-4 h--4" />
								</>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			)}
		</>
	);
}
