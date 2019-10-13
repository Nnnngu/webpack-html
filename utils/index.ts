
export const getQueryString = (name: string): string => {
	let str = '';
	const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	const r = window.location.search.substr(1).match(reg);
	str = r !== null ? unescape(r[2]) : ''
	return str;
}