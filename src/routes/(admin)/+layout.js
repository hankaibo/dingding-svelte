/** @type {import('./$types').LayoutLoad} */
export function load() {
	return {
		navs: [
			{ href: 'home', title: 'Home' },
			{ href: 'user', title: 'User' },
			{ href: 'about', title: 'About' }
		]
	};
}
