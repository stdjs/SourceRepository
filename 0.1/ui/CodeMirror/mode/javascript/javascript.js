!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){"use strict";e.defineMode("javascript",function(t,r){function n(e){for(var t,r=!1,n=!1;null!=(t=e.next());){if(!r){if("/"==t&&!n)return;"["==t?n=!0:n&&"]"==t&&(n=!1)}r=!r&&"\\"==t}}function a(e,t,r){return kt=e,bt=r,t}function i(e,t){var r=e.next();if('"'==r||"'"==r)return t.tokenize=o(r),t.tokenize(e,t);if("."==r&&e.match(/^\d+(?:[eE][+\-]?\d+)?/))return a("number","number");if("."==r&&e.match(".."))return a("spread","meta");if(/[\[\]{}\(\),;\:\.]/.test(r))return a(r);if("="==r&&e.eat(">"))return a("=>","operator");if("0"==r&&e.eat(/x/i))return e.eatWhile(/[\da-f]/i),a("number","number");if(/\d/.test(r))return e.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/),a("number","number");if("/"==r)return e.eat("*")?(t.tokenize=c,c(e,t)):e.eat("/")?(e.skipToEnd(),a("comment","comment")):"operator"==t.lastType||"keyword c"==t.lastType||"sof"==t.lastType||/^[\[{}\(,;:]$/.test(t.lastType)?(n(e),e.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/),a("regexp","string-2")):(e.eatWhile(Et),a("operator","operator",e.current()));if("`"==r)return t.tokenize=u,u(e,t);if("#"==r)return e.skipToEnd(),a("error","error");if(Et.test(r))return e.eatWhile(Et),a("operator","operator",e.current());if(Mt.test(r)){e.eatWhile(Mt);var i=e.current(),l=Vt.propertyIsEnumerable(i)&&Vt[i];return l&&"."!=t.lastType?a(l.type,l.style,i):a("variable","variable",i)}}function o(e){return function(t,r){var n,o=!1;if(gt&&"@"==t.peek()&&t.match(It))return r.tokenize=i,a("jsonld-keyword","meta");for(;null!=(n=t.next())&&(n!=e||o);)o=!o&&"\\"==n;return o||(r.tokenize=i),a("string","string")}}function c(e,t){for(var r,n=!1;r=e.next();){if("/"==r&&n){t.tokenize=i;break}n="*"==r}return a("comment","comment")}function u(e,t){for(var r,n=!1;null!=(r=e.next());){if(!n&&("`"==r||"$"==r&&e.eat("{"))){t.tokenize=i;break}n=!n&&"\\"==r}return a("quasi","string-2",e.current())}function l(e,t){t.fatArrowAt&&(t.fatArrowAt=null);var r=e.string.indexOf("=>",e.start);if(!(0>r)){for(var n=0,a=!1,i=r-1;i>=0;--i){var o=e.string.charAt(i),c=zt.indexOf(o);if(c>=0&&3>c){if(!n){++i;break}if(0==--n)break}else if(c>=3&&6>c)++n;else if(Mt.test(o))a=!0;else{if(/["'\/]/.test(o))return;if(a&&!n){++i;break}}}a&&!n&&(t.fatArrowAt=i)}}function s(e,t,r,n,a,i){this.indented=e,this.column=t,this.type=r,this.prev=a,this.info=i,null!=n&&(this.align=n)}function f(e,t){for(var r=e.localVars;r;r=r.next)if(r.name==t)return!0;for(var n=e.context;n;n=n.prev)for(var r=n.vars;r;r=r.next)if(r.name==t)return!0}function d(e,t,r,n,a){var i=e.cc;for(At.state=e,At.stream=a,At.marked=null,At.cc=i,At.style=t,e.lexical.hasOwnProperty("align")||(e.lexical.align=!0);;){var o=i.length?i.pop():wt?w:g;if(o(r,n)){for(;i.length&&i[i.length-1].lex;)i.pop()();return At.marked?At.marked:"variable"==r&&f(e,n)?"variable-2":t}}}function p(){for(var e=arguments.length-1;e>=0;e--)At.cc.push(arguments[e])}function v(){return p.apply(null,arguments),!0}function m(e){function t(t){for(var r=t;r;r=r.next)if(r.name==e)return!0;return!1}var n=At.state;if(n.context){if(At.marked="def",t(n.localVars))return;n.localVars={name:e,next:n.localVars}}else{if(t(n.globalVars))return;r.globalVars&&(n.globalVars={name:e,next:n.globalVars})}}function y(){At.state.context={prev:At.state.context,vars:At.state.localVars},At.state.localVars=Ct}function k(){At.state.localVars=At.state.context.vars,At.state.context=At.state.context.prev}function b(e,t){var r=function(){var r=At.state,n=r.indented;if("stat"==r.lexical.type)n=r.lexical.indented;else for(var a=r.lexical;a&&")"==a.type&&a.align;a=a.prev)n=a.indented;r.lexical=new s(n,At.stream.column(),e,null,r.lexical,t)};return r.lex=!0,r}function x(){var e=At.state;e.lexical.prev&&(")"==e.lexical.type&&(e.indented=e.lexical.indented),e.lexical=e.lexical.prev)}function h(e){function t(r){return r==e?v():";"==e?p():v(t)}return t}function g(e,t){return"var"==e?v(b("vardef",t.length),G,h(";"),x):"keyword a"==e?v(b("form"),w,g,x):"keyword b"==e?v(b("form"),g,x):"{"==e?v(b("}"),H,x):";"==e?v():"if"==e?("else"==At.state.lexical.info&&At.state.cc[At.state.cc.length-1]==x&&At.state.cc.pop()(),v(b("form"),w,g,x,R)):"function"==e?v(tt):"for"==e?v(b("form"),X,g,x):"variable"==e?v(b("stat"),q):"switch"==e?v(b("form"),w,b("}","switch"),h("{"),H,x,x):"case"==e?v(w,h(":")):"default"==e?v(h(":")):"catch"==e?v(b("form"),y,h("("),rt,h(")"),g,x,k):"module"==e?v(b("form"),y,ct,k,x):"class"==e?v(b("form"),nt,x):"export"==e?v(b("form"),ut,x):"import"==e?v(b("form"),lt,x):p(b("stat"),w,h(";"),x)}function w(e){return M(e,!1)}function j(e){return M(e,!0)}function M(e,t){if(At.state.fatArrowAt==At.stream.start){var r=t?$:C;if("("==e)return v(y,b(")"),N(J,")"),x,h("=>"),r,k);if("variable"==e)return p(y,J,h("=>"),r,k)}var n=t?z:I;return Tt.hasOwnProperty(e)?v(n):"function"==e?v(tt,n):"keyword c"==e?v(t?E:V):"("==e?v(b(")"),V,mt,h(")"),x,n):"operator"==e||"spread"==e?v(t?j:w):"["==e?v(b("]"),pt,x,n):"{"==e?B(P,"}",null,n):"quasi"==e?p(T,n):v()}function V(e){return e.match(/[;\}\)\],]/)?p():p(w)}function E(e){return e.match(/[;\}\)\],]/)?p():p(j)}function I(e,t){return","==e?v(w):z(e,t,!1)}function z(e,t,r){var n=0==r?I:z,a=0==r?w:j;return"=>"==e?v(y,r?$:C,k):"operator"==e?/\+\+|--/.test(t)?v(n):"?"==t?v(w,h(":"),a):v(a):"quasi"==e?p(T,n):";"!=e?"("==e?B(j,")","call",n):"."==e?v(O,n):"["==e?v(b("]"),V,h("]"),x,n):void 0:void 0}function T(e,t){return"quasi"!=e?p():"${"!=t.slice(t.length-2)?v(T):v(w,A)}function A(e){return"}"==e?(At.marked="string-2",At.state.tokenize=u,v(T)):void 0}function C(e){return l(At.stream,At.state),p("{"==e?g:w)}function $(e){return l(At.stream,At.state),p("{"==e?g:j)}function q(e){return":"==e?v(x,g):p(I,h(";"),x)}function O(e){return"variable"==e?(At.marked="property",v()):void 0}function P(e,t){return"variable"==e||"keyword"==At.style?(At.marked="property",v("get"==t||"set"==t?S:W)):"number"==e||"string"==e?(At.marked=gt?"property":At.style+" property",v(W)):"jsonld-keyword"==e?v(W):"["==e?v(w,h("]"),W):void 0}function S(e){return"variable"!=e?p(W):(At.marked="property",v(tt))}function W(e){return":"==e?v(j):"("==e?p(tt):void 0}function N(e,t){function r(n){if(","==n){var a=At.state.lexical;return"call"==a.info&&(a.pos=(a.pos||0)+1),v(e,r)}return n==t?v():v(h(t))}return function(n){return n==t?v():p(e,r)}}function B(e,t,r){for(var n=3;n<arguments.length;n++)At.cc.push(arguments[n]);return v(b(t,r),N(e,t),x)}function H(e){return"}"==e?v():p(g,H)}function U(e){return jt&&":"==e?v(F):void 0}function D(e,t){return"="==t?v(j):void 0}function F(e){return"variable"==e?(At.marked="variable-3",v()):void 0}function G(){return p(J,U,L,Q)}function J(e,t){return"variable"==e?(m(t),v()):"["==e?B(J,"]"):"{"==e?B(K,"}"):void 0}function K(e,t){return"variable"!=e||At.stream.match(/^\s*:/,!1)?("variable"==e&&(At.marked="property"),v(h(":"),J,L)):(m(t),v(L))}function L(e,t){return"="==t?v(j):void 0}function Q(e){return","==e?v(G):void 0}function R(e,t){return"keyword b"==e&&"else"==t?v(b("form","else"),g,x):void 0}function X(e){return"("==e?v(b(")"),Y,h(")"),x):void 0}function Y(e){return"var"==e?v(G,h(";"),_):";"==e?v(_):"variable"==e?v(Z):p(w,h(";"),_)}function Z(e,t){return"in"==t||"of"==t?(At.marked="keyword",v(w)):v(I,_)}function _(e,t){return";"==e?v(et):"in"==t||"of"==t?(At.marked="keyword",v(w)):p(w,h(";"),et)}function et(e){")"!=e&&v(w)}function tt(e,t){return"*"==t?(At.marked="keyword",v(tt)):"variable"==e?(m(t),v(tt)):"("==e?v(y,b(")"),N(rt,")"),x,g,k):void 0}function rt(e){return"spread"==e?v(rt):p(J,U,D)}function nt(e,t){return"variable"==e?(m(t),v(at)):void 0}function at(e,t){return"extends"==t?v(w,at):"{"==e?v(b("}"),it,x):void 0}function it(e,t){return"variable"==e||"keyword"==At.style?"static"==t?(At.marked="keyword",v(it)):(At.marked="property","get"==t||"set"==t?v(ot,tt,it):v(tt,it)):"*"==t?(At.marked="keyword",v(it)):";"==e?v(it):"}"==e?v():void 0}function ot(e){return"variable"!=e?p():(At.marked="property",v())}function ct(e,t){return"string"==e?v(g):"variable"==e?(m(t),v(dt)):void 0}function ut(e,t){return"*"==t?(At.marked="keyword",v(dt,h(";"))):"default"==t?(At.marked="keyword",v(w,h(";"))):p(g)}function lt(e){return"string"==e?v():p(st,dt)}function st(e,t){return"{"==e?B(st,"}"):("variable"==e&&m(t),"*"==t&&(At.marked="keyword"),v(ft))}function ft(e,t){return"as"==t?(At.marked="keyword",v(st)):void 0}function dt(e,t){return"from"==t?(At.marked="keyword",v(w)):void 0}function pt(e){return"]"==e?v():p(j,vt)}function vt(e){return"for"==e?p(mt,h("]")):","==e?v(N(E,"]")):p(N(j,"]"))}function mt(e){return"for"==e?v(X,mt):"if"==e?v(w,mt):void 0}function yt(e,t){return"operator"==e.lastType||","==e.lastType||Et.test(t.charAt(0))||/[,.]/.test(t.charAt(0))}var kt,bt,xt=t.indentUnit,ht=r.statementIndent,gt=r.jsonld,wt=r.json||gt,jt=r.typescript,Mt=r.wordCharacters||/[\w$\xa1-\uffff]/,Vt=function(){function e(e){return{type:e,style:"keyword"}}var t=e("keyword a"),r=e("keyword b"),n=e("keyword c"),a=e("operator"),i={type:"atom",style:"atom"},o={"if":e("if"),"while":t,"with":t,"else":r,"do":r,"try":r,"finally":r,"return":n,"break":n,"continue":n,"new":n,"delete":n,"throw":n,"debugger":n,"var":e("var"),"const":e("var"),let:e("var"),"function":e("function"),"catch":e("catch"),"for":e("for"),"switch":e("switch"),"case":e("case"),"default":e("default"),"in":a,"typeof":a,"instanceof":a,"true":i,"false":i,"null":i,undefined:i,NaN:i,Infinity:i,"this":e("this"),module:e("module"),"class":e("class"),"super":e("atom"),"yield":n,"export":e("export"),"import":e("import"),"extends":n};if(jt){var c={type:"variable",style:"variable-3"},u={"interface":e("interface"),"extends":e("extends"),constructor:e("constructor"),"public":e("public"),"private":e("private"),"protected":e("protected"),"static":e("static"),string:c,number:c,bool:c,any:c};for(var l in u)o[l]=u[l]}return o}(),Et=/[+\-*&%=<>!?|~^]/,It=/^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/,zt="([{}])",Tt={atom:!0,number:!0,variable:!0,string:!0,regexp:!0,"this":!0,"jsonld-keyword":!0},At={state:null,column:null,marked:null,cc:null},Ct={name:"this",next:{name:"arguments"}};return x.lex=!0,{startState:function(e){var t={tokenize:i,lastType:"sof",cc:[],lexical:new s((e||0)-xt,0,"block",!1),localVars:r.localVars,context:r.localVars&&{vars:r.localVars},indented:0};return r.globalVars&&"object"==typeof r.globalVars&&(t.globalVars=r.globalVars),t},token:function(e,t){if(e.sol()&&(t.lexical.hasOwnProperty("align")||(t.lexical.align=!1),t.indented=e.indentation(),l(e,t)),t.tokenize!=c&&e.eatSpace())return null;var r=t.tokenize(e,t);return"comment"==kt?r:(t.lastType="operator"!=kt||"++"!=bt&&"--"!=bt?kt:"incdec",d(t,r,kt,bt,e))},indent:function(t,n){if(t.tokenize==c)return e.Pass;if(t.tokenize!=i)return 0;var a=n&&n.charAt(0),o=t.lexical;if(!/^\s*else\b/.test(n))for(var u=t.cc.length-1;u>=0;--u){var l=t.cc[u];if(l==x)o=o.prev;else if(l!=R)break}"stat"==o.type&&"}"==a&&(o=o.prev),ht&&")"==o.type&&"stat"==o.prev.type&&(o=o.prev);var s=o.type,f=a==s;return"vardef"==s?o.indented+("operator"==t.lastType||","==t.lastType?o.info+1:0):"form"==s&&"{"==a?o.indented:"form"==s?o.indented+xt:"stat"==s?o.indented+(yt(t,n)?ht||xt:0):"switch"!=o.info||f||0==r.doubleIndentSwitch?o.align?o.column+(f?0:1):o.indented+(f?0:xt):o.indented+(/^(?:case|default)\b/.test(n)?xt:2*xt)},electricInput:/^\s*(?:case .*?:|default:|\{|\})$/,blockCommentStart:wt?null:"/*",blockCommentEnd:wt?null:"*/",lineComment:wt?null:"//",fold:"brace",closeBrackets:"()[]{}''\"\"``",helperType:wt?"json":"javascript",jsonldMode:gt,jsonMode:wt}}),e.registerHelper("wordChars","javascript",/[\w$]/),e.defineMIME("text/javascript","javascript"),e.defineMIME("text/ecmascript","javascript"),e.defineMIME("application/javascript","javascript"),e.defineMIME("application/x-javascript","javascript"),e.defineMIME("application/ecmascript","javascript"),e.defineMIME("application/json",{name:"javascript",json:!0}),e.defineMIME("application/x-json",{name:"javascript",json:!0}),e.defineMIME("application/ld+json",{name:"javascript",jsonld:!0}),e.defineMIME("text/typescript",{name:"javascript",typescript:!0}),e.defineMIME("application/typescript",{name:"javascript",typescript:!0})});