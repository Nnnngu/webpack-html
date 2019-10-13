const apiGathers = {
	development: {
		api: "https://beta-api.wanmen.org/4.0"
	}
}[process.env.ENVIRONMENT || "development"];
export default apiGathers;
