const selain = {
	window: "readonly", document: "readonly", navigator: "readonly", location: "readonly",
	localStorage: "readonly", console: "readonly", Image: "readonly", Audio: "readonly",
	setTimeout: "readonly", clearTimeout: "readonly", fetch: "readonly", URL: "readonly",
	requestAnimationFrame: "readonly"
};
const serviceWorker = {
	self: "readonly", caches: "readonly", fetch: "readonly", URL: "readonly",
	Response: "readonly", Promise: "readonly"
};

module.exports = [
	{
		files: ["js/**/*.js"],
		languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: selain },
		rules: { "no-undef": "error", "no-var": "error" }
	},
	{
		files: ["sw.js"],
		languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: serviceWorker },
		rules: { "no-undef": "error", "no-var": "error" }
	}
];
