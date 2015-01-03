/**
 * RadioBox widget module
*/
Std.ui.module("RadioBox",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        level:1,
        className:"StdUI_RadioBox",
        text:"RadioBox",
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
                    var checked = that.checked();
                    if(checked == false){
                        that.checked(true)
                    }
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
                this[1].toggleClass("checked",state);
            });
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        dom.append([
            that[1] = newDiv("_icon StdUI_RadioBox_Icon"),
            that[2] = newDiv("_text")
        ]);

        that.call_opts({
            text:"",
            checked:false
        },true);

        that.initEvents();
    }
});

