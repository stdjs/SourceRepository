/**
 * toolbar widget
*/
Std.ui.module("ToolBar",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:action]*/
    action:{
        children:"append"
    },
    /*[#module option:option]*/
    option:{
        level:3,
        height:30,
        minHeight:28,
        items:null,
        styleType:"textBesideIcon", //textBesideIcon,textUnderIcon
        defaultClass:"StdUI_ToolBar"
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            that.items.each(function(i,item){
                item.render();
            });
        },
        /*
         *  height
        */
        height:function(height){
            var that = this;

            that.items.each(function(i,item){
                item.height(height - that.boxSize.height);
            });
        },
        /*
         *  remove
        */
        remove:function(button){
            var that  = this;
            var items = that.items;

            if(button === undefined){
                that.clear();
            }else if(isNumber(button)){
                items[button].remove();
                items.remove(button);
            }else if(isWidget(button)){
                var index = items.indexOf(button);
                if(index !== -1){
                    items[index].remove();
                    items.remove(index);
                }
            }
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * create tool
        */
        createTool:function(data){
            var that  = this;
            var opts  = that.opts;
            var item  = null;

            if(isWidget(data)){
                item = data;
            }else if(isString(data)){
                item = Std.ui("ToolButton",{
                    text:data,
                    styleType:opts.styleType
                });
            }else if(isObject(data)){
                data.styleType = opts.styleType;
                item = Std.ui(data.ui || "ToolButton",data)
            }

            if(isWidget(item)){
                item.parent(that);
            }
            return item;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * append tool button
        */
        append:Std.func(function(data){
            var that = this;
            var item = that.createTool(data);

            if(item !== null){
                item.appendTo(that.D.buttons);
                if(that.renderState){
                    item.render();
                }
                that.items.push(item);
            }
        },{
            each:[isArray]
        }),
        /*
         * insert tool button
        */
        insert:function(data,pos){
            var that   = this;
            var length = that.items.length;

            if(pos < length){
                var item = that.createTool(data);
                if(item !== null){
                    that.D.buttons.insertBefore(item,that.items[pos]);
                    that.items.insert(item,pos);
                }
            }else if(pos === length){
                that.append(data);
            }
            return that;
        },
        /*
         * clear tool buttons
        */
        clear:function(){
            var that  = this;
            var items = that.items;

            for(var i=0,length=items.length;i<length;i++){
                items[i].remove();
            }
            items.clear();

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D     = {
            buttons:newDiv("_buttons").appendTo(dom)
        };
        that.items = [];

        if(opts.items){
            that.append(opts.items);
        }
    }
});