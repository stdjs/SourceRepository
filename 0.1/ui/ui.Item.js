/**
 * item widget module
*/
Std.ui.module("Item",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:action]*/
    action:{
        content:"text"
    },
    /*[#module option:option]*/
    option:{
        level:2,
        defaultClass:"StdUI_Item",
        text:"",
        icon:null,
        value:null,
        tabIndex:null,
        iconClass:null,
        iconWidth:null,
        iconHeight:null,
        verticalAlign:"top"  //none,top,middle,bottom
    },
    /*[#module option:private]*/
    private:{
        /*
         * text visible
        */
        textVisible:true
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * before render
        */
        beforeRender:function(){
            this.call_opts({
                text:"",
                value:null,
                icon:null,
                iconClass:null
            },true);
        },
        /*
         * width
        */
        width:function(){
            var that  = this;
            var opts  = that.opts;
            var doms  = that.D;
            var width = that.width();

            if(isNumber(opts.iconWidth) && doms.icon && width - that.boxSize.width <= opts.iconWidth){
                if(that._textVisible && doms.text){
                    doms.text.hide();
                    that._textVisible = false;
                }
            }else if(!that._textVisible && doms.text){
                doms.text.show();
                that._textVisible = true;
            }
        },
        /*
         * height
        */
        height:function(){
            var that          = this;
            var opts          = that.opts;
            var verticalAlign = opts.verticalAlign;

            if(verticalAlign === "top" || verticalAlign === "none"){
                return;
            }
            var doms       = that.D;
            var height     = that.height() - that.boxSize.height;
            var top        = 0;
            var lineHeight = 0;

            if(verticalAlign === "middle"){
                if(isNumber(opts.iconHeight)){
                    top = (height - opts.iconHeight) / 2;
                }
                lineHeight = height;
            }else if(verticalAlign === "bottom"){
                if(isNumber(opts.iconHeight)){
                    top = height - opts.iconHeight;
                }
                lineHeight = height * 2;
            }
            if(doms.icon && isNumber(opts.iconHeight)){
                doms.icon.marginTop(top);
            }
            if(doms.text){
                doms.text.lineHeight(lineHeight);
            }
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init icon
        */
        initIcon:function(){
            var that = this;
            var doms = that.D;
            var icon = doms.icon = newDiv("_icon");

            if(doms.text){
                icon.insertBefore(doms.text);
            }else{
                icon.appendTo(that[0]);
            }
            return that.call_opts({
                iconWidth:null,
                iconHeight:null
            },true);
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * verticalAlign
        */
        verticalAlign:function(align){
            return this.opt("verticalAlign",align);
        },
        /*
         * icon width
        */
        iconWidth:function(width){
            var that = this;

            return that.opt("iconWidth",width,function(){
                that.D.icon && that.D.icon.width(width);
            });
        },
        /*
         * icon height
        */
        iconHeight:function(height){
            var that = this;

            return that.opt("iconHeight",height,function(){
                that.D.icon && that.D.icon.height(height);
            });
        },
        /*
         * icon class name
        */
        iconClass:function(className){
            var that = this;
            var doms = that.D;

            return that.opt("iconClass",className,function(){
                if(!doms.icon){
                    that.initIcon();
                }
                doms.icon.className("_icon " + className);
            });
        },
        /*
         * get or set text
        */
        text:function(text){
            var that = this;

            return that.opt("text",text,function(){
                if(!that.D.text){
                    that.D.text = newDiv("_text").appendTo(that[0]);
                }
                that.D.text.html(text);
            });
        },
        /*
         * get or set icon
        */
        icon:function(icon){
            var that = this;
            var doms = that.D;

            return that.opt("icon",icon,function(){
                if(!doms.icon){
                    that.initIcon();
                }
                if(!doms.iconImg){
                    doms.iconImg = newDom("img").appendTo(doms.icon);
                }
                doms.iconImg.attr("src",icon);
            });
        },
        /*
         * edit
        */
        edit:function(callback){
            if(this._editState){
                return;
            }
            var that  = this;
            var doms  = that.D;
            var text  = doms.text.html();
            var timer = null;
            var input = newDom("input","_edit");
            var temp  = newDom("span").css({
                top:-99,
                font:input.css("font"),
                fontSize:input.css("fontSize"),
                position:"absolute",
                visibility:"hidden",
                padding:input.css("padding")
            }).appendTo(that[0]);

            input.width(temp.text(text).width()).select().on({
                mousedown:function(e){
                    e.stopPropagation();
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
                },
                blur:function(){
                    var value = input.value();
                    doms.text.show();
                    if(isFunction(callback)){
                        callback.call(that.text(value),text,value);
                    }
                    input.remove();
                    that._editState = false;
                }
            }).appendTo(that).focus().css({
                float:doms.text.css("float"),
                width:doms.text.width(),
                height:doms.text.height()
            }).value(text);

            doms.text.hide();
            that._editState = true;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D = {};

        isFunction(opts.click) && dom.on("click",function(){
            that.enable() && opts.click.call(that);
        });
    }
});

/**
 * template item widget module
*/
Std.ui.module("TemplateItem",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"templateRender",
    /*[#module option:action]*/
    action:{
        content:"text"
    },
    /*[#module option:option]*/
    option:{
        level:2,
        defaultClass:"StdUI_TemplateItem",
        text:"",
        data:null,
        value:null,
        tabIndex:null,
        template:null,
        textField:"text",
        valueField:"value"
    },
    /*[#module option:extend]*/
    extend:{
        render:function(){
            var that = this;

            that.call_opts({
                data:null
            },true);
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * get or set text
        */
        text:function(text){
            return this.opt("text",text);
        },
        /*
         * template
        */
        template:function(template){
            var that = this;
            var opts = that.opts;

            return that.opt("template",template,function(){
                if(isString(template)){
                    opts.template = Std.template(template);
                }else if(template instanceof Std.template){
                    opts.template = template;
                }
            });
        },
        /*
         * data
        */
        data:function(data){
            var that = this;
            var opts = that.opts;

            if(data === undefined){
                return opts.data;
            }
            var template = that.template();

            if(isString(data) || isNumber(data)){
                data = {value:data};
            }
            if(isObject(template)){
                template.renderTo(that,data);
                that.emit("templateRender");
            }
            that.text(data[opts.textField]);
            that.value(data[opts.valueField]);
            opts.data = data;
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D = {};

        if(opts.template){
            that.template(opts.template);
        }
        isFunction(opts.click) && dom.on("click",function(){
            that.enable() && opts.click.call(that);
        });
    }
});