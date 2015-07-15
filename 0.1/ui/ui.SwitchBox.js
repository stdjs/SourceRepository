/**
 * SwitchBox module
*/
Std.ui.module("SwitchBox",{
    /*#module option:parent]*/
    parent:"widget",
    /*#module option:events]*/
    events:"change",
    /*#module option:option]*/
    option:{
        level:1,
        defaultClass:"StdUI_SwitchBox",
        height:26,
        value:null,
        items:null,
        styleType:"default"
    },
    /*#module option:action]*/
    action:{
        content:"value"
    },
    /*#module option:private]*/
    private:{
        /*
         * selected
        */
        selected:null
    },
    /*#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            that.call_opts(["styleType","value"]);
            that.repaint();
        },
        /*
         * extend height
        */
        height:function(height){
            var that = this;

            if(!isNumber(height)){
                height = that.height();
            }
            that[0].lineHeight(height -= that.boxSize.height);
            that[1] && that[1].height(height - 2).lineHeight(height - 2);
        }
    },
    /*#module option:protected]*/
    protected:{
        /*
         * length
        */
        length:0,
        /*
         * init handle
        */
        initHandle:function(){
            var that = this;

            if(that[1] == undefined){
                var height = that.height() - that.boxSize.height - 2;

                that[1] = newDiv("_handle").appendTo(that[0]);
                that[1].height(height).lineHeight(height);
            }
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].unselect(true).delegate("click","._item",function(e){
                if(!that.enable()){
                    return;
                }
                var index = this.index("._item");
                var item  = that.items[index];

                if(item !== that._selected){
                    that._selected = item;
                    that.emit("change",that.opts.value = item.value);
                }
                that.initHandle()[1].html(item.dom.html()).animate({
                    to:{
                        width:item.dom.width() - 2,
                        left:item.dom.offsetLeft()
                    }
                },100);
            });
            return that;
        }
    },
    /*#module option:public]*/
    public:{
        /*
         * style type
        */
        styleType:function(styleType){
            return this.opt("styleType",styleType,function(){
                this.addClass("_" + styleType);
            });
        },
        /*
         * refresh
        */
        refresh:function(){
            var that     = this;
            var width    = that.opts.width;
            var selected = that._selected;

            if(selected === null){
                return that;
            }
            if(!that[1]){
                that.initHandle();
            }
            if(width === "auto"){
                width = selected.dom.outerWidth();
            }else{
                width = width / that.length - that.boxSize.width;
            }
            that[1].dom.innerHTML = selected.dom.html();
            that[1].css({
                left  : selected.dom.offsetLeft(),
                width : width - 2
            });
            return that;
        },
        /*
         * repaint
        */
        repaint:function(){
            var that     = this;
            var items    = that.items;
            var width    = that.opts.width;
            var boxWidth = that.boxSize.width;

            for(var i=0;i<that.length;i++){
                var itemWidth = 0;

                if(width === "auto"){
                    itemWidth = items[i].dom.outerWidth() + 18;
                }else{
                    itemWidth = width / that.length - boxWidth;
                }
                items[i].dom.width(i !== 0 ? itemWidth + 1 : itemWidth);
            }
            return that.refresh();
        },
        /*
         * value
        */
        value:function(value){
            var that = this;

            return that.opt("value",value,function(){
                for(var i=0;i<that.length;i++){
                    if(that.items[i].value === value){
                        that._selected = that.items[i];
                        break;
                    }
                }
                that.renderState && that.refresh();
                that.emit("change",value);
            });
        },
        /*
         * append
        */
        append:Std.func(function(text,value){
            var that = this;
            var item = newDiv("_item");

            if(isObject(text)){
                value = text.value;
                text  = text.text;
            }

            if(isString(text)){
                item.append(newDiv("_name").html(text));
            }
            if(that.length++ > 0){
                that[0].append(newDiv("_sep"));
            }
            that.items.push({
                text:text,
                value:value,
                dom:item
            });
            that[0].append(item);
        },{
            each:[isArray,isString]
        })
    },
    /*#module option:main]*/
    main:function(that,opts){
        that.items = [];
        that.initEvents();

        if(opts.items){
            that.append(opts.items);
        }
    }
});
