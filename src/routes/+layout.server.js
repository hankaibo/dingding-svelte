/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	return {
		user: locals.user && {
			lastName: locals.user.lastName,
			firstName: locals.user.firstName,
			email: locals.user.email,
			image: locals.user.photo,
			role: locals.user.role
		},
		token: locals.token,
	};
}
