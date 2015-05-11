/**
 *  splitter model
*/
Std.model("ui.Splitter",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        tabIndex:NULL,
        className:"StdUI_Splitter",
        resizable:true
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * resizable
        */
        resizable:function(resizable){
            return this.opt("resizable",resizable,function(){
                this[0].css("cursor",resizable ? "row-resize" : "default");
            });
        }
    }

});