module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
};

// This tells Webpack to use the style-loader and css-loader modules to load and parse CSS files.
