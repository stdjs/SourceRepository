Std.ui.module("RadioBox",{parent:"widget",events:"change",option:{level:1,defaultClass:"StdUI_RadioBox",text:"RadioBox",value:!1,valueType:"bool"},action:{content:"text"},"private":{checked:!1},"static":{connect:function(e){return new(Std.ui("RadioBox").connection)(e)},connection:Std.module({"public":{change:function(e){var t=this;Std.each(t.radios,function(t,n){n.widget!==e&&n.widget.checked(!1)})},connect:Std.func(function(e){if(e instanceof Std.ui("RadioBox")){var t=this,n=function(n){n===!0&&t.change(t.current=e)};t.radios.push({widget:e.checked(!1),handle:n}),e.on("change",n)}},{each:[isArray]}),disconnect:Std.func(function(e){Std.each(this.radios,function(t,n){return n.widget===e?(e.off("change",n.handle),this.remove(t),!1):void 0})},{each:[isArray]}),value:function(e){return void 0===e?this.current?this.current.value():null:void Std.each(this.radios,function(t,n){return n.widget.value()===e?(n.widget.checked(!0),!1):void 0})}},main:function(e){var t=this;t.radios=[],t.connect(e)}})},"protected":{initEvents:function(){var e=this;e[0].mouse({click:function(){e.enable()&&!e.checked()&&e.checked(!0)}})}},"public":{valueType:function(e){return this.opt("valueType",e)},text:function(e){return this.opt("text",e,function(){this[2].html(e)})},checked:function(e){var t=this;return void 0===e?t._checked:(t._checked!==e&&(t.toggleClass("checked",t._checked=e),t.renderState&&t.emit("change",e)),t)},value:function(e){var t=this,n=t.valueType();return void 0===e?"any"==n?t.opts.value:"bool"==n?t.checked():~~t.checked():("any"==n?t.opts.value=e:t.checked(Boolean(e)),t)}},main:function(e,t,n){n.append([e[1]=newDiv("_icon StdUI_RadioBox_Icon"),e[2]=newDom("label","_text")]),e.call_opts(["text","value"]),e.initEvents()}});