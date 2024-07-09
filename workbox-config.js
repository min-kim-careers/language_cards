module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,ico,html,png,json}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};