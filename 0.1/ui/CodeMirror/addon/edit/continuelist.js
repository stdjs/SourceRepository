!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}(function(e){"use strict";var n=/^(\s*)(>[> ]*|[*+-]\s|(\d+)([.)]))(\s*)/,t=/^(\s*)(>[> ]*|[*+-]|(\d+)[.)])(\s*)$/,i=/[*+-]\s/;e.commands.newlineAndIndentContinueMarkdownList=function(o){if(o.getOption("disableInput"))return e.Pass;for(var r=o.listSelections(),s=[],d=0;d<r.length;d++){var l=r[d].head,c=o.getStateAfter(l.line),a=c.list!==!1,f=0!==c.quote,u=o.getLine(l.line),p=n.exec(u);if(!r[d].empty()||!a&&!f||!p)return void o.execCommand("newlineAndIndent");if(t.test(u))o.replaceRange("",{line:l.line,ch:0},{line:l.line,ch:l.ch+1}),s[d]="\n";else{var m=p[1],b=p[5],g=i.test(p[2])||p[2].indexOf(">")>=0?p[2]:parseInt(p[3],10)+1+p[4];s[d]="\n"+m+g+b}}o.replaceSelections(s)}});