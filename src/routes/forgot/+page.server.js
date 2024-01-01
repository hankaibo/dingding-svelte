import { fail, redirect } from '@sveltejs/kit';
import * as api from '$lib/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
	const { user } = await parent();
	if (user) {
		throw redirect(307, '/');
	}

	const response = await fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
	const data = await response.json();
	const url = `https://cn.bing.com${data.images[0].url}`;
	return {
		url
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const user = {
			email: data.get('email')
		};

		const body = await api.post('auth/email/register', user);

		if (body.errors) {
			return fail(401, body);
		}

		throw redirect(307, '/');
	}
};
