module.exports = {
  entry: './wwwScript/main.jsx',
  output: {
    filename: 'wwwRoot/script.js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.jsx$/, loader: 'jsx-loader' },
      //{ test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx']
  }
};