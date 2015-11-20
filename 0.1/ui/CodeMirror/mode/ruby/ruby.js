!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){"use strict";e.defineMode("ruby",function(e){function t(e){for(var t={},n=0,r=e.length;r>n;++n)t[e[n]]=!0;return t}function n(e,t,n){return n.tokenize.push(e),e(t,n)}function r(e,t){if(e.sol()&&e.match("=begin")&&e.eol())return t.tokenize.push(f),"comment";if(e.eatSpace())return null;var r,i=e.next();if("`"==i||"'"==i||'"'==i)return n(a(i,"string",'"'==i||"`"==i),e,t);if("/"==i){var o=e.current().length;if(e.skipTo("/")){var d=e.current().length;e.backUp(e.current().length-o);for(var c=0;e.current().length<d;){var s=e.next();if("("==s?c+=1:")"==s&&(c-=1),0>c)break}if(e.backUp(e.current().length-o),0==c)return n(a(i,"string-2",!0),e,t)}return"operator"}if("%"==i){var k="string",h=!0;e.eat("s")?k="atom":e.eat(/[WQ]/)?k="string":e.eat(/[r]/)?k="string-2":e.eat(/[wxq]/)&&(k="string",h=!1);var m=e.eat(/[^\w\s=]/);return m?(p.propertyIsEnumerable(m)&&(m=p[m]),n(a(m,k,h,!0),e,t)):"operator"}if("#"==i)return e.skipToEnd(),"comment";if("<"==i&&(r=e.match(/^<-?[\`\"\']?([a-zA-Z_?]\w*)[\`\"\']?(?:;|$)/)))return n(u(r[1]),e,t);if("0"==i)return e.eatWhile(e.eat("x")?/[\da-fA-F]/:e.eat("b")?/[01]/:/[0-7]/),"number";if(/\d/.test(i))return e.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+\-]?[\d_]+)?/),"number";if("?"==i){for(;e.match(/^\\[CM]-/););return e.eat("\\")?e.eatWhile(/\w/):e.next(),"string"}if(":"==i)return e.eat("'")?n(a("'","atom",!1),e,t):e.eat('"')?n(a('"',"atom",!0),e,t):e.eat(/[\<\>]/)?(e.eat(/[\<\>]/),"atom"):e.eat(/[\+\-\*\/\&\|\:\!]/)?"atom":e.eat(/[a-zA-Z$@_\xa1-\uffff]/)?(e.eatWhile(/[\w$\xa1-\uffff]/),e.eat(/[\?\!\=]/),"atom"):"operator";if("@"==i&&e.match(/^@?[a-zA-Z_\xa1-\uffff]/))return e.eat("@"),e.eatWhile(/[\w\xa1-\uffff]/),"variable-2";if("$"==i)return e.eat(/[a-zA-Z_]/)?e.eatWhile(/[\w]/):e.eat(/\d/)?e.eat(/\d/):e.next(),"variable-3";if(/[a-zA-Z_\xa1-\uffff]/.test(i))return e.eatWhile(/[\w\xa1-\uffff]/),e.eat(/[\?\!]/),e.eat(":")?"atom":"ident";if("|"!=i||!t.varList&&"{"!=t.lastTok&&"do"!=t.lastTok){if(/[\(\)\[\]{}\\;]/.test(i))return l=i,null;if("-"==i&&e.eat(">"))return"arrow";if(/[=+\-\/*:\.^%<>~|]/.test(i)){var x=e.eatWhile(/[=+\-\/*:\.^%<>~|]/);return"."!=i||x||(l="."),"operator"}return null}return l="|",null}function i(e){return e||(e=1),function(t,n){if("}"==t.peek()){if(1==e)return n.tokenize.pop(),n.tokenize[n.tokenize.length-1](t,n);n.tokenize[n.tokenize.length-1]=i(e-1)}else"{"==t.peek()&&(n.tokenize[n.tokenize.length-1]=i(e+1));return r(t,n)}}function o(){var e=!1;return function(t,n){return e?(n.tokenize.pop(),n.tokenize[n.tokenize.length-1](t,n)):(e=!0,r(t,n))}}function a(e,t,n,r){return function(a,u){var f,l=!1;for("read-quoted-paused"===u.context.type&&(u.context=u.context.prev,a.eat("}"));null!=(f=a.next());){if(f==e&&(r||!l)){u.tokenize.pop();break}if(n&&"#"==f&&!l){if(a.eat("{")){"}"==e&&(u.context={prev:u.context,type:"read-quoted-paused"}),u.tokenize.push(i());break}if(/[@\$]/.test(a.peek())){u.tokenize.push(o());break}}l=!l&&"\\"==f}return t}}function u(e){return function(t,n){return t.match(e)?n.tokenize.pop():t.skipToEnd(),"string"}}function f(e,t){return e.sol()&&e.match("=end")&&e.eol()&&t.tokenize.pop(),e.skipToEnd(),"comment"}var l,d=t(["alias","and","BEGIN","begin","break","case","class","def","defined?","do","else","elsif","END","end","ensure","false","for","if","in","module","next","not","or","redo","rescue","retry","return","self","super","then","true","undef","unless","until","when","while","yield","nil","raise","throw","catch","fail","loop","callcc","caller","lambda","proc","public","protected","private","require","load","require_relative","extend","autoload","__END__","__FILE__","__LINE__","__dir__"]),c=t(["def","class","case","for","while","module","then","catch","loop","proc","begin"]),s=t(["end","until"]),p={"[":"]","{":"}","(":")"};return{startState:function(){return{tokenize:[r],indented:0,context:{type:"top",indented:-e.indentUnit},continuedLine:!1,lastTok:null,varList:!1}},token:function(e,t){l=null,e.sol()&&(t.indented=e.indentation());var n,r=t.tokenize[t.tokenize.length-1](e,t),i=l;if("ident"==r){var o=e.current();r="."==t.lastTok?"property":d.propertyIsEnumerable(e.current())?"keyword":/^[A-Z]/.test(o)?"tag":"def"==t.lastTok||"class"==t.lastTok||t.varList?"def":"variable","keyword"==r&&(i=o,c.propertyIsEnumerable(o)?n="indent":s.propertyIsEnumerable(o)?n="dedent":"if"!=o&&"unless"!=o||e.column()!=e.indentation()?"do"==o&&t.context.indented<t.indented&&(n="indent"):n="indent")}return(l||r&&"comment"!=r)&&(t.lastTok=i),"|"==l&&(t.varList=!t.varList),"indent"==n||/[\(\[\{]/.test(l)?t.context={prev:t.context,type:l||r,indented:t.indented}:("dedent"==n||/[\)\]\}]/.test(l))&&t.context.prev&&(t.context=t.context.prev),e.eol()&&(t.continuedLine="\\"==l||"operator"==r),r},indent:function(t,n){if(t.tokenize[t.tokenize.length-1]!=r)return 0;var i=n&&n.charAt(0),o=t.context,a=o.type==p[i]||"keyword"==o.type&&/^(?:end|until|else|elsif|when|rescue)\b/.test(n);return o.indented+(a?0:e.indentUnit)+(t.continuedLine?e.indentUnit:0)},electricChars:"}de",lineComment:"#"}}),e.defineMIME("text/x-ruby","ruby")});