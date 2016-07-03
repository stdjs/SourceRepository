/**
 *  code mirror
*/
Std.css({
    ".StdUI_CodeMirror":{
        border:"1px solid #B1B3B0",
        overflow:"hidden"
    }
});

Std.ui.module("CodeMirror",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"change",
    /*[#module option:option]*/
    option:{
        level:4,
        value:"",
        autoHint:false,
        defaultClass:"StdUI_CodeMirror"
    },
    /*[#module option:private]*/
    private:{
        hintTimer:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        beforeRender:function(){
            var that = this;
            var opts = that.opts;

            that.editor = CodeMirror(that[0],opts);
            that.editor.on("change",function(){
                that.emit("change",that.value())
            });
        },
        /*
         * render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            that.call_opts({
                autoHint:false
            },true)
        },
        /*
         * height
        */
        height:function(height){
            var that = this;

            if(!isNumber(height)){
                height = that.height();
            }
            if(that.editor){
                height -= that.boxSize.height;
                height -= that.boxSize.extraHeight;
                that.editor.setSize("auto",height)
            }
        },
        /*
         * destroy
        */
        destroy:function(){
            var that = this;

            that.editor = null;

            if(that._hintTimer !== null){
                clearTimeout(that._hintTimer);
                that._hintTimer = null;
            }
        }
    },
    /*[#module option:initialize]*/
    initialize:{
        /*
         * init auto hint
        */
        initAutoHint:function(){
            var that = this;
            var opts = that.opts;

            that.editor.on("keyup",function(){
                if(!opts.autoHint){
                    return;
                }
                if(that._hintTimer !== null){
                    clearTimeout(that._hintTimer);
                    that._hintTimer = null;
                }
                that._hintTimer = setTimeout(function(){
                    var token    = that.cursorToken();
                    var text     = token.string.trim();
                    var lastChar = text.charAt(text.length - 1);

                    if(isEmpty(text)){
                        return;
                    }
                    if(lastChar == "." || lastChar == "$" || Std.is.alnum(lastChar)){
                        that.showHint();
                    }
                    that._hintTimer = null;
                },500);
            });
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * autoHint
        */
        autoHint:function(autoHint){
            return this.opt("autoHint",autoHint,function(){
                this.initAutoHint();
            });
        },
        /*
         * cursor token
        */
        cursorToken:function(){
            var editor = this.editor;

            return editor.getTokenAt(editor.getCursor());
        },
        /*
         * showHint
        */
        showHint:function(){
            var that   = this;
            var editor = that.editor;

            isFunction(editor.showHint) && editor.showHint({
                completeSingle:false,
                alignWithWord:true
            });

            return that;
        },
        /*
         * value
        */
        value:function(value){
            var that   = this;
            var editor = that.editor;

            if(!that.rendered){
                return that.opt("value",value);
            }
            if(value === undefined){
                return editor.getValue();
            }
            editor.setValue(value);
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(){

    },
    /*#module option:support]*/
    support:{
        rule:{
            content:"text"
        },
        html:{
            create:function(dom,children,HTMLContent){
                this.value(HTMLContent);
            }
        }
    }
});
