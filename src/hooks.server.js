/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const jwt = event.cookies.get('jwt');
	const { user = undefined, token = undefined } = jwt ? JSON.parse(atob(jwt)) : {};
	event.locals.user = user;
	event.locals.token = token;

	return await resolve(event);
};
