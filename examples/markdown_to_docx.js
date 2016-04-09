
var officegen = require('../lib/index.js');

var md2DocxJson = require('../plugins/markdown/md2DocxJson.js');

var fs = require('fs');
var path = require('path');

var docx = officegen ( 'docx' );

docx.on ( 'finalize', function ( written ) {
			console.log ( 'Finish to create Word file.\nTotal bytes created: ' + written + '\n' );
		});

docx.on ( 'error', function ( err ) {
			console.log ( err );
		});

var mdText = "## Simditor \n\na browser-based WYSIWYG text editor.\n\nIt is used by **Tower** -- a popular project management web application.\n\nSupported Browsers: IE10+、Chrome、Firefox、Safari.\n\n* * *\n\n## Installation\n\n```\n　Install with npm: $ npm install simditor\n　Install with bower: $ bower install simditor\n```";

var info = md2DocxJson(mdText);

var pObj = docx.createByJson(info);

var out = fs.createWriteStream ( 'info.docx' );

out.on ( 'error', function ( err ) {
	console.log ( err );
});

docx.generate ( out );
