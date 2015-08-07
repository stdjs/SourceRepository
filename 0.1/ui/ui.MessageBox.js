/**
 * MessageBox widget module
 * fixme:type:error,IE css 兼容性未处理
*/
Std.ui.module("MessageBox",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"ok cancel close yes no abort retry ignore disagree apply buttonClick",
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_MessageBox",
        boxSizing:"border-box",
        renderTo:"body",
        type:"information",   //information warning error question
        acceptEsc:true,
        closable:true,
        draggable:true,
        title:null,
        value:null,
        icon:"auto",
        iconClass:"auto",
        text:"null",
        timeout:0,
        buttons:"ok",
        buttonsAlign:"right",
        inputType:null,
        inputWidth:"auto",
        inputHeight:"auto",
        detailedText:"",
        defaultButton:"ok",
        informativeText:null
    },
    /*[#module option:private]*/
    private:{
        hasIcon:false,
        hasDetail:false,
        hasInformativeText:false
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            that.initLocker();


            if(that.input !== null){
                that.input.renderTo(that.D.BodyClientContentInput);
                that.input.focus(100);
            }else if(opts.defaultButton){
                that.defaultButton(opts.defaultButton);
            }else{
                that.focus();
            }
            that.updateLayout();
            that.move("central");
        },
        /*
         * extend remove
        */
        remove:function(){
            var that   = this;
            var locker = that._locker;

            if(locker){
                locker.remove();
            }
            Std.dom(window).off("keyup",that._keyupHandle);
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * input
         */
        input:null,
        /*
         * init icon
        */
        initIcon:function(){
            var that = this;

            that.D.BodyClient.prepend(that.D.BodyClientIcon = newDiv("_icon"));

            return that;
        },
        /*
         * init keyboard
        */
        initKeyboard:function(){
            var that = this;
            var opts = that.opts;

            Std.dom(window).on("keyup",that._keyupHandle || (that._keyupHandle = function(e){
                var target  = Std.dom(e.target);
                var keyCode = e.keyCode;

                if(keyCode === 27 && opts.acceptEsc){
                    that.remove();
                }
                //-----right key
                else if(keyCode === 39){

                }
                //-----left key
                else if(keyCode === 40){

                }
                //-----center and space
                else if((keyCode == 13 || keyCode == 32) && target.hasClass("_button")){
                    var button = that._buttons[that._defaultButton];
                    button && button.emit("click")
                }
            }));
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var state = false;

            that[0].on("mousedown",function(e){
                e.stopPropagation();
            }).focussing(function(e){
                if(state === false){
                    state = true;
                    that.initKeyboard();
                }
                that[0].css("zIndex",++Std.ui.status.zIndex);
            },null,false);
        },
        /*
         * init locker
        */
        initLocker:function(){
            var that    = this;
            var color   = "black";
            var opacity = 0.1;
            var parent  = that[0].offsetParent();

            switch(that.opts.type){
                case "warning":
                    color   = "#FF8142";
                    opacity = 0.6;
                    break;
                case "error":
                    color   = "#FF0505";
                    opacity = 0.3;
                    break;
                case "question":
                    color   = "#4692D7";
                    opacity = 0.2;
                    break;
                case "success":
                    color   = "#0CF4AB";
                    break;
            }

            that._locker = Std.ui("locker",{
                renderTo:parent.contains("body") ? "body" : parent,
                opacity :opacity,
                visible :true,
                background:color
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * message box title
        */
        title:function(title){
            return this.opt("title",title,function(){
                this.D.TitleText.html(title);
            });
        },
        /*
         * text
        */
        text:function(text){
            return this.opt("text",text,function(){
                this.D.BodyClientContentText.html(text);
            });
        },
        /*
         * timeout
        */
        timeout:function(ms){
            var that = this;

            return that.opt("timeout",ms,function(){
                Std.func(function(){
                    that.remove();
                },{
                    delay:ms.timeout
                })();
            });
        },
        /*
         * update layout
        */
        updateLayout:function(){
            var that = this;
            var opts = that.opts;
            var doms = that.D;

            if(opts.buttonsAlign != "left"){
                var width = doms.Buttons.offsetWidth() - doms.ButtonGroup.offsetWidth() - 2;
                if(opts.type == "warning" || opts.buttonsAlign == "center"){
                    width /= 2;
                }
                doms.ButtonSpacing.width(width);
            }
        },
        /*
         * title icon
        */
        icon:function(icon){
            var that = this;

            return that.opt("icon",icon,function(){
                if(!that.D.BodyClientIcon){
                    that.initIcon();
                    that.D.BodyClientIcon.html(
                        newDom("img").attr("src",icon)
                    );
                }
            });
        },
        /*
         * icon class
        */
        iconClass:function(className){
            var that = this;

            return that.opt("icon",className,function(){
                if(!that.D.BodyClientIcon){
                    that.initIcon();
                    that.D.BodyClientIcon.className("_icon " + className);
                }
            });
        },
        /*
         * value
        */
        value:function(value){
            var that = this;

            if(value === undefined){
                return that.input.value();
            }
            that.input.value(value);

            return that;
        },
        /*
         * informative text
        */
        informativeText:function(text){
            var that = this;

            return that.opt("informativeText",text,function(){
                if(!that._hasInformativeText){
                    that._hasInformativeText = true;
                    that.D.BodyClientContent.prepend(that.D.InformativeText = newDiv("_informativeText"));
                }
                that.D.InformativeText.html(text);
            });
        },
        /*
         * input type
        */
        inputType:function(type){
            var that = this;

            return that.opt("inputType",type,function(){
                if(that.input !== null){
                    that.input.remove();
                }
                that.input = Std.ui(type,{
                    width:that.opts.inputWidth,
                    height:that.opts.inputHeight
                });
            });
        },
        /*
         * buttons
        */
        buttons:Std.func(function(buttonName){
            var that = this;

            if(isString(buttonName)){
                if(that._buttons[buttonName]){
                    that._buttons[buttonName].remove();
                }
                var button = newDiv("_button").mouse({
                    unselect:true
                }).html(buttonName.toUpperCase()).attr({
                    tabindex:0,
                    buttonName:buttonName
                }).on("click",function(){
                    that.emit(buttonName);
                    that.emit("buttonClick",buttonName);
                    that.remove();
                });

                that.D.ButtonGroup.append(that._buttons[buttonName] = button);
            }
        },{
            each:[isArray,isString]
        }),
        /*
         * default button
        */
        defaultButton:function(name){
            var that = this;
            if(name == undefined){
                return that._defaultButton;
            }

            var defaultButton = that._buttons[that._defaultButton = name];
            if(defaultButton){
                defaultButton.focus();
            }
            return that;
        },
        /*
         * detailed text
        */
        detailedText:function(text){
            var that = this;
            if(text == undefined){
                return that.D.Detail.html();
            }
            if(!that._hasDetail){
                that._hasDetail = true;
                that.D.Body.append(that.D.Detail = newDiv("_detail"));
            }
            that.D.Detail.html(text);

            return that;
        },
        /*
         * closable
        */
        closable:function(closable){
            var that = this;
            var doms = that.D;

            return that.opt("closable",closable,function(){
                if(doms.TitleButtons_Close){
                    doms.TitleButtons_Close.remove();
                }
                if(closable === false){
                    return;
                }
                doms.TitleButtons.append(
                    doms.TitleButtons_Close = newDiv("_button _close").mouse({
                        down:function(){
                            return false;
                        },
                        click:function(){
                            that.remove();
                        }
                    })
                );
            });
        },
        /*
         * draggable
        */
        draggable:function(state){
            var that = this;

            return that.opt("draggable",state,function(){
                if(!that.plugin("drag")){
                    that.plugin("drag",{
                        handle:that.D.Title
                    });
                }
                that.plugin("drag").draggable(state);
            });
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that._buttons = [];

        that.D = {
            Title:newDiv("_title"),
            TitleText:newDiv("_text"),
            TitleButtons:newDiv("_buttons"),

            Body:newDiv("_body"),
            BodyClient:newDiv("_client"),
            BodyClientContent:newDiv("_content"),
            BodyClientContentText:newDiv("_text"),
            BodyClientContentInput:newDiv("_input"),

            Buttons:newDiv("_buttons"),
            ButtonSpacing:newDiv("_buttonSpacing"),
            ButtonGroup:newDiv("_buttonGroup")
        };

        //--------
        that.D.Title.append([
            that.D.TitleText,
            that.D.TitleButtons
        ]);

        that.D.Body.append([
            that.D.BodyClient,
            that.D.Buttons.append([that.D.ButtonSpacing,that.D.ButtonGroup]),
            that.D.Detail
        ]);

        that.D.BodyClient.append(that.D.BodyClientContent);
        that.D.BodyClientContent.append([
            that.D.BodyClientContentText,
            that.D.BodyClientContentInput
        ]);

        //--------
        dom.append([
            that.D.Title,
            that.D.Body
        ]);

        //--------
        if(opts.title === null){
            that.title(opts.type);
        }else{
            that.title(opts.title);
        }

        //--------
        if(opts.type !== "none"){
            that.iconClass(opts.type);
            dom.addClass("_" + opts.type);
        }

        //--------
        if(opts.informativeText === null && opts.type == "warning"){
            opts.informativeText = "warning";
        }

        that.call_opts({
            icon:"auto",
            iconClass:"auto",
            text:"",
            buttons:"",
            timeout:0,
            draggable:false,
            closable:false,
            inputType:null,
            detailedText:"",
            informativeText:null
        },true);

        that.initEvents();
    }
});