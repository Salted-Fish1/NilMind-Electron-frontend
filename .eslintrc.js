module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:vue/vue3-essential",
		"plugin:@typescript-eslint/recommended"
	],
	"overrides": [
	],
	"parser": "vue-eslint-parser",
	// "parser": "@typescript-eslint/parser",
	"parserOptions": {
		"parser": "@typescript-eslint/parser",
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"vue",
		"@typescript-eslint"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		],
		"@typescript-eslint/no-unused-vars": "off"
	}
}
