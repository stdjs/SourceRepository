/**
 *  ListItem widget module
*/
Std.ui.module("ListItem",{
    /*[#module option:parent]*/
    parent:"Item",
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_Item StdUI_ListItem",
        iconHeight:16,
        iconWidth:16,
        height:24,
        value:null
    },
    /*[#module option:private]*/
    private:{
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
    events:"itemClick itemRename select",
    /*[#module option:action]*/
    action:{
        children:"append"
    },
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_List",
        level:4,
        type:"default",         //default,block
        value:null,
        items:null,
        editable:false,
        template:null,
        dataSource:null,
        itemHeight:24,
        itemWidth:80,
        iconWidth:16,
        iconHeight:16,
        selectionMode:"single" //single,multi,none
    },
    /*[#module option:private]*/
    private:{
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
            var that          = this;
            var items         = that.items;
            var selectedItems = that.selectedItems;

            if(isObject(item)){
                var index = items.indexOf(item);
                if(index !== -1){
                    item = index;
                }
            }
            if(isNumber(item) && item < items.length){
                if(selectedItems.has(item)){
                    that.clearSelected(item);
                }
                items[item].remove();
                items.remove(items);
            }
        },{
            each:[isArray]
        })
    },
    /*[#module option:protected]*/
    protected:{
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
            var that          = this;
            var selectionMode = that.opts.selectionMode;
            var select        = function(index,item,e){
                if(selectionMode === "multi"){
                    if(!e.ctrlKey){
                        that.clearSelect();
                    }
                    if(item._selected){
                        that.clearSelect(item);
                    }else{
                        that.select(item);
                    }
                }else if(selectionMode !== "none"){
                    that.clearSelect();
                    that.select(index);
                }
            };
            that[0].delegate("mouseenter",".StdUI_ListItem,.StdUI_TemplateItem",function(e){
                var index = this.index();
                var item  = that.items[index];

                item[0].mouse({
                    auto:false,
                    dblclick:function(){
                        if(that.editable()){
                            that.editItem(item);
                        }
                    },
                    click:function(){
                        that.emit("itemClick",item);
                    },
                    down:function(e){
                        select(index,item,e);
                    }
                },e);
            });
            return that;
        },
        /*
         * edit item
        */
        editItem:function(item){
            var that = this;

            if(item instanceof Std.ui("ListItem")){
                item.edit(function(oldText,text){
                    that.emit("itemRename",[item,oldText,text],true);
                });
            }

            return that;
        },
        /*
         * create item
        */
        createItem:function(data){
            var that   = this;
            var opts   = that.opts;
            var UIName = "ListItem";
            var option = {
                height:opts.itemHeight,
                iconWidth:opts.iconWidth,
                iconHeight:opts.iconHeight
            };

            if(isWidget(data)){
                return data;
            }
            if(opts.template){
                UIName = "TemplateItem";
                Std.extend(option,{
                    data:data,
                    template:that.template(),
                    textField:opts.textField,
                    valueField:opts.valueField
                });
            }else if(isString(data) || isNumber(data)){
                option.text = data;
            }else if(isObject(data)){
                if(isString(data.ui)){
                    UIName = data.ui;
                }
                option = Std.extend(option,data);
            }
            if(option !== null){
                if(opts.type == "block"){
                    option.width = opts.itemWidth;
                }
                return Std.ui(UIName,option);
            }
            return null;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * type
        */
        type:function(type){
            return this.opt("type",type,function(){
                this[0].toggleClass("_block",type === "block");
            });
        },
        /*
         * item width
        */
        itemWidth:function(width){
            return this.opt("itemWidth",width,function(){
                Std.each(this.items,function(i,item){
                    item.width(width);
                });
            });
        },
        /*
         * item height
        */
        itemHeight:function(height){
            return this.opt("itemHeight",height,function(){
                Std.each(this.items,function(i,item){
                    item.height(height);
                });
            });
        },
        /*
         * data source
        */
        dataSource:function(dataSource){
            return this.opt("dataSource",dataSource,function(){
                this.reload();
            });
        },
        /*
         * editable
        */
        editable:function(editable){
            return this.opt("editable",editable);
        },
        /*
         * each
        */
        each:function(callback,makeReturn){
            var that = this;

            return Std.each(that.items,function(i,row){
                if(isFunction(callback)){
                    return callback.call(that,i,row);
                }
            },makeReturn);
        },
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
         * reload
        */
        reload:function(data){
            var that       = this;
            var opts       = that.opts;
            var dataSource = opts.dataSource;
            var read       = dataSource.read;

            if(dataSource && dataSource.type === "ajax" && isObject(read)){
                Std.ajax.json({
                    url:read.url,
                    data:Std.extend(read.data || {},data),
                    type:read.type || "get",
                    success:function(responseJSON){
                        that.clear();
                        that.append(Std.mold.dataPath(responseJSON,read.dataPath));
                        that.emit("dataSourceLoad",responseJSON);
                    }
                });
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
            if(isWidget(index)){
                that.select(items.indexOf(index));
            }else if(isNumber(index) && index !== -1){
                var selectItem = items[index];

                if(!selectItem || selectItem._selected){
                    return;
                }else if(selectionMode === "single"){
                    that.clearSelect();
                }

                selectItem.addClass("selected");
                selectItem._selected = true;

                that.selectedItems.push(selectItem);
                that.emit("select",[index,selectItem],true);
            }
        },{
            each:[isArray]
        }),
        /*
         * insert item
        */
        insert:function(data,index){
            var that = this;
            var item = that.createItem(data);

            if(item !== null && isWidget(item)){
                that.items.insert(item,index);
                that[0].insert(item[0],index);
                that.renderState && item.render();
            }
        },
        /*
         * append item
        */
        append:Std.func(function(data){
            this.insert(data);
        },{
            each:[isArray]
        }),
        /*
         * clear select
        */
        clearSelect:function(data){
            var that          = this;
            var selectedItems = that.selectedItems;

            if(data === undefined){
                for(var i=0,length=selectedItems.length;i<length;i++){
                    selectedItems[i].removeClass("selected");
                    selectedItems[i]._selected = false;
                }
                selectedItems.clear();
            }else if(isNumber(data) && data !== -1){
                var selectedItem = selectedItems[data];
                if(selectedItem && selectedItem._selected){
                    selectedItem.removeClass("selected");
                    selectedItem._selected = false;
                    selectedItems.remove(data);
                }
            }else if(isWidget(data)){
                that.clearSelect(selectedItems.indexOf(data));
            }
            return that;
        },
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
        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        that.items         = [];
        that.selectedItems = [];

        that.call_opts({
            type:"default",
            template:null
        },true);

        if(opts.items){
            that.append(opts.items);
        }

        that.initEvents();
        that.initItemEvents();
    }
});