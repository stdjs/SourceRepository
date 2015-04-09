/**
 *  pagination widget module
*/
Std.ui.module("Pagination",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        level:3,
        total:0,
        pageSize:10,
        pageCount:0,
        link:false,
        linkHref:"#<?=page?>",
        infoText:"",
        defaultClass:"StdUI_Pagination",
        height:35,
        first:true,
        last:true,
        prev:true,
        next:true,
        firstText:"First",
        lastText:"Last",
        prevText:"Prev",
        nextText:"Next",
        dataSource:null
    },
    /*[#module option:events]*/
    events:"change",
    /*[#module option:extend]*/
    extend:{

    },
    /*[#module option:private]*/
    private:{
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var state = false;


            return that;
        },
        /*
         * init keyboard
         */
        initKeyboard:function(){
            var that = this;


            return that;
        },
        /*
         * init
        */
        init:function(){

        }
    },
    /*[#module option:public]*/
    public:{

    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D = {};

    }
});

