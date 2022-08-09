const editorconfig = require('editorconfig').parseSync('./editorconfig')

module.exports = {
	extends: ['stylelint-config-prettier', 'stylelint-config-recommended-scss'],
	ignoreFiles: ['**/*.ts'],
	rules: {
		indentation: editorconfig.indent_size,
		'no-missing-end-of-source-newline': editorconfig.insert_final_newline,
		'no-eol-whitespace': editorconfig.trim_trailing_whitespace,
	},
	overrides: [
		{
			files: ['**/*.svelte', '**/*.html'],
			customSyntax: 'postcss-html',
		},
	],
}
