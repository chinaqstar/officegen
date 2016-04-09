var marked = require('marked');

function md2docx(mdLine) {
	var docxLine = {};
	switch(mdLine.type) {
		case 'heading':
			docxLine.type = 'text';
			docxLine.opt = { font_size: 21 - mdLine.depth * 3 };
			docxLine.val = mdLine.text;
			break;
		case 'paragraph':
			docxLine = inline(mdLine.text);
			break;
		case 'code':
		// TODO mdLine.text escape
			docxLine = (mdLine.text.split('\n') || []).reduce(function(p, c) {
				return p.concat([{
	      	type: 'text',
	      	val: c,
	      	opt: { font_size: 12 }
	      }, {
	      	type: 'linebreak'
	      }]);
			}, [{ 'backline': 'EDEDED'}]);
			docxLine.pop();
			break;
		case 'list_start':
		case 'list_item_start':
		case 'list_item_end':
		case 'list_end':
		case 'space':
			docxLine = null;
			break;
		case 'hr':
			docxLine.type = 'horizontalline';
			break;
		case 'text':
			// docxLine.type = 'text';
			// docxLine.opt = { font_size: 12 };
			// docxLine.text = '        ' + mdLine.text;
			docxLine = inline('        ' + mdLine.text);
			break;
	}

	return docxLine;
}

var rules = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  // br: /^\n/,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

var inline = function inline(src) {
	var out = [{}]
    , cap;

  while (src) {
    // strong
    if (cap = rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out.push({
      	type: 'text',
      	val: cap[2] || cap[1],
      	opt: { bold: true, font_size: 12 }
      });
      continue;
    }

		// // br
		// if (cap = rules.br.exec(src)) {
		// 	console.log(src);
		// 	src = src.substring(cap[0].length);
		// 	out.push({
    //   	type: "linebreak"
    //   });
		// 	continue;
		// }

    // text
    if (cap = rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out.push({
      	type: 'text',
      	val: cap[0],
      	opt: { font_size: 12 }
      });
      continue;
    }
  }

  return (!!out && out.length == 2) ? out[1] : out;
}

module.exports = exports = function(md) {
	var docxJson = [],
			mdList = md.split(/\n\n/) || [];

	marked.setOptions({
	  gfm: true
	});
	var tokens = marked.lexer(md);

	for (var i =0; i < tokens.length; i++) {
		var x = md2docx(tokens[i]);
		!!x && docxJson.push(x);
	}

	return 	docxJson;
}
