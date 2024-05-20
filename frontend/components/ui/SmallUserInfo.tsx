"use client";

import React from "react";
import useUser from "@/lib/auth/useUser";
import Link from "next/link";
import { NavigationUserMenu } from "../MainNavigation";

export default function SmallUserInfo() {
	const { user } = useUser();
	return (
		<div>
			{user ? (
				<div className="flex gap-2 items-center text-muted-foreground">
					Current User:
					<NavigationUserMenu />
					{user.username.split("").slice(1).join("")}
				</div>
			) : (
				<Link
					href="/auth/login"
					className="rounded-md bg-slate-100 text-zinc-900 hover:bg-transparent hover:text-slate-100 transition-colors border p-2"
				>
					Please Log In
				</Link>
			)}
		</div>
	);
}
