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
        iconClass:null,
        value:null,
        template:null,
        tabIndex:null,
        iconWidth:null,
        iconHeight:null
    },
    /*[#module option:extend]*/
    extend:{
        beforeRender:function(){
            var that = this;

            //------init default option
            that.call_opts({
                icon:null,
                iconClass:null,
                text:"",
                value:null
            },true);
        }
    },
    /*[#module option:private]*/
    private:{
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
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D = {};

        //------
        if(isFunction(opts.click)){
            dom.on("click",function(){
                that.enable() && opts.click.call(that);
            })
        }
    }
});

/**
 * template item widget module
*/
Std.ui.module("TemplateItem",{
    /*[#module option:parent]*/
    parent:"widget",
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
         * template
        */
        template:function(template){
            return this.opt("template",template);
        },
        /*
         * get or set text
        */
        text:function(text){
            return this.opt("text",text);
        },
        /*
         * data
        */
        data:function(data){
            var that = this;
            var opts = that.opts;

            return that.opt("data",data,function(){
                var template = that.template();

                if(isObject(template)){
                    template.renderTo(that,data);
                }
                that.text(data[opts.textField]);
                that.value(data[opts.valueField]);
            });
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D = {};
        
        //------
        if(isFunction(opts.click)){
            dom.on("click",function(){
                that.enable() && opts.click.call(that);
            })
        }
    }
});