Std.ui.module("KindEditor",{
    parent:"widget",
    option:{
        level:4,
        height:200,
        value:""
    },
    private:{
        timer:null
    },
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            that.editor = KindEditor.create(that[0].dom,{
                width:that.width() - 2,
                height:that.height()
            });

            if(opts.value){
                that.value(opts.value);
            }
        },
        /*
         * remove
        */
        remove:function(){
            this.editor.remove();
        },
        /*
         * width
        */
        width:function(){
            var that = this;

            that.updateEditorSize();
        },
        /*
         * height
        */
        height:function(){
            var that = this;

            that.updateEditorSize();
        }
    },
    protected:{
        updateEditorSize:function(){
            var that = this;
            var data = "";

            if(that._timer !== null){
                clearTimeout(that._timer);
                that._timer = null;
            }
            that._timer = setTimeout(function(){
                if(that.editor){
                    data = that.value();
                    that.editor.remove();
                }
                that.editor = KindEditor.create(that[0].dom,{
                    width:that.width() - 2,
                    height:that.height()
                });
                that.value(data);
                that._timer = null;
            },1);

            return that;
        }
    },
    public:{
        /*
         * value
        */
        value:function(value){
            var that = this;

            if(value === undefined){
                return that.editor.html();
            }
            that.editor.html(value);

            return that;
        }
    },
    main:function(that,opts,dom){

    }
});
