/**
 * CheckBox widget module
*/
Std.ui.module("CheckBox",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"change",
    /*[#module option:option]*/
    option:{
        level:1,
        defaultClass:"StdUI_CheckBox",
        text:"CheckBox",
        value:false,
        valueType:"bool" //bool,int,any
    },
    /*[#module option:action]*/
    action:{
        content:"text"
    },
    /*[#module option:private]*/
    private:{
        checked:false
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].mouse({
                click:function(){
                    that.enable() && that.checked(!that.checked());
                }
            });
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * value type
        */
        valueType:function(type){
            return this.opt("valueType",type);
        },
        /*
         * text
        */
        text:function(text){
            return this.opt("text",text,function(){
                this[2].html(text);
            })
        },
        /*
         * checked
        */
        checked:function(state){
            var that = this;

            if(state === undefined){
                return that._checked;
            }
            if(that._checked !== state){
                that.toggleClass("checked",that._checked = state);
                that.renderState && that.emit("change",state);
            }
            return that;
        },
        /*
         * value
        */
        value:function(value){
            var that = this;
            var type = that.valueType();

            if(value === undefined){
                if(type == "any"){
                    return that.opts.value;
                }
                if(type == "bool"){
                    return that.checked();
                }
                if(type == "int"){
                    return Number(that.checked());
                }
            }
            if(type == "any"){
                that.opts.value = value;
            }else{
                that.checked(Boolean(value));
            }
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        dom.append([
            that[1] = newDiv("_icon StdUI_CheckBox_Icon"),
            that[2] = newDom("label","_text")
        ]);

        that.call_opts(["text","value"]);
        that.initEvents();
    }
});
