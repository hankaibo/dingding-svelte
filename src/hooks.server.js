/**
 *
 * @param {*} param0
 * @returns
 */
export const handle = async ({ event, resolve }) => {
	console.log('url ---> ', event.url.pathname);
	return await resolve(event);
};
