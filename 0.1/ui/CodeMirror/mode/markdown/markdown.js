!function(t){"object"==typeof exports&&"object"==typeof module?t(require("../../lib/codemirror"),require("../xml/xml"),require("../meta")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../xml/xml","../meta"],t):t(CodeMirror)}(function(t){"use strict";t.defineMode("markdown",function(e,n){function i(n){if(t.findModeByName){var i=t.findModeByName(n);i&&(n=i.mime||i.mimes[0])}var r=t.getMode(e,n);return"null"==r.name?null:r}function r(t,e,n){return e.f=e.inline=n,n(t,e)}function a(t,e,n){return e.f=e.block=n,n(t,e)}function o(t){return t.linkTitle=!1,t.em=!1,t.strong=!1,t.strikethrough=!1,t.quote=0,t.indentedCode=!1,L||t.f!=h||(t.f=m,t.block=l),t.trailingSpace=0,t.trailingSpaceNewLine=!1,t.thisLineHasContent=!1,null}function l(t,e){var a=t.sol(),o=e.list!==!1,l=e.indentedCode;e.indentedCode=!1,o&&(e.indentationDiff>=0?(e.indentationDiff<4&&(e.indentation-=e.indentationDiff),e.list=null):e.indentation>0?(e.list=null,e.listDepth=Math.floor(e.indentation/4)):(e.list=!1,e.listDepth=0));var h=null;if(e.indentationDiff>=4)return t.skipToEnd(),l||!e.prevLineHasContent?(e.indentation-=4,e.indentedCode=!0,q):null;if(t.eatSpace())return null;if((h=t.match(z))&&h[1].length<=6)return e.header=h[1].length,n.highlightFormatting&&(e.formatting="header"),e.f=e.inline,f(e);if(e.prevLineHasContent&&!e.quote&&!o&&!l&&(h=t.match(P)))return e.header="="==h[0].charAt(0)?1:2,n.highlightFormatting&&(e.formatting="header"),e.f=e.inline,f(e);if(t.eat(">"))return e.quote=a?1:e.quote+1,n.highlightFormatting&&(e.formatting="quote"),t.eatSpace(),f(e);if("["===t.peek())return r(t,e,p);if(t.match(U,!0))return e.hr=!0,T;if((!e.prevLineHasContent||o)&&(t.match(R,!1)||t.match(A,!1))){var s=null;return t.match(R,!0)?s="ul":(t.match(A,!0),s="ol"),e.indentation+=4,e.list=!0,e.listDepth++,n.taskLists&&t.match(I,!1)&&(e.taskList=!0),e.f=e.inline,n.highlightFormatting&&(e.formatting=["list","list-"+s]),f(e)}return n.fencedCodeBlocks&&t.match(/^```[ \t]*([\w+#]*)/,!0)?(e.localMode=i(RegExp.$1),e.localMode&&(e.localState=e.localMode.startState()),e.f=e.block=g,n.highlightFormatting&&(e.formatting="code-block"),e.code=!0,f(e)):r(t,e,e.inline)}function h(t,e){var n=C.token(t,e.htmlState);return(L&&null===e.htmlState.tagStart&&!e.htmlState.context&&e.htmlState.tokenize.isInText||e.md_inside&&t.current().indexOf(">")>-1)&&(e.f=m,e.block=l,e.htmlState=null),n}function g(t,e){return t.sol()&&t.match("```",!1)?(e.localMode=e.localState=null,e.f=e.block=s,null):e.localMode?e.localMode.token(t,e.localState):(t.skipToEnd(),q)}function s(t,e){t.match("```"),e.block=l,e.f=m,n.highlightFormatting&&(e.formatting="code-block"),e.code=!0;var i=f(e);return e.code=!1,i}function f(t){var e=[];if(t.formatting){e.push(y),"string"==typeof t.formatting&&(t.formatting=[t.formatting]);for(var i=0;i<t.formatting.length;i++)e.push(y+"-"+t.formatting[i]),"header"===t.formatting[i]&&e.push(y+"-"+t.formatting[i]+"-"+t.header),"quote"===t.formatting[i]&&e.push(!n.maxBlockquoteDepth||n.maxBlockquoteDepth>=t.quote?y+"-"+t.formatting[i]+"-"+t.quote:"error")}if(t.taskOpen)return e.push("meta"),e.length?e.join(" "):null;if(t.taskClosed)return e.push("property"),e.length?e.join(" "):null;if(t.linkHref?e.push(E,"url"):(t.strong&&e.push(j),t.em&&e.push(O),t.strikethrough&&e.push(W),t.linkText&&e.push(N),t.code&&e.push(q)),t.header&&(e.push(b),e.push(b+"-"+t.header)),t.quote&&(e.push(M),e.push(!n.maxBlockquoteDepth||n.maxBlockquoteDepth>=t.quote?M+"-"+t.quote:M+"-"+n.maxBlockquoteDepth)),t.list!==!1){var r=(t.listDepth-1)%3;e.push(r?1===r?D:H:w)}return t.trailingSpaceNewLine?e.push("trailing-space-new-line"):t.trailingSpace&&e.push("trailing-space-"+(t.trailingSpace%2?"a":"b")),e.length?e.join(" "):null}function u(t,e){return t.match(G,!0)?f(e):void 0}function m(e,i){var r=i.text(e,i);if("undefined"!=typeof r)return r;if(i.list)return i.list=null,f(i);if(i.taskList){var o="x"!==e.match(I,!0)[1];return o?i.taskOpen=!0:i.taskClosed=!0,n.highlightFormatting&&(i.formatting="task"),i.taskList=!1,f(i)}if(i.taskOpen=!1,i.taskClosed=!1,i.header&&e.match(/^#+$/,!0))return n.highlightFormatting&&(i.formatting="header"),f(i);var l=e.sol(),g=e.next();if("\\"===g&&(e.next(),n.highlightFormatting)){var s=f(i);return s?s+" formatting-escape":"formatting-escape"}if(i.linkTitle){i.linkTitle=!1;var u=g;"("===g&&(u=")"),u=(u+"").replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1");var m="^\\s*(?:[^"+u+"\\\\]+|\\\\\\\\|\\\\.)"+u;if(e.match(new RegExp(m),!0))return E}if("`"===g){var k=i.formatting;n.highlightFormatting&&(i.formatting="code");var p=f(i),v=e.pos;e.eatWhile("`");var S=1+e.pos-v;return i.code?S===F?(i.code=!1,p):(i.formatting=k,f(i)):(F=S,i.code=!0,f(i))}if(i.code)return f(i);if("!"===g&&e.match(/\[[^\]]*\] ?(?:\(|\[)/,!1))return e.match(/\[[^\]]*\]/),i.inline=i.f=d,B;if("["===g&&e.match(/.*\](\(.*\)| ?\[.*\])/,!1))return i.linkText=!0,n.highlightFormatting&&(i.formatting="link"),f(i);if("]"===g&&i.linkText&&e.match(/\(.*\)| ?\[.*\]/,!1)){n.highlightFormatting&&(i.formatting="link");var s=f(i);return i.linkText=!1,i.inline=i.f=d,s}if("<"===g&&e.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/,!1)){i.f=i.inline=c,n.highlightFormatting&&(i.formatting="link");var s=f(i);return s?s+=" ":s="",s+_}if("<"===g&&e.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/,!1)){i.f=i.inline=c,n.highlightFormatting&&(i.formatting="link");var s=f(i);return s?s+=" ":s="",s+$}if("<"===g&&e.match(/^(!--|\w)/,!1)){var x=e.string.indexOf(">",e.pos);if(-1!=x){var L=e.string.substring(e.start,x);/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(L)&&(i.md_inside=!0)}return e.backUp(1),i.htmlState=t.startState(C),a(e,i,h)}if("<"===g&&e.match(/^\/\w*?>/))return i.md_inside=!1,"tag";var b=!1;if(!n.underscoresBreakWords&&"_"===g&&"_"!==e.peek()&&e.match(/(\w)/,!1)){var q=e.pos-2;if(q>=0){var M=e.string.charAt(q);"_"!==M&&M.match(/(\w)/,!1)&&(b=!0)}}if("*"===g||"_"===g&&!b)if(l&&" "===e.peek());else{if(i.strong===g&&e.eat(g)){n.highlightFormatting&&(i.formatting="strong");var p=f(i);return i.strong=!1,p}if(!i.strong&&e.eat(g))return i.strong=g,n.highlightFormatting&&(i.formatting="strong"),f(i);if(i.em===g){n.highlightFormatting&&(i.formatting="em");var p=f(i);return i.em=!1,p}if(!i.em)return i.em=g,n.highlightFormatting&&(i.formatting="em"),f(i)}else if(" "===g&&(e.eat("*")||e.eat("_"))){if(" "===e.peek())return f(i);e.backUp(1)}if(n.strikethrough)if("~"===g&&e.eatWhile(g)){if(i.strikethrough){n.highlightFormatting&&(i.formatting="strikethrough");var p=f(i);return i.strikethrough=!1,p}if(e.match(/^[^\s]/,!1))return i.strikethrough=!0,n.highlightFormatting&&(i.formatting="strikethrough"),f(i)}else if(" "===g&&e.match(/^~~/,!0)){if(" "===e.peek())return f(i);e.backUp(2)}return" "===g&&(e.match(/ +$/,!1)?i.trailingSpace++:i.trailingSpace&&(i.trailingSpaceNewLine=!0)),f(i)}function c(t,e){var i=t.next();if(">"===i){e.f=e.inline=m,n.highlightFormatting&&(e.formatting="link");var r=f(e);return r?r+=" ":r="",r+_}return t.match(/^[^>]+/,!0),_}function d(t,e){if(t.eatSpace())return null;var i=t.next();return"("===i||"["===i?(e.f=e.inline=k("("===i?")":"]"),n.highlightFormatting&&(e.formatting="link-string"),e.linkHref=!0,f(e)):"error"}function k(t){return function(e,i){var r=e.next();if(r===t){i.f=i.inline=m,n.highlightFormatting&&(i.formatting="link-string");var a=f(i);return i.linkHref=!1,a}return e.match(x(t),!0)&&e.backUp(1),i.linkHref=!0,f(i)}}function p(t,e){return t.match(/^[^\]]*\]:/,!1)?(e.f=v,t.next(),n.highlightFormatting&&(e.formatting="link"),e.linkText=!0,f(e)):r(t,e,m)}function v(t,e){if(t.match(/^\]:/,!0)){e.f=e.inline=S,n.highlightFormatting&&(e.formatting="link");var i=f(e);return e.linkText=!1,i}return t.match(/^[^\]]+/,!0),N}function S(t,e){return t.eatSpace()?null:(t.match(/^[^\s]+/,!0),void 0===t.peek()?e.linkTitle=!0:t.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/,!0),e.f=e.inline=m,E+" url")}function x(t){return J[t]||(t=(t+"").replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1"),J[t]=new RegExp("^(?:[^\\\\]|\\\\.)*?("+t+")")),J[t]}var L=t.modes.hasOwnProperty("xml"),C=t.getMode(e,L?{name:"xml",htmlMode:!0}:"text/plain");void 0===n.highlightFormatting&&(n.highlightFormatting=!1),void 0===n.maxBlockquoteDepth&&(n.maxBlockquoteDepth=0),void 0===n.underscoresBreakWords&&(n.underscoresBreakWords=!0),void 0===n.fencedCodeBlocks&&(n.fencedCodeBlocks=!1),void 0===n.taskLists&&(n.taskLists=!1),void 0===n.strikethrough&&(n.strikethrough=!1);var F=0,b="header",q="comment",M="quote",w="variable-2",D="variable-3",H="keyword",T="hr",B="tag",y="formatting",_="link",$="link",N="link",E="string",O="em",j="strong",W="strikethrough",U=/^([*\-_])(?:\s*\1){2,}\s*$/,R=/^[*\-+]\s+/,A=/^[0-9]+([.)])\s+/,I=/^\[(x| )\](?=\s)/,z=/^(#+)(?: |$)/,P=/^ *(?:\={1,}|-{1,})\s*$/,G=/^[^#!\[\]*_\\<>` "'(~]+/,J=[],K={startState:function(){return{f:l,prevLineHasContent:!1,thisLineHasContent:!1,block:l,htmlState:null,indentation:0,inline:m,text:u,formatting:!1,linkText:!1,linkHref:!1,linkTitle:!1,em:!1,strong:!1,header:0,hr:!1,taskList:!1,list:!1,listDepth:0,quote:0,trailingSpace:0,trailingSpaceNewLine:!1,strikethrough:!1}},copyState:function(e){return{f:e.f,prevLineHasContent:e.prevLineHasContent,thisLineHasContent:e.thisLineHasContent,block:e.block,htmlState:e.htmlState&&t.copyState(C,e.htmlState),indentation:e.indentation,localMode:e.localMode,localState:e.localMode?t.copyState(e.localMode,e.localState):null,inline:e.inline,text:e.text,formatting:!1,linkTitle:e.linkTitle,em:e.em,strong:e.strong,strikethrough:e.strikethrough,header:e.header,hr:e.hr,taskList:e.taskList,list:e.list,listDepth:e.listDepth,quote:e.quote,indentedCode:e.indentedCode,trailingSpace:e.trailingSpace,trailingSpaceNewLine:e.trailingSpaceNewLine,md_inside:e.md_inside}},token:function(t,e){if(e.formatting=!1,t.sol()){var n=!!e.header||e.hr;if(e.header=0,e.hr=!1,t.match(/^\s*$/,!0)||n)return e.prevLineHasContent=!1,o(e),n?this.token(t,e):null;e.prevLineHasContent=e.thisLineHasContent,e.thisLineHasContent=!0,e.taskList=!1,e.code=!1,e.trailingSpace=0,e.trailingSpaceNewLine=!1,e.f=e.block;var i=t.match(/^\s*/,!0)[0].replace(/\t/g,"    ").length,r=4*Math.floor((i-e.indentation)/4);r>4&&(r=4);var a=e.indentation+r;if(e.indentationDiff=a-e.indentation,e.indentation=a,i>0)return null}return e.f(t,e)},innerMode:function(t){return t.block==h?{state:t.htmlState,mode:C}:t.localState?{state:t.localState,mode:t.localMode}:{state:t,mode:K}},blankLine:o,getType:f,fold:"markdown"};return K},"xml"),t.defineMIME("text/x-markdown","markdown")});