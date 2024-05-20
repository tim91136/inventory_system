"use client";

import React, { FormEvent } from "react";
import { getInventoryApiCsrfToken } from "@utils/inventory_api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginForm() {
	const router = useRouter();

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		let csrfToken = await getInventoryApiCsrfToken();

		let body = new FormData();
		body.append("email", email);
		body.append("password", password);

		console.log("submit");
		fetch("/inventory_api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": csrfToken,
			},
			body: JSON.stringify({
				email: email,
				password: password,
			}),
		}).then((res) => {
			if (res.ok) {
				router.push("/");
				toast.success("Login success", {
					description: "Welcome back!",
					style: {
						border: "1px solid #00ff00",
					},
				});
			} else {
				toast.error("Login failed", {
					description: "Email or Password wrong! Please try again.",
					style: {
						border: "1px solid #ff0000",
					},
				});
			}
		});
	};

	return (
		<div className="flex w-full justify-center h-[50dvh] items-center">
			<div className="border dark:border-muted border-muted-foreground py-4 px-12 rounded-md flex flex-col items-center shadow-md lg:max-w-[25%]">
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<h1 style={{ fontWeight: '300' }}>
						<span style={{ color: '#9EB1FF' }}>inventory_</span>
					</h1>
					<h1 style={{ fontWeight: '500' }}>System</h1>
				</div>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-2 justify-center items-center"
				>
					<input
						name="name"
						type="email"
						placeholder="Name"
						onChange={(e) => setEmail(e.target.value)}
						className="w-fit bg-secondary rounded-md p-2"
					/>
					<input
						name="password"
						type="password"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
						className="w-fit bg-secondary rounded-md p-2"
					/>
					<button
						type="submit"
						className="p-2 shadow-sm hover:brightness-125 dark:bg-gradient-to-r dark:text-secondary-foreground text-foreground from-pink-500 via-red-500 to-yellow-500 rounded-md border hover:bg-transparent transition-transform min-w-[100px] font-semibold hover:border-foreground dark:hover:border-slate-100 focus:hover:border-slate-100"
					>
						Login
					</button>
				</form>
				<p className="mt-12 text-muted-foreground text-center">
					Log in to your inventory system account.
					<br />
					You can choose between User and Admin.
				</p>
			</div>
		</div>
	);
}
