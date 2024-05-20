export async function getAlphawatchApiCsrfToken(): Promise<string> {
	let csrfRequest = await fetch("/alphawatch_api/auth/csrf-token", {
		method: "GET",
	});
	const csrfData = await csrfRequest.json();
	let csrfToken = csrfData.csrf_token;
	return csrfToken;
}
