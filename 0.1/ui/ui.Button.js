/**
 *  button widget module
*/
Std.ui.module("Button",{
    nodeName:"a",
    /*[#module option:parent]*/
    parent:"widget",
    /*#module option:action]*/
    action:{
        content:"text"
    },
    /*[#module option:option]*/
    option:{
        level:2,
        icon:null,
        iconClass:null,
        menu:null,
        text:"Button",
        link:false,
        href:"",
        target:"_blank",
        defaultClass:"StdUI_Button",
        checkable:false,
        checked:false,
        styleType:"text", //textBesideIcon,textUnderIcon,text,icon
        iconWidth:18,
        iconHeight:18
    },
    /*[#module option:events]*/
    events:"checked mousedown mouseup click press longpress focus blur",
    /*[#module option:extend]*/
    extend:{
        /*
         * extend width
        */
        width:function(n){
            var that  = this;
            var table = that.D.table;

            if(isNumber(n)){
                table.width(n - that.boxSize.width);
            }else{
                table.width(n);
            }
        },
        /*
         * extend height
        */
        height:function(n){
            var that  = this;
            var table = that.D.table;

            if(isNumber(n)){
                table.height(n - that.boxSize.height);
            }else{
                table.height(n);
            }
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * button press
         */
        press:function(){
            var that = this;
            var opts = that.opts;

            Std.func(opts.press).call(that);

            if(opts.checkable){
                that.checked(!opts.checked);
            }
            return that.emit("press");
        },
        /*
         * init table
        */
        initButtonBox:function(){
            var that = this;

            that.D.tbody = newDom("tbody").appendTo(
                that.D.table = newDom("table","_buttonBox _" + that.opts.styleType).appendTo(that[0])
            );
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var state = false;

            that[0].on("focusin",function(){
                that.addClass("focus").emit("focus");
                if(state === false){
                    that.initKeyboard().on("focusout",function(){
                        that.emit("blur");
                        that[0].removeClass("focus");
                    });
                    state = true;
                }
            });

            return that;
        },
        /*
         * init mouse
        */
        initMouse:function(){
            var that = this;
            var opts = that.opts;

            that[0].mouse({
                unselect:true,
                down:function(e){
                    that.emit("mousedown",e);
                },
                up:function(e){
                    that.emit("mouseup",e);
                },
                click:function(e){
                    if(!opts.enable){
                        return;
                    }
                    that.press().emit("click",e);
                    Std.func(opts.click).call(that,e);
                },
                longpress:function(e){
                    that.emit("longpress",e);
                }
            });
            return that;
        },
        /*
         * init keyboard
        */
        initKeyboard:function(){
            var that = this;

            that[0].keyboard({
                classStatus:true,
                keyCode:function(e){
                    if(e.which === 32 || e.which === 13){
                        return true;
                    }
                },
                down:function(e){
                    e.preventDefault();
                },
                press:function(){
                    if(!that.opts.enable){
                        return;
                    }
                    that.press();
                    return false;
                }
            });
            return that;
        },
        /*
         * init elements
        */
        initElements:function(){
            var that = this.initButtonBox();
            var opts = that.opts;
            var doms = that.D;

            switch(opts.styleType){
                case "text":
                    doms.tr1  = newDom("tr").append([
                        doms.text = newDom("td","_text")
                    ]).appendTo(doms.tbody);
                    break;
                case "icon":
                    doms.tr1  = newDom("tr").append([
                        newDom("td").append(
                            doms.icon = newDiv("_icon")
                        )
                    ]).appendTo(doms.tbody);
                    break;
                case "textBesideIcon":
                    doms.tr1  = newDom("tr").append([
                        newDom("td").append(
                            doms.icon = newDiv("_icon")
                        ),
                        doms.text = newDom("td","_text")
                    ]).appendTo(doms.tbody);
                    break;
                case "textUnderIcon":
                    doms.tbody.append([
                        doms.tr1  = newDom("tr").append(
                            newDom("td").append(
                                doms.icon = newDiv("_icon")
                            )
                        ),
                        doms.tr2  = newDom("tr").append(
                            doms.text = newDom("td","_text")
                        )
                    ]);
                    break;
            }
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * checkable
        */
        checkable:function(state){
            return this.opt("checkable",state);
        },
        /*
         * href
        */
        href:function(href){
            return this.opt("href",href,function(){
                this[0].attr("href",href);
            });
        },
        /*
         * link target
        */
        target:function(target){
            return this.opt("target",target,function(){
                this[0].attr("target",target);
            });
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
         * link
        */
        link:function(state){
            var that = this;
            var opts = that.opts;

            return that.opt("link",state,function(){
                if(state === true){
                    that.target(opts.target);
                    that.href(opts.href);
                }else{
                    that[0].removeAttr("href");
                }
            });
        },
        /*
         * button text
        */
        text:function(text){
            var that = this;
            var doms = that.D;

            return that.opt("text",text,function(){
                if(that.opts.styleType === "icon"){
                    return;
                }
                doms.text.html(text);
            });
        },
        /*
         * checked
        */
        checked:function(state){
            var that = this;

            if(!that.checkable()){
                if(state === undefined){
                    return that.opts.checked;
                }
                return that;
            }
            return that.opt("checked",state,function(){
                return that.toggleClass("checked",state).emit("checked",state);
            });
        },
        /*
         * button icon
        */
        icon:function(icon){
            var that = this;
            var doms = that.D;

            return that.opt("icon",icon,function(){
                if(that.opts.styleType === "text"){
                    return;
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
                if(that.opts.styleType === "text"){
                    return;
                }
                doms.icon.className("_icon " + className);
            });
        },
        /*
         * style type
        */
        styleType:function(type){
            var that = this;
            var opts = that.opts;

            return that.opt("styleType",type,function(){
                if(that.D.table){
                    Std.each(that.D,function(name,element){
                        element.remove();
                        delete that.D[name];
                    });
                }
                that.initElements();
                that.call_opts("text").call_opts({
                    icon:null,
                    iconClass:null,
                    checked:false,
                    link:false
                },true);

                that.iconWidth(opts.iconWidth).iconHeight(opts.iconHeight);
            });
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D = {};

        that.styleType(opts.styleType);
        that.initEvents();
        that.initMouse();
    }
});

/**
 *  toolButton widget
 */
Std.ui.module("ToolButton",{
    nodeName:"a",
    /*[#module option:parent]*/
    parent:"Button",
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_Button StdUI_ToolButton",
        tabIndex:null,
        height:32,
        iconWidth:24,
        iconHeight:24,
        text:"btn"
    },
    /*[#module option:public]*/
    public:{
        initEvents:function(){

        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){

    }
});



