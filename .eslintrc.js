module.exports = {
	extends: [
		"plugin:react-hooks/recommended",
		"eslint:recommended",
		"plugin:react/recommended",
	],
	plugins: [
		// ...
		"react-hooks",
	],
	// parser: "babel-eslint",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
			modules: true,
		},
	},
	rules: {
		quotes: [2, "double", { avoidEscape: true }],
	},
};