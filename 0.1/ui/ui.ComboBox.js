/**
 * ComboBoxItem widget module
*/
Std.ui.module("ComboBoxItem",{
    /*[#module option:parent]*/
    parent:"Item",
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_ComboBoxItem"
    }
});

/**
 * ComboBox widget module
*/
Std.ui.module("ComboBox",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        level:3,
        defaultClass:"StdUI_ComboBox",
        minWidth:40,
        minHeight:26,
        maxHeight:26,
        listMaxHeight:300,
        width:400,
        height:26,
        items:null,
        value:null,
        template:null,       //item template
        inputMode : "none",  //none,input
        valueMode : "text",  //text,index,item
        textField : "text",
        valueField: "value",
        dataSource:null
    },
    /*[#module option:events]*/
    events:"open close select change focus blur dataSourceLoad",
    /*[#module option:protected]*/
    protected:{
        listVisible:false,
        currentMode:"",
        currentItem:null,
        selectedItem:null
    },
    /*[#module option:action]*/
    action:{
        /*
         * children
         */
        children:"append",
        /*
         * childNodes
        */
        childNodes:function(element,childNodes){
            var items = [];

            Std.each(childNodes,function(i,child){
                var option   = {};
                var content  = child.html();
                var icon     = child.attr("icon");
                var nodeOpts = child.attr("std-option");

                if(isString(content)){
                    option.text = content;
                }
                if(isString(icon)){
                    option.icon = icon;
                }
                if(isString(nodeOpts)){
                    Std.extend(option,nodeOpts.toObject());
                }
                items.push(option);
            });

            this.append(items);
        }
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend render
        */
        render:function(){
            var that = this;

            that.call_opts({
                value:null
            },true);
        },
        /*
         * extend remove
        */
        remove:function(index){
            if(index === undefined){
                this.D.list && this.D.list.remove();
                this.delDocumentEvents();
            }
        },
        /*
         * extend height
        */
        height:function(height){
            var that = this;
            var doms = that.D;

            height = that.height() - that.boxSize.height;

            doms.input && doms.input.css({
                height:height,
                lineHeight:height
            });
            doms.content && doms.content.css({
                height:height,
                lineHeight:height
            });
        },
        /*
         * extend width
        */
        width:function(width){
            var that = this;
            var doms = that.D;

            width = that.width() - that.boxSize.width;

            doms.input && doms.input.css({
                width:width - 24
            });
            doms.content && doms.content.css({
                width:width - 24
            });
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * toggle list
        */
        toggleList:function(){
            var that = this;

            if(!that.enable()){
                return;
            }
            if(that._listVisible == true){
                that.close();
            }else{
                that.open();
            }
            return that;
        },
        /*
         * item mouse enter
        */
        itemMouseEnter:function(element,e){
            var that        = this;
            var index       = element.index();
            var currentItem = that.items[index];

            element.mouse({
                auto:false,
                classStatus:false,
                enter:function(){
                    that._selectedItem && that._selectedItem.removeClass("selected");
                    that._selectedItem = currentItem.addClass("selected");
                },
                click:function(){
                    that.value(currentItem);
                    that.toggleList();
                    that.focus();
                }
            },e);

            return that;
        },
        /*
         * addDocumentEvents
        */
        addDocumentEvents:function(){
            var that  = this;
            var doms  = that.D;

            Std.dom(document).on("mousedown",that._documentEvents || (that._documentEvents = function(e){
                if(doms.list && doms.list.contains(e.target)){
                    return;
                }
                that.delDocumentEvents().close();
            }));
            return that;
        },
        /*
         * delDocumentEvents
        */
        delDocumentEvents:function(){
            var that = this;

            if(that._documentEvents){
                Std.dom(document).off("mousedown",that._documentEvents);
            }
            return that;
        },
        /*
         * init handle
        */
        initHandle:function(){
            var that = this;
            var doms = that.D;

            if(doms.handle != undefined){
                return that;
            }
            doms.handle = newDiv("_handle").appendTo(that[0]);

            return that;
        },
        /*
         * init keyboard
        */
        initKeyboard:function(){
            var that  = this;

            that.on("keydown",function(e){
                var items   = that.items;
                var index   = items.indexOf(that._currentItem);
                var which   = e.which;
                var keyCode = e.keyCode;

                if(which === 27){
                    that.close();
                }else if(which === 32){
                    that.inputMode() === "none" && that.open();
                }
                if(index == -1){
                    return;
                }
                if(keyCode === 38){
                    that.value(--index < 0 ? items[items.length - 1] : items[index]);
                    that.focus();
                }else if(keyCode === 40){
                    that.value(++index >= items.length ? items[0] : items[index]);
                    that.focus();
                }
            });
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var state = false;

            that[0].on({
                mousedown:function(e){
                    if(e.which === 1 && e.target.nodeName !== "INPUT"){
                        that.toggleList();
                    }
                },
                focusin:function(){
                    that.addClass("focus").emit("focus");
                    if(state === false){
                        that.initKeyboard().on("focusout",function(){
                            (that.emit("blur"))[0].removeClass("focus");
                        });
                        that.D.input && that.D.input.on("change",function(){
                            that.emit("change");
                        });
                        state = true;
                    }
                }
            }).mouse({
                unselect:true
            });

            return that;
        },
        /*
         * init list
        */
        initList:function(){
            var that = this;
            var doms = that.D;

            if(doms.list !== undefined){
                return that;
            }
            doms.list = newDiv("StdUI StdUI_ComboBoxList").appendTo("body").on("mousedown",function(e){
                e.preventDefault();
            }).delegate("mouseenter",".StdUI_ComboBoxItem,.StdUI_TemplateItem",function(e){
                that.itemMouseEnter(this,e);
            });
            that.items.each(function(i,item){
                item.renderTo(doms.list);
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * text field
        */
        textField:function(field){
            return this.opt("textField",field);
        },
        /*
         * value field
        */
        valueField:function(field){
            return this.opt("valueField",field);
        },
        /*
         * value mode
        */
        valueMode:function(valueMode){
            return this.opt("valueMode",valueMode);
        },
        /*
         * data source
         */
        dataSource:function(dataSource){
            var that = this;

            return that.opt("dataSource",dataSource,function(){
                that.reload();
            });
        },
        /*
         * text
        */
        text:function(text){
            var that = this;
            var doms = that.D;

            if(text === undefined){
                return doms.content.text();
            }
            doms.content.text(text);

            return that;
        },
        /*
         * select
        */
        select:function(item){
            var that = this;

            if(isNumber(item)){
                item = that.items[item];
            }
            if(isWidget(item) && that._currentItem !== item){
                that._currentItem && that._currentItem.removeClass("selected");
                that._currentItem =  that._selectedItem = item.addClass("selected");
                that.emit("select change",item);
            }
            return that;
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
         * value
        */
        value:function(value){
            var that   = this;
            var method = that[that.opts.valueMode + "Value"];

            if(!that.D.list){
                that.initList();
            }
            if(isFunction(method)){
                return method.call(that,value);
            }
            if(value === undefined){
                return null;
            }
            return that;
        },
        /*
         * reload
        */
        reload:function(){
            var that       = this;
            var dataSource = that.dataSource();
            var read       = dataSource.read;

            if(dataSource.type === "ajax" && isObject(read)){
                Std.ajax.json({
                    url:read.url,
                    data:read.data,
                    type:read.type
                }).on("success",function(responseJSON){
                    that.clear();
                    that.append(Std.mold.dataPath(responseJSON,read.dataPath));
                    that.call_opts("value",true);
                    that.emit("dataSourceLoad",responseJSON);
                });
            }
        },
        /*
         * input mode
        */
        inputMode:function(mode){
            var that = this;
            var doms = that.D;

            return that.opt("inputMode",mode,function(){
                doms.input   && doms.input.remove();
                doms.content && doms.content.remove();

                if(that._currentMode !== ""){
                    that.removeClass("_"+that._currentMode);
                }
                if(mode === "input"){
                    doms.input   = newDom("input","_input").appendTo(that[0]);
                }else if(mode === "none"){
                    doms.content = newDiv("_content").appendTo(that[0]);
                }
                that.addClass("_" + (that._currentMode = mode));
            });
        },
        /*
         * text value
        */
        textValue:function(value){
            var that      = this;
            var doms      = that.D;
            var data      = value;
            var inputMode = that.inputMode();

            if(inputMode === "input"){
                if(value === undefined){
                    return doms.input.value();
                }
                if(isWidget(value)){
                    data = value.text();
                }
                doms.input && doms.input.value(data);
            }else if(inputMode === "none"){
                if(value === undefined){
                    return that.text();
                }
                if(isWidget(value)){
                    data = value.ui === "TemplateItem" ? value.text() : value[0].clone().className(value.opts.defaultClass)
                }
                doms.content && doms.content.html(data);
            }
            return that.select(value);
        },
        /*
         * index value
        */
        indexValue:function(value){
            var that      = this;
            var doms      = that.D;
            var item      = null;
            var items     = that.items;
            var index     = value;
            var inputMode = that.inputMode();

            if(value === undefined){
                return that._currentItem ? items.indexOf(that._currentItem) : null;
            }
            if(isWidget(value)){
                if((index = items.indexOf(value)) === - 1){
                    return that;
                }
            }else if(isString(index)){
                index = int(index);
            }
            if(!(item = items[index])){
                return that;
            }
            if(inputMode === "input"){
                doms.input   && doms.input.value(item.text());
            }else if(inputMode === "none"){
                doms.content && doms.content.html(
                    item.ui === "TemplateItem" ? item.text(): item[0].clone().className(item.opts.defaultClass)
                );
            }
            return that.select(index);
        },
        /*
         * item value
        */
        itemValue:function(value){
            var that      = this;
            var doms      = that.D;
            var item      = null;
            var items     = that.items;
            var index     = -1;
            var inputMode = that.inputMode();

            if(value === undefined){
                return that._currentItem ? that._currentItem.value() : null;
            }
            if(isWidget(value)){
                if((index = items.indexOf(value)) === - 1){
                    return that;
                }
                item = value;
            }
            index == -1 && that.items.each(function(i,tempItem){
                if(tempItem.value() != value){
                    return;
                }
                item  = tempItem;
                index = i;
                return false;
            });

            if(item === null){
                return that.select(index);
            }
            if(inputMode === "input"){
                doms.input && doms.input.value(item.text());
            }else if(inputMode === "none"){
                doms.content && doms.content.html(
                    item.ui === "TemplateItem" ? item.text(): item[0].clone().className(item.opts.defaultClass)
                );
            }
            return that.select(index);
        },
        /*
         * open list
        */
        open:function(){
            var that       = this;
            var doms       = that.D;
            var offset     = that[0].offset();
            var listHeight = 0;

            if(that._listVisible){
                return that;
            }
            if(!doms.list){
                that.initList();
            }
            doms.list.show();
            doms.handle.addClass("_open");

            if((listHeight = doms.list.offsetHeight()) > that.opts.listMaxHeight){
                listHeight = that.opts.listMaxHeight;
            }
            var top      = offset.y + that.height();
            var animates = {
                height:listHeight - doms.list.boxSize().height,
                opacity:1
            };
            if(offset.y + that.height() + listHeight > Std.dom(window).height()){
                doms.list.addClass("_top");
                animates.top = (top = offset.y) - listHeight;
            }
            doms.list.css({
                left     : offset.x,
                top      : top,
                width    : that[0].width() - 2,
                height   : 0,
                opacity  : 0,
                overflow : "hidden"
            }).animate({
                100:animates
            },{
                duration:150,
                timingFunction:"ease-in"
            },function(){
                that.addDocumentEvents();
                doms.list.removeStyle("overflow");
            });

            setTimeout(function(){
                doms.list.css("zIndex",++Std.ui.status.zIndex);
            },5);

            that._listVisible = true;

            return that.emit("open");
        },
        /*
         * close list
        */
        close:function(){
            var that     = this;
            var doms     = that.D;
            var offset   = that[0].offset();
            var animates = {
                height:0,
                opacity:0
            };
            if(!that._listVisible){
                return that;
            }
            if(offset.y > doms.list.css("top")){
                animates.top = offset.y;
            }
            doms.handle.removeClass("_open");
            doms.list && doms.list.css("overflow","hidden").animate({
                100:animates
            },140,function(){
                doms.list.hide().removeStyle("overflow height").removeClass("_top");
                if(that._selectedItem !== null){
                    that._selectedItem.removeClass("selected");
                }
                if(that._currentItem !== null){
                    that._selectedItem = that._currentItem.addClass("selected");
                }
            });
            that.delDocumentEvents();
            that._listVisible = false;

            return that.emit("close");
        },
        /*
         * append item
        */
        append:Std.func(function(data){
            var that = this;
            var opts = that.opts;
            var item = null;

            if(isString(data)){
                item = Std.ui("ComboBoxItem",{text:data});
            }else if(isWidget(data)){
                item = data;
            }else if(isObject(data)){
                if(!that.opts.template){
                    item = Std.ui(data.ui || "ComboBoxItem",data);
                }else{
                    item = Std.ui("TemplateItem",{
                        template:that.template(),
                        data:data,
                        textField:opts.textField,
                        valueField:opts.valueField
                    });
                }
            }

            if(isWidget(item)){
                if(that.D.list){
                    item.renderTo(that.D.list);
                }
                that.items.push(item.parent(that));
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

            Std.each(items,function(i,item){
                item.remove();
            });
            items.clear();

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D     = {};
        that.items = [];

        that.inputMode(opts.inputMode);
        that.initEvents();
        that.initHandle();
        that.call_opts("dataSource",true);

        if(opts.template !== null){
            that.template(opts.template);
        }
        if(opts.items !== null){
            that.append(opts.items);
        }
    }
});
