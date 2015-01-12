/**
 *  ListItem widget module
*/
Std.ui.module("ListItem",{
    /*[#module option:parent]*/
    parent:"Item",
    /*[#module option:option]*/
    option:{
        className:"StdUI_Item StdUI_ListItem",
        iconHeight:16,
        iconWidth:16,
        height:24,
        value:null
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * selected
        */
        selected:false
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend height
        */
        height:function(height){
            var that = this;
            var opts = that.opts;
            var doms = that.D;

            if(!isNumber(height)){
                height = that.height();
            }
            if(doms.icon){
                doms.icon.marginTop(Math.floor((height - opts.iconHeight) / 2));
            }
            that[0].lineHeight(height - that.boxSize.height);
        }
    }
});

/**
 * List widget module
*/
Std.ui.module("List",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"itemClick select",
    /*[#module option:action]*/
    action:{
        children:"append"
    },
    /*[#module option:option]*/
    option:{
        className:"StdUI_List",
        level:4,
        value:null,
        items:null,
        template:null,
        itemHeight:24,
        iconWidth:16,
        iconHeight:16,
        selectionMode:"single" //single,multi,none
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * selected items
        */
        selectedItems:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend render
        */
        render:function(){
            var that = this;

            that.items.each(function(i,item){
                item.renderTo(that[0]);
            });
        },
        /*
         * extend remove
        */
        remove:Std.func(function(item){
            var that  = this;
            var items = that.items;

            if(isNumber(item)){
                items[item].remove();
                items.remove(items);
            }else if(isObject(item)){
                var index = items.indexOf(item);
                if(index !== -1){
                    items[index].remove();
                    items.remove(index);
                }
            }
            return that;
        },{
            each:[isArray]
        })
    },
    /*[#module option:private]*/
    private:{
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].focussing(function(){
                that.addClass("focus");
            },function(){
                that.removeClass("focus");
            },false);

            return that;
        },
        /*
         * init List Item events
        */
        initItemEvents:function(){
            var that       = this;

            //-------- select
            var selectItem = function(item,index){
                var selectionMode = that.opts.selectionMode;

                if(selectionMode === "single"){
                    that.select(index);
                }else if(selectionMode === "multi"){
                    item._selected ? that.clearSelect(item) : that.select(item);
                }
            };

            //-------- mouse enter
            that[0].delegate("mouseenter",".StdUI_ListItem,.StdUI_TemplateItem",function(e){
                var index = this.index();
                var item  = that.items[index];

                item[0].mouse({
                    auto:false,
                    down:function(e){
                        selectItem(item,index);
                    },
                    click:function(){
                        that.emit("itemClick",item);
                    }
                },e);
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * template
        */
        template:function(template){
            var that = this;
            var opts = that.opts;

            if(template === undefined){
                return opts.template;
            }
            if(isString(template)){
                template = Std.template(template);
            }
            if(template instanceof Std.template){
                opts.template = template;
            }
            return that;
        },
        /*
         * select item
        */
        select:Std.func(function(index){
            var that          = this;
            var opts          = that.opts;
            var items         = that.items;
            var selectionMode = opts.selectionMode;

            if(selectionMode === "none"){
                return;
            }
            //----- if data is widget
            if(isWidget(index)){
                that.select(items.indexOf(index));
            }

            //----- if data is number
            else if(isNumber(index)){
                var selectItem = items[index];

                if(!selectItem || selectItem._selected){
                    return;
                }else if(selectionMode === "single"){
                    that.clearSelect();
                }

                selectItem.addClass("selected")._selected = true;

                that.selectedItems.push(selectItem);
                that.emit("select",[index,selectItem],true);
            }
        },{
            each:[isArray]
        }),
        /*
         * append item
        */
        append:Std.func(function(data){
            var that  = this;
            var opts  = that.opts;
            var item  = null;
            var addon = {
                iconWidth:opts.iconWidth,
                iconHeight:opts.iconHeight
            };
            if(opts.itemHeight){
                addon.height = opts.itemHeight;
            }

            if(isString(data)){
                item = Std.ui("ListItem",{
                    text:data,
                    height:opts.itemHeight,
                    iconWidth:opts.iconWidth,
                    iconHeight:opts.iconHeight
                });
            }else if(isWidget(data)){
                item = data;
            }else if(isObject(data)){
                if(!that.opts.template){
                    data.height     = opts.itemHeight;
                    data.iconWidth  = opts.iconWidth;
                    data.iconHeight = opts.iconHeight;
                    item = Std.ui(data.ui || "ListItem",data);
                }else{
                    item = Std.ui("TemplateItem",{
                        template:that.template(),
                        data:data,
                        textField:opts.textField,
                        valueField:opts.valueField
                    });
                }
            }

            if(!isWidget(item)){
                return;
            }
            if(item !== null){
                that.items.push(item);
                that.renderState && item.renderTo(that[0]);
            }
        },{
            each:[isArray]
        }),
        /*
         * clear items
        */
        clear:function(){
            var that  = this;
            var items = that.items;

            for(var i=0,length=items.length;i<length;i++){
                items[i].remove();
            }
            items.clear();
            that.selectedItems.clear();

            return that;
        },
        /*
         * clear select
        */
        clearSelect:function(data){
            var that          = this;
            var selectedItems = that.selectedItems;

            if(data === undefined){
                for(var i=0,length=selectedItems.length;i<length;i++){
                    selectedItems[i].removeClass("selected")._selected = false;
                }
                selectedItems.clear();
            }else if(isNumber(data)){
                var selectedItem = selectedItems[data];
                if(selectedItem && selectedItem._selected){
                    selectedItem.removeClass("selected")._selected = false;
                    selectedItems.remove(data);
                }
            }else if(isWidget(data)){
                that.clearSelect(selectedItems.indexOf(data));
            }
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.items         = [];
        that.selectedItems = [];

        if(opts.template !== null){
            that.template(opts.template);
        }
        if(opts.items){
            that.append(opts.items);
        }

        that.initEvents();
        that.initItemEvents();
    }
});