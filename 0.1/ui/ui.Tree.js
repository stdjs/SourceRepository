/**
 * data tree widget module
*/
Std.ui.module("Tree",function(){
    /*
     * tree item module
    */
    var treeItemModule = Std.module({
        /*[#module option:option]*/
        option:{
            id:null,
            tree:null,
            type:null,
            icon:null,
            text:"",
            iconClass:null,
            parent:null,
            selected:false,
            checked:false,
            children:null,
            checkable:false
        },
        /*[#module option:private]*/
        private:{
            /*
             * read JSON
            */
            readJSON:function(handle,config,callback){
                handle.addClass("_loading");

                if(isString(config)){
                    Std.ajax.json(config,callback).success(function(){
                        handle.removeClass("_loading");
                    });
                }else if(isObject(config)){
                    Std.ajax.json(Std.extend({
                        success:callback
                    },config)).success(function(){
                        handle.removeClass("_loading");
                    });
                }
                return this;
            },
            /*
             * create checkbox
            */
            createCheckBox:function(){
                var that     = this;
                var doms     = that.D;
                var checkbox = doms.checkbox = newDom("i","_checkbox").prependTo(doms.anchor);

                if(that.checked()){
                    checkbox.addClass("checked");
                }
                return that;
            },
            /*
             * create child nodes
            */
            createChildNodes:function(items){
                var that      = this;
                var tree      = that.tree();
                var ul        = that.D.ul = newDom("ul","_container_ul").appendTo(that.D.li);
                var checkable = tree.checkable();

                that._items = [];

                for(var i=0,length=items.length;i<length;i++){
                    var type = items[i].type;

                    if(checkable && !("checkable" in items[i])){
                        items[i].checkable = checkable;
                    }
                    if(type && type in tree._types){
                        items[i] = tree.makeNodeOption(type,items[i]);
                    }

                    var childNode = new treeItemModule(tree,items[i]);
                    childNode.parent(that);
                    childNode.appendTo(that.D.ul);
                    that._items[i] = childNode;
                }
                return that;
            },
            /*
             * create node icon
            */
            createNodeIcon:function(){
                var that      = this;
                var opts      = that.opts;
                var icon      = opts.icon;
                var iconClass = opts.iconClass;

                if(icon || iconClass){
                    if(isString(iconClass)){
                        iconClass = "_icon " + iconClass;
                    }else{
                        iconClass = "_icon";
                    }
                    that.D.icon = newDom("i",iconClass).appendTo(that.D.anchor);

                    if(isString(icon)){
                        that.D.icon.append(newDom("img").attr("src",icon));
                    }
                }
                return that;
            },
            /*
             * create node anchor
            */
            createNodeAnchor:function(){
                var that   = this;
                var opts   = that.opts;
                var anchor = that.D.anchor = newDom("a","_anchor").appendTo(that.D.li.append(
                    that.D.hand  = newDom("i","_hand _empty")
                ));

                opts.checkable && that._createCheckBox();
                that._createNodeIcon();

                opts.color  && anchor.color(opts.color);
                opts.href   && anchor.attr("href",opts.href);
                opts.target && anchor.attr("target",opts.target);
                opts.text   && anchor.append(that.D.text = newDom("span").html(opts.text));

                return that;
            }
        },
        /*[#module option:public]*/
        public:{
            /*
             * id
            */
            id:function(id){
                return this.opt("id",id);
            },
            /*
             * tree
            */
            tree:function(tree){
                return this.opt("tree",tree);
            },
            /*
             * parent
            */
            parent:function(parent){
                return this.opt("parent",parent);
            },
            /*
             * checkable
            */
            checkable:function(checkable){
                return this.opt("checkable",checkable);
            },
            /*
             * text
            */
            text:function(text){
                return this.opt("text",text,function(){
                    this.D.text.text(text);
                });
            },
            /*
             * expanded
             */
            expanded:function(expanded){
                return this.opt("expanded",expanded,function(){
                    this.expand(expanded);
                });
            },
            /*
             * expandAll
            */
            expandAll:function(){
                var that = this.expanded(true);

                Std.each(that._items,function(i,item){
                    item.expandAll();
                });

                return that;
            },
            /*
             * collapseAll
            */
            collapseAll:function(){
                var that = this.expanded(false);

                Std.each(that._items,function(i,item){
                    item.collapseAll();
                });

                return that;
            },
            /*
             * selected
            */
            selected:function(selected,push){
                var that = this;

                return that.opt("selected",selected,function(){
                    if(push !== false){
                        var selectedItems = that.tree()._selectedItems;
                        if(selected === true){
                            selectedItems.push(that);
                        }else{
                            selectedItems.remove(selectedItems.indexOf(that));
                        }
                    }
                    that.D.anchor.toggleClass("selected",selected);
                })
            },
            /*
             * checked
            */
            checked:function(checked,push){
                var that = this;
                var opts = that.opts;
                var tree = that.tree();

                return that.opt("checked",checked,function(){
                    that.D.checkbox.toggleClass("checked",checked);
                    if(push !== false){
                        var checkedItems = that.tree()._checkedItems;
                        if(checked === true){
                            checkedItems.push(that);
                        }else{
                            checkedItems.remove(checkedItems.indexOf(that));
                        }
                    }
                    if(tree.selectionMode() === "checkedItems"){
                        that.selected(checked);
                    }
                    if(that._items){
                        for(var i=0,length=that._items.length;i<length;i++){
                            that._items[i].checked(checked);
                        }
                    }else if(opts.items){
                        for(var i=0,length=opts.items.length;i<length;i++){
                            opts.items[i].checked = checked;
                        }
                    }
                    tree.emit("itemChecked",checked);
                });
            },
            /*
             * append to
            */
            appendTo:function(target){
                var that = this;
                var opts = that.opts;
                var li   = that.D.li = newDom("li","_container_li").data("node",that);

                that._createNodeAnchor();

                if(!isEmpty(opts.items)){
                    var className = "_hand";

                    if(opts.expanded){
                        className += " _expanded";
                        that._createChildNodes(opts.items);
                    }
                    that.D.hand.className(className);
                }

                if(opts.selected || (opts.checked && opts.tree.selectionMode() === "checkedItems")){
                    that.selected(true);
                }
                if(opts.id && opts.tree){
                    opts.tree._IDMap[opts.id] = that;
                }
                target.append(this.D.li);
                return this;
            },
            /*
             * expand
            */
            expand:Std.func(function(expanded){
                var that = this;
                var opts = that.opts;
                var doms = that.D;

                if(expanded === true && isEmpty(doms.ul) && !!opts.items){
                    if(isArray(opts.items)){
                        that._createChildNodes(opts.items);
                        doms.ul.hide();
                    }else if(isString(opts.items) || isObject(opts.items)){
                        return that._readJSON(doms.hand,opts.items,function(items){
                            opts.items = items;
                            that.expand(true);
                        });
                    }
                }
                if(isEmpty(doms.ul)){
                    return;
                }
                var computeDuration = function(height){
                    if((height = height / 2.5) > 300){
                        height = 300;
                    }else if(height < 100){
                        height = 100;
                    }
                    return height;
                };
                if((opts.expanded = expanded) === true){
                    var height = doms.ul.show().offsetHeight();
                    var width  = doms.ul.width();

                    doms.ul.css({
                        width:width,
                        height:0,
                        opacity:0.5,
                        overflow:"hidden"
                    }).animate({
                        50:{opacity:1},
                        to:{
                            opacity:1,
                            height:height
                        }
                    },computeDuration(height),function(){
                        doms.ul.removeStyle("overflow width height opacity");
                    });
                }else{
                    doms.ul.css({
                        width:doms.ul.width(),
                        overflow:"hidden",
                        opacity:1
                    }).animate({
                        to:{
                            height:0,
                            opacity:0.5
                        }
                    },computeDuration(doms.ul.offsetHeight() / 2.5),function(){
                        doms.ul.removeStyle("overflow width height opacity").hide();
                    });
                }
                doms.hand.toggleClass("_expanded",expanded);
            }),
            /*
             * remove
            */
            remove:function(item){
                var that = this;
                var opts = that.opts;

                if(item === undefined){
                    var parentItems = opts.parent._items;
                    var index       = parentItems.indexOf(that);

                    if(index !== -1){
                        parentItems.remove(index);
                    }
                    if(opts.id){
                        delete opts.tree._IDMap[opts.id];
                    }
                    that.D.li.remove();
                }
            }
        },
        /*[#module option:main]*/
        main:function(tree,option){
            this.D = {};
            this.init_opts(option);
            this.opts.tree = tree;
        }
    });

    /*
     * tree ui module
    */
    return {
        /*[#module option:parent]*/
        parent:"widget",
        /*[#module option:events]*/
        events:"clear selectionModeChange dataSourceLoad itemClick itemDblClick itemRename itemChecked contextMenu",
        /*[#module option:option]*/
        option:{
            defaultClass:"StdUI_Tree",
            level:4,
            items:null,
            lines:false,
            expanded:false,
            checkable:false,
            editable:false,
            droppable:false,
            itemHeight:20,
            dataSource:null,
            selectionMode:"items" //item,items,checkedItems,none
        },
        /*[#module option:extend]*/
        extend:{
            /*
             * render
            */
            render:function(){
                var that = this;
                var opts = that.opts;

                if(opts.checkable){
                    that.initCheckboxEvents();
                }

                that.initEvents();
                that.updateStyle();
            },
            /*
             * remove
             */
            remove:function(item){
                var that = this;

                if(item !== undefined){
                    var items = that._items;
                    var index = null;

                    if(isString(item) || isNumber(item)){
                        item = that.queryNodeByID(item);
                    }
                    if(item instanceof treeItemModule){
                        item.remove();
                    }
                }
            }
        },
        /*[#module option:protected]*/
        protected:{
            /*
             * make node option
            */
            makeNodeOption:function(type,data){
                var that          = this;
                var defaultOption = that._types[type];

                for(var name in defaultOption){
                    if(!(name in data)){
                        data[name] = defaultOption[name];
                    }
                }
                return data;
            },
            /*
             * anchor mouse down
            */
            anchorMouseDown:function(e,node){
                var that = this;

                switch(that.selectionMode()){
                    case "none":
                        break;
                    case "item":
                        that.clearSelected();
                        node.selected(true);
                        e.stopPropagation();
                        break;
                    case "items":
                        if(!e.ctrlKey){
                            that.clearSelected();
                        }
                        node.selected(!node.selected());
                        break;
                }
            },
            /*
             * edit node
            */
            editNode:function(node){
                var that  = this;
                var text  = node.text();
                var timer = null;
                var input = newDom("input","_input").value(text);
                var temp  = newDom("span").css({
                    top:-99,
                    font:input.css("font"),
                    fontSize:input.css("fontSize"),
                    position:"absolute",
                    visibility:"hidden"
                }).appendTo(that[0]);

                node.D.text.hide();
                node.D.anchor.append(input.width(temp.text(text).width()).focus().on({
                    blur:function(){
                        var value = input.value();
                        node.text(value);
                        node.D.text.show().text(value);
                        Std.dom.united([temp,input]).remove();
                        if(text !== value){
                            that.emit("itemRename",[value,text],true);
                        }
                    },
                    keydown:function(e){
                        if(e.keyCode === 13){
                            input.blur()
                        }else{
                            clearTimeout(timer);
                            timer = setTimeout(function(){
                                input.width(temp.text(input.value()).width());
                            },1);
                        }
                    }
                }));
                input.dom.select();

                return that;
            },
            /*
             * init droppable events
            */
            initDroppableEvents:function(){
                var that = this;


            },
            /*
             * init checkbox events
            */
            initCheckboxEvents:function(){
                var that = this;

                that[0].on("mouseenter","i._checkbox",that._checkboxEvents = function(e){
                    var li   = this.parent("li._container_li");
                    var node = li.data("node");

                    this.mouse({
                        auto:false,
                        click:function(e){
                            node.checked(!node.checked());
                        },
                        dblclick:function(e){
                            e.stopPropagation();
                        }
                    },e);
                });
                return that;
            },
            /*
             * init events
            */
            initEvents:function(){
                var that = this;

                that[0].unselect(true).on("mouseenter","i._hand",function(e){
                    var li   = this.parent();
                    var node = li.data("node");

                    this.mouse({
                        auto:false,
                        click:function(){
                            node.expand(!node.expanded());
                        }
                    },e);
                }).on("mouseenter","li._container_li > a._anchor",function(e){
                    var li   = this.parent();
                    var node = li.data("node");

                    this.mouse({
                        auto:false,
                        down:function(e){
                            return that.anchorMouseDown(e,node);
                        },
                        click:function(e){
                            that.emit("itemClick",[e,node],true);
                        },
                        dblclick:function(e){
                            if(that.editable()){
                                that.editNode(node);
                            }else{
                                node.expand(!node.expanded());
                            }
                            that.emit("itemDblClick",[e,node],true);
                        }
                    },e);
                });
                return that;
            },
            /*
             * update style
            */
            updateStyle:function(){
                var that       = this;
                var CSSData    = {};
                var itemHeight = that.itemHeight();

                CSSData[".StdUI_Tree.StdUI_" + that.objectName] = {
                    '>' : {
                        "ul > li._container_li":{
                            marginLeft:0
                        }
                    },
                    ' ' : {
                        "input._input":{
                            height:itemHeight - 2 + "px",
                            lineHeight:itemHeight - 2 + "px"
                        },
                        "i._checkbox":{
                            margin: ((itemHeight - 16) / 2) + "px"
                        },
                        "i._hand":{
                            margin: ((itemHeight - 12) / 2) + 2 + "px"
                        },
                        "i._icon":{
                            width:itemHeight - 2 + "px",
                            height:itemHeight - 2 + "px"
                        },
                        "li._container_li":{
                            marginLeft:itemHeight + "px"
                        },
                        "a._anchor":{
                            height:itemHeight + "px",
                            lineHeight:itemHeight + "px"
                        }
                    }
                };
                that._CSSStyle.clear().append(CSSData);

                return that;
            }
        },
        /*[#module option:public]*/
        public:{
            /*
             * selection mode
             */
            selectionMode:function(mode){
                return this.opt("selectionMode",mode,function(){
                    this.emit("selectionModeChange",mode);
                });
            },
            /*
             * editable
            */
            editable:function(editable){
                return this.opt("editable",editable);
            },
            /*
             * item height
             */
            itemHeight:function(height){
                return this.opt("itemHeight",height,function(){
                    this.renderState && this.updateStyle();
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
             * checkable
            */
            checkable:function(checkable){
                return this.opt("checkable",checkable,function(){
                    if(checkable === true && !isFunction(this._checkboxEvents)){
                        this.initCheckboxEvents();
                    }
                });
            },
            /*
             * expandAll
            */
            expandAll:function(){
                var that = this;

                Std.each(that._items,function(i,item){
                    item.expandAll();
                });
                return that;
            },
            /*
             * collapseAll
            */
            collapseAll:function(){
                var that = this;

                Std.each(that._items,function(i,item){
                    item.collapseAll();
                });
                return that;
            },
            /*
             * lines
            */
            lines:function(lines){
                return this.opt("lines",lines,function(){

                });
            },
            /*
             * types
            */
            types:Std.func(function(name,data){
                var that  = this;
                var types = that._types;

                if(isString(name) && data === undefined){
                    return types[name];
                }
                types[name] = Std.extend({},data);
            },{
                each:[isArray,isObject]
            }),
            /*
             * append
            */
            append:Std.func(function(data){
                var that = this;
                var type = data.type;

                if(type && type in that._types){
                    data = that.makeNodeOption(type,data);
                }

                var item = new treeItemModule(that,data);
                item.checkable(that.opts.checkable);
                item.parent(that);
                item.appendTo(that[1]);
                that._items.push(item);
            },{
                each:[isArray]
            }),
            /*
             * insert before
            */
            insertBefore:function(data){

            },
            /*
             * insert after
            */
            insertAfter:function(data){

            },
            /*
             * refresh
            */
            refresh:function(){

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
             * query node by id
            */
            queryNodeByID:function(id){
                return (id in this._IDMap) ? this._IDMap[id] : null;
            },
            /*
             * clear selected
            */
            clearSelected:function(arg){
                var that = this;

                if(arg === undefined){
                    Std.each(that._selectedItems,function(i,item){
                        item.opts.selected = false;
                        item.D.anchor.removeClass("selected");
                    });
                    that._selectedItems.clear();
                }
                return that;
            },
            /*
             * clear checked
            */
            clearChecked:function(arg){
                var that = this;

                if(arg === undefined){
                    Std.each(that._checkedItems,function(i,item){
                        item.opts.checked = false;
                        item.D.checkbox.removeClass("checked");
                    });
                    that._checkedItems.clear();
                }
                return that;
            },
            /*
             * clear
            */
            clear:function(){
                var that = this;

                that._items.clear();
                that.clearChecked();
                that.clearSelected();

                Std.each(that._IDMap,function(id){
                    delete this[id];
                });

                return that.emit("clear");
            }
        },
        /*[#module option:main]*/
        main:function(that,opts){
            that[0].addClass("StdUI_" + that.objectName).append(
                that[1] = newDom("ul","_container_ul")
            );

            that._types         = {};
            that._items         = [];
            that._IDMap         = {};
            that._checkedItems  = [];
            that._selectedItems = [];
            that._CSSStyle      = new Std.css;

            if(opts.types){
                that.types(opts.types);
            }
            if(opts.items){
                that.append(opts.items);
            }
            that.call_opts({
                dataSource:null
            },true);
        }
    }
});