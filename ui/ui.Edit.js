/**
 * ui: edit model
*/
Std.ui.model("edit",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:action]*/
    action:{
        content:"value"
    },
    /*[#module option:option]*/
    option:{
        value:"",
        echoMode:"text",
        fontSize:null,
        maxLength:0,
        readOnly:false,
        showState:false,
        placeHolder:null
    },
    /*[#module option:events]*/
    events:"focus blur change",
    /*[#module option:protected]*/
    protected:{
        /*
         * input node name
        */
        inputNodeName:"input",
        /*
         * place holder state
        */
        placeHolderState:true
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend enable
        */
        enable:function(state){
            var that      = this;
            var input     = that.D.input;
            var $disabled = "disabled";

            if(state === false){
                input.attr($disabled,$disabled);
            }else{
                input.removeAttr($disabled);
            }
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * init events
        */
        initEvents:function(){
            var that     = this;
            var state    = false;
            var focusout = function(){
                that.removeClass("focus");

                if(!that.showState()){
                    return;
                }
                if(that.valid()){
                    that.addClass("_state _success");
                }else{
                    that.addClass("_state _error");
                }
            };

            that[0].on("focusin",function(){
                if(that.enable() == false){
                    return;
                }
                if(that.showState()){
                    that.removeClass("_state _success _error");
                }
                setTimeout(function(){
                    that.addClass("focus").emit("focus").focus()
                },20);
                if(state === true){
                    return;
                }
                that.D.input.on("change",function(){
                    that.emit("change");
                });
                that[0].on("focusout",focusout);
                state = true;
            }).mouse();

            return that;
        },
        /*
         * init place holder
        */
        initPlaceHolder:function(){
            var that = this;
            var opts = that.opts;

            if(!that.D.placeHolder){
                that.D.placeHolder = newDiv("_placeHolder").appendTo(that[0]).unselect(true);
            }
            if(opts.value !== ""){
                that.placeHolderState(false);
            }else{
                that._placeHolderState = true;
            }
            return that;
        },
        /*
         * init input
        */
        initInput:function(value){
            var that = this;
            var opts = that.opts;
            var doms = that.D;

            if(opts.echoMode === "password"){
                doms.input = new Std.dom(that._inputNodeName + "[type='password']");
            }else{
                doms.input = newDom(that._inputNodeName);
            }

            if(!isEmpty(value)){
                doms.input.value(value);
            }

            doms.input.appendTo(that[0]).on("keydown keyup",Std.func(function(){
                that.placeHolderState(that.value() === "");
            },5));
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * show state
        */
        showState:function(state){
            return this.opt("showState",state);
        },
        /*
         * select text
        */
        select:function(){
            var that = this;
            that.D.input.select();

            return that;
        },
        /*
         * focus input
        */
        focus:function(){
            var that = this;
            that.D.input.focus();
            return that;
        },
        /*
         * blur input
        */
        blur:function(){
            var that = this;
            that.D.input.blur();
            return that;
        },
        /*
         * value is valid
        */
        valid:function(){
            var that = this;

            return Std.is(that.opts.validator,that.value());
        },
        /*
         * get or set max length
        */
        maxLength:function(length){
            var that = this;

            return that.opt("maxlength",length,function(){
                that.D.input.attr("maxlength",length);
            });
        },
        /*
         * get or set input line height
        */
        lineHeight:function(lineHeight){
            var that = this;

            return that.opt("lineHeight",lineHeight,function(){
                that.D.input.lineHeight(lineHeight);
            });
        },
        /*
         * get or set font size
        */
        fontSize:function(size){
            var that = this;

            if(size == undefined){
                return that.D.input.css("font-size");
            }
            that.D.input.css("font-size",size);
            that.D.placeHolder && that.D.placeHolder.css("font-size",size);

            return that;
        },
        /*
         * get or set value
        */
        value:function(value){
            var that = this;
            var doms = that.D;

            if(value === undefined){
                return doms.input.value();
            }
            that.placeHolderState(value === "");
            doms.input.value(value);

            return that;
        },
        /*
         * input echoMode
        */
        echoMode:function(echoMode){
            var that = this;
            return that.opt("echoMode",echoMode,function(){
                var value = "";
                if(that.renderState){
                    value = that.value();
                }else{
                    value = that.opts.value;
                }
                if(that.D.input){
                    that.D.input.remove();
                    delete that.D.input;
                }
                that.initInput(value);
            });
        },
        /*
         * get or set input is read only
        */
        readOnly:function(state){
            var that      = this;
            var dom_input = that.D.input;

            return that.opt("readOnly",state,function(){
                if(state === true){
                    dom_input.attr("readOnly","readOnly");
                }else{
                    dom_input.attr("readOnly","");
                }
            });
        },
        /*
         * get or set placeholder value
        */
        placeHolder:function(text){
            var that = this;
            var doms = that.D;

            return that.opt("placeHolder",text,function(){
                if(!doms.placeHolder){
                    that.initPlaceHolder();
                }
                doms.placeHolder.html(text);
            });
        },
        /*
         * placeHolderState
        */
        placeHolderState:function(state){
            var that = this;
            var doms = that.D;

            if(state === undefined){
                return that._placeHolderState;
            }
            if(state === that._placeHolderState || !doms.placeHolder){
                return that;
            }
            doms.placeHolder.visible(that._placeHolderState = state);
            return that;

        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        that.D = {};
        that.echoMode(opts.echoMode);
        that.call_opts({
            value:"",
            readOnly:false,
            maxLength:0,
            placeHolder:null
        },true);

        that.call_opts({
            fontSize:null
        },true);

        that.initEvents();
    }
});

/**
 * LineEdit widget module
*/
Std.ui.module("LineEdit",{
    /*[#module option:model]*/
    model:"edit",
    /*[#module option:option]*/
    option:{
        level:3,
        dataList:null,
        minWidth:12,
        minHeight:12,
        className:"StdUI_LineEdit"
    },
    /*[#module option:protected]*/
    protected:{
        inputNodeName:"input"
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend height
        */
        height:function(height){
            var that = this;

            if(!isNumber(height)){
                height = that.height();
            }
            that.D.input.height(height = height - that.boxSize.height);
            that.D.placeHolder && that.D.placeHolder.css({
                height:height,
                lineHeight:height
            });
            that.lineHeight(height);
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * data list
        */
        dataList:function(dataList){
            var that = this;

            return that.opt("dataList",dataList,function(){

            });
        }
    }
});

/**
 * TextEdit widget module
*/
Std.ui.module("TextEdit",{
    /*[#module option:model]*/
    model:"edit",
    /*[#module option:option]*/
    option:{
        level:4,
        minWidth:15,
        minHeight:20,
        className:"StdUI_TextEdit"
    },
    /*[#module option:protected]*/
    protected:{
        inputNodeName:"textarea"
    },
    /*[#module option:extend]*/
    extend: {
        /*
         * extend height
        */
        height:function(n){
            var that = this;

            if(isNumber(n)){
                that.D.input.height(n = n - that.boxSize.height);
            }
        },
        /*
         * extend line height
        */
        lineHeight:function(n){
            var that = this;

            if(that.D.placeHolder){
                that.D.placeHolder.lineHeight(n);
            }
        }
    }
});
