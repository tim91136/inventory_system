export async function getInventoryApiCsrfToken() {
	let csrfRequest = await fetch("/inventory_api/auth/csrf-token", {
		method: "GET",
	});
	const csrfData = await csrfRequest.json();
	let csrfToken = csrfData.csrf_token;
	return csrfToken;
}
