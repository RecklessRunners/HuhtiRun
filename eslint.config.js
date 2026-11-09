const tseslint = require("typescript-eslint");

const serviceWorker = {
	self: "readonly", caches: "readonly", fetch: "readonly", URL: "readonly",
	Response: "readonly", Promise: "readonly"
};

module.exports = tseslint.config(
	{
		files: ["js/**/*.ts"],
		extends: [tseslint.configs.recommended],
		rules: {
			"no-var": "error",
			"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" }]
		}
	},
	{
		files: ["public/sw.js"],
		languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: serviceWorker },
		rules: { "no-undef": "error", "no-var": "error" }
	}
);
