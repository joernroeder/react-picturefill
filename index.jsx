'use strict';

var isBrowser = (typeof window !== 'undefined');

var React = require('react');
var Picturefill = isBrowser ? require('picturefill') : function () {};

var Picture = React.createClass({

	getDefaultProps: function (){
		return {
			sources: {},
			resolutions: [1],
			mediaQueryUnit: 'px',
			altText: '',
			className: '',
			defaultImageSource: 'data:image/gif;base64,R0lGODlhAQABAAAAADs='
		};
	},

	componentDidMount: function () {
		Picturefill({
			elements: [
				this.getDOMNode()
			]
		});
	},

	getSources: function () {
		var sources = [];
		var sourceKeys = Object.keys(this.props.sources);

		for (var i = 0; i < sourceKeys.length; i++) {
			sources.push(this.getSource(i, sourceKeys[i], this.props.sources[sourceKeys[i]]));
		}

		return sources;
	},

	getDefaultImageSource: function () {
		var sourceKeys = Object.keys(this.props.sources);

		for (var i = 0; i < sourceKeys.length; i++) {
			var sourceKey = sourceKeys[i];
			var data = this.props.sources[sourceKey];

			if (data === 0) {
				return sourceKey;
			}
		}

		return this.props.defaultImageSource;
	},

	getSource: function (index, source, data) {
		var srcSet = [];

		for (var i = 0; i < this.props.resolutions.length; i++) {
			var resolution = this.props.resolutions[i];
			var s = source.split('.');
			var ext = s[s.length - 1];

			source = source.replace('.' + ext, resolution.key + '.' + ext);
			srcSet.push(source + ' ' + resolution.res + 'x');
		}

		return (
			<source key={index} media={this.getMediaQuery(data)} srcSet={srcSet.join(', ')} />
		);
	},

	buildMediaQuery: function (dimension, value) {
		return '(min-' + dimension + ': ' + value + this.props.mediaQueryUnit + ')';
	},

	getMediaQuery: function (data) {
		if (typeof data === 'number') {
			return this.buildMediaQuery('width', data);
		}
		else if (typeof data === 'string') {
			return data;
		}
		else if (typeof data === 'object') {
			if (data.width || data.height) {
				var dims = Object.keys(data);
				var queries = [];

				for (var i = 0; i < dims.length; i++) {
					var dim = dims[i];

					queries.push(this.buildMediaQuery(dim, data[dim]));
				}

				return queries.join(' and ');
			}

			console.error('Unimplemented Media Query Object!', data);
		}
	},

	render: function () {
		var sources = this.getSources();

		return (
			<picture className={this.props.className}>
				{/*<!--[if IE 9]><video style="display: none;"><![endif]-->*/}
				{sources}
				{/*<!--[if IE 9]></video><![endif]-->*/}
				<img className={this.props.className ? this.props.className + '-image' : ''}
					srcSet={this.getDefaultImageSource()} 
					alt={this.props.alt} />
			</picture>
		)
	}
});

module.exports = Picture;