import { json } from '@sveltejs/kit';

export const GET = () => {
	return json({ a: 10 });
};
