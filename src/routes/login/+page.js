// export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const response = await fetch('/bing/HPImageArchive.aspx?format=js&idx=0&n=1');
	const data = await response.json();
	const url = `https://cn.bing.com${data.images[0].url}`;
	return {
		url,
		title: '登录'
	};
}
