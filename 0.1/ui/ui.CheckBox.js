/**
 * CheckBox widget module
*/
Std.ui.module("CheckBox",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"checked",
    /*[#module option:option]*/
    option:{
        level:1,
        defaultClass:"StdUI_CheckBox",
        text:"CheckBox",
        checked:false
    },
    /*[#module option:action]*/
    action:{
        content:"text"
    },
    /*[#module option:private]*/
    private:{
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].mouse({
                click:function(){
                    that.checked(!that.checked());
                }
            });
        }
    },
    /*[#module option:public]*/
    public:{
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
            return this.opt("checked",state,function(){
                this.toggleClass("checked",state).emit("checked",state);
            });
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        dom.append([
            that[1] = newDiv("_icon StdUI_CheckBox_Icon"),
            that[2] = newDiv("_text")
        ]);

        that.call_opts({
            text:"",
            checked:false
        },true);

        that.initEvents();
    }
});
