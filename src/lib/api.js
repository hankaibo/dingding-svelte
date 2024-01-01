// place files you want to import through the `$lib` alias in this folder.
import { error } from '@sveltejs/kit';

const base = 'http://localhost:3000/api/v1';

/**
 * Sends a request to the server.
 *
 * @param {object} options The request options.
 * @param {string} [options.method] The HTTP method to use.
 * @param {string} options.path The path to the resource.
 * @param {object} [options.data] The request data.
 * @param {string} [options.token] The authentication token.
 * @returns {Promise<Response>} The promise for the response.
 */
async function send({ method, path, data, token }) {
	const opts = { method, headers: {} };

	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`;
	}

	const res = await fetch(`${base}/${path}`, opts);
	if (res.ok || res.status === 422) {
		const text = await res.text();
		return text ? JSON.parse(text) : {};
	}

	throw error(res.status);
}

/**
 *
 * @param {string} path
 * @param {string} token
 * @returns
 */
export function get(path, token) {
	return send({ method: 'GET', path, token });
}

/**
 *
 * @param {string} path
 * @param {string} token
 * @returns
 */
export function del(path, token) {
	return send({ method: 'DELETE', path, token });
}

/**
 *
 * @param {string} path
 * @param {object} data
 * @param {string} [token]
 * @returns
 */
export function post(path, data, token) {
	return send({ method: 'POST', path, data, token });
}

/**
 *
 * @param {string} path
 * @param {object} data
 * @param {string} token
 * @returns
 */
export function put(path, data, token) {
	return send({ method: 'PUT', path, data, token });
}

/**
 *
 * @param {string} path
 * @param {object} data
 * @param {string} token
 * @returns
 */
export function patch(path, data, token) {
	return send({ method: 'PATCH', path, data, token });
}
