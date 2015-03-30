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
        level:2,
        defaultClass:"StdUI_SwitchBox",
        height:26,
        value:"off",
        items:"off on",
        styleType:"default",
        color:"blue"
    },
    /*#module option:action]*/
    action:{
        content:"value"
    },
    /*#module option:protected]*/
    protected:{
        /*
         * state
        */
        state:null,
        /*
         * current
        */
        current:0
    },
    /*#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            //that.refreshCurrent();
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
            that.D.state.height(height);
            that[0].lineHeight(height - that.boxSize.height);
        }
    },
    /*#module option:private]*/
    private:{
        /*
         * create icon
        */
        createIcon:function(icon){
            var iconElement = newDiv("_icon");

            if(icon.charAt(0) !== '.'){
                iconElement.append(newDom("img").attr("src",icon));
            }else{
                iconElement.className("_icon" + icon.replace(/\./g,' '));
            }
            return iconElement;
        },
        /*
         * refreshCurrentIndex
        */
        refreshCurrent:function(){
            var that = this;

            for(var i=0;i<that.length;i++){
                if(that.items[i].name === that.value()){
                    that._current = i;
                    break;
                }
            }
            return that;
        },
        /*
         * refresh state
        */
        refreshState:function(){
            var that    = this;
            var width   = that.opts.width;
            var state   = that.D.state;
            var current = that.items[that._current];

            state.dom.innerHTML = current.dom.html();
            state.css({
                left  : current.dom.offsetLeft(),
                width : width !== "auto" ? width / that.length - that.boxSize.width  : that.items[that._current].dom.outerWidth()
            });
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].unselect(true).delegate("click","._item",function(e){
                var index = this.index("._item");
                var item  = that.items[index];

                if(index !== that._current){
                    that._current = index;
                    that.emit("change",that.opts.value = item.name);
                }
                that.D.state.html(item.dom.html()).animate({
                    to:{
                        width:item.dom.width(),
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
         * length
        */
        length:0,
        /*
         * value
        */
        value:function(value){
            var that = this;

            return that.opt("value",value,function(){
                that.refreshCurrent();
                that.renderState && that.refreshState();
                that.emit("change",value);
            });
        },
        /*
         * style type
        */
        styleType:function(styleType){
            var that = this;

            return that.opt("styleType",styleType,function(){
                if(styleType === "default"){

                }
            });
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
                    itemWidth = items[i].dom.outerWidth() + 16;
                }else{
                    itemWidth = width / that.length - boxWidth;
                }
                items[i].dom.width(i !== 0 ? itemWidth + 1 : itemWidth);
            }

            return that.refreshState();
        },
        /*
         * append
        */
        append:Std.func(function(name,icon){
            var that = this;
            var item = newDiv("_item");

            if(isObject(name)){
                name = name.name;
                icon = name.icon;
            }
            if(isString(name)){
                item.append(newDiv("_name").html(name));
            }
            if(isString(icon)){
                item.append(that.createIcon(icon));
            }
            if(that.length++ > 0){
                that[0].append(newDiv("_sep"));
            }
            that.items.push({
                name:name,
                dom:item
            });
            that[0].append(item);
        },{
            each:[isArray,isString]
        })
    },
    /*#module option:main]*/
    main:function(that,opts,dom){
        that.D     = {
            state:newDiv("_state").appendTo(dom)
        };
        that.items = [];
        that.initEvents();

        if(opts.items){
            that.append(opts.items);
        }

    }
});
