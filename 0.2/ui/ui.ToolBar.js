/**
    Std UI Kit Library
    http://ui.stdjs.com
	module: ToolBar
*/
Std.ui.module("ToolBar",{b:"widget",e:{level:3,minHeight:20,iconWidth:24,iconHeight:24,items:null,styleType:"textBesideIcon",defaultClass:"StdUI_ToolBar"},g:{beforeRender:function(){this._items.items(function(t,e){isFunction(e.render)&&e.render()})},height:function(t){var e=this;isNumber(t)||(t=e.height()),e._items.items(function(i,n){var s=0;"sep"===n.ui?n.height(s=t-e.boxSize.height-e.boxSize.extraHeight):s=n.height(),s>t&&n.height(s=t),Std.dom(n).css("marginTop",(t-s)/2)})},enable:function(t){var e=this;e._items.items(function(e,i){isWidget(i)&&i.enable(t)})},destroy:function(){this.clear()},remove:function(t){var e=this,i=null;isObject(t)&&(t=e._items.indexOf(t)),(isNumber(t)||isString(t))&&(i=e._items.items(t))&&(i.destroy(),e._items.remove(t))}},i:{createTool:function(t,e){var i=this,n=i.opts,s=null;if(null==e&&(e=t,t=null),isWidget(e))s=e;else if(isString(e))s=Std.ui("ToolButton",{text:e,styleType:n.styleType,iconWidth:n.iconWidth,iconHeight:n.iconHeight});else if(Std.is.action(e))s=Std.ui("ToolButton",{styleType:n.styleType,action:e});else if(isObject(e)){var o={iconWidth:n.iconWidth,iconHeight:n.iconHeight};e.ui&&"ToolButton"===e.ui||e.styleType||(o.styleType=n.styleType),s=Std.ui(e.ui||"ToolButton",Std.extend(o,e))}return isWidget(s)&&(s.parent(i),isString(t)&&s.name(t)),s}},j:{items:function(t,e){return this._items.items(t,e)},itemCount:function(){return this._items.length},insertSep:function(t){return this.insert({ui:"sep"},t)},appendSep:function(){return this.append({ui:"sep"})},insert:function(t,e,i){var n=this,s=null;return n._items.insert(t,e,i,function(e){return(s=n.createTool(e))&&isString(t)&&s.name(t),s}),isObject(s)?(n.DOMMap.buttons.insert(Std.dom.get(s),i),n.rendered&&s.render(),n):!1},append:Std.func(function(t,e){this.insert(t,e)},{each:[isArray]}),clear:function(){var t=this,e=t._items;return e.items(function(t,e){e.destroy()}),e.clear(),t}},k:function(t,e,i){t._items=Std.items(),t.DOMMap={buttons:newDiv("_buttons").appendTo(i)},e.items&&t.append(e.items)},m:{rule:{children:"append"},html:{create:function(t){var e=this.opts,i=this,n=function(t){return Std.each("styleType iconWidth iconHeight",function(i,n){n in e&&(t[n]=e[n])}),t},s=function(t){var e=t.trimHTML(),i=n({icon:t.attr("std-icon"),name:t.attr("std-name"),action:t.attr("std-action")});return isEmpty(e)||(i.text=e),Std.extend(i,Std.options.get(t))};t.children(function(t,e){var n=null,o=e.attr("std-ui");n=isString(o)&&Std.ui(o)?Std.ui.build(e,!1,{}):s(e),i.append(e.attr("std-name"),n)})}}}});