!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){"use strict";e.defineMode("cmake",function(){function e(e,n){for(var t,i,r=!1;!e.eol()&&(t=e.next())!=n.pending;){if("$"===t&&"\\"!=i&&'"'==n.pending){r=!0;break}i=t}return r&&e.backUp(1),n.continueString=t==n.pending?!1:!0,"string"}function n(n,i){var r=n.next();return"$"===r?n.match(t)?"variable-2":"variable":i.continueString?(n.backUp(1),e(n,i)):n.match(/(\s+)?\w+\(/)||n.match(/(\s+)?\w+\ \(/)?(n.backUp(1),"def"):"#"==r?(n.skipToEnd(),"comment"):"'"==r||'"'==r?(i.pending=r,e(n,i)):"("==r||")"==r?"bracket":r.match(/[0-9]/)?"number":(n.eatWhile(/[\w-]/),null)}var t=/({)?[a-zA-Z0-9_]+(})?/;return{startState:function(){var e={};return e.inDefinition=!1,e.inInclude=!1,e.continueString=!1,e.pending=!1,e},token:function(e,t){return e.eatSpace()?null:n(e,t)}}}),e.defineMIME("text/x-cmake","cmake")});