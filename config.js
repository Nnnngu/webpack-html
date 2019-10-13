const apiGathers = {
	development: {
		api: "https://localhost:80"
	}
}[process.env.ENVIRONMENT || "development"];
export default apiGathers;
