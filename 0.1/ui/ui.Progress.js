Std.model("ui.Progress",{parent:"widget",events:"finished change",action:{content:"value"},option:{defaultClass:"StdUI_Progress",level:3,min:0,max:100,value:0,text:"%.2f%%",color:"blue"},extend:{width:function(t){var e=this,i=e.D;isNumber(t)||(t=e.width()),i.texts.width(t-e.boxSize.width),e.refresh()},height:function(t){var e=this,i=this.D;isNumber(t)||(t=e.height()),i.location.height(t-=e.boxSize.height),i.texts.css({height:t,lineHeight:t})}},"protected":{updateProgress:function(){var t=this,e=t.opts,i=e.width;return isNumber(i)||(i=t.width()-t.boxSize.width),t.D.location.width(int((t.value()-e.min)*(i/(e.max-e.min)))),t.text(e.text)}},"public":{refresh:function(){return this.value(this.opts.value)},min:function(t){return this.opt("min",t,function(){this.refresh()})},max:function(t){return this.opt("max",t,function(){this.refresh()})},range:function(t,e){var i=this,n=i.opts;return void 0===t?{min:n.min,max:n.max}:i.refresh(n.min=t,n.max=e)},percent:function(t){var e=this,i=e.opts;return void 0==t?Std.convert.percent(int(i.value-i.min),i.max-i.min):e.value(int((i.max-i.min)*t/100))},color:function(t){var e=this,i=e.opts;return void 0===t?i.color:(e[0].removeClass("-"+i.color).addClass("-"+(i.color=t)),e)},text:function(t){var e=this,i=e.D;return e.opt("text",t,function(){i.texts.html(sprintf(t,e.percent(),e.value(),e.range().max))})},value:function(t){var e=this,i=e.opts;return void 0===t?i.value:(t>i.max?t=i.max:t<i.min&&(t=i.min),i.max==t?e.addClass("-finished").emit("finished"):i.value==i.max&&i.max!=t&&e.removeClass("-finished"),i.value!==t&&e.emit("change",i.value=float(t)),e.updateProgress())}},main:function(t,e,i){var n=t.D={};i.addClass("-"+e.color).append([n.text=newDiv("_text"),n.location=newDiv("_location").append(n.text2=newDiv("_text"))]),n.texts=Std.dom.united([n.text,n.text2])}}),Std.ui.module("CProgress",{model:"ui.Progress",option:{width:128,height:128,minHeight:64,minWidth:64,color:"blue"},"private":{direction:"circle"}}),Std.ui.module("HProgress",{model:"ui.Progress",option:{height:26,minWidth:35,minHeight:15},"private":{direction:"horizontal"}}),Std.ui.module("VProgress",{model:"ui.Progress",option:{width:26,minHeight:35,minWidth:15},"private":{direction:"vertical"}});