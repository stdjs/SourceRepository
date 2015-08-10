Std.ui.module("CodeMirror",{
    parent:"widget",
    option:{
        level:4,
        width:200,
        height:200,
        value:"",
        mode:"javascript",
        lineNumbers:true,
        theme:"monokai",
        basePath:null
    },
    private:{
        timer:null
    },
    extend:{
        /*
         * render
         */
        render:function(){
            var that    = this;
            var opts    = that.opts;
            var options = {};

            Std.each("tabSize lineNumbers lineSeparator theme indentUnit smartIndent indentWithTabs electricChars" +
                "specialChars specialCharPlaceholder rtlMoveVisually keyMap extraKeys lineWrapping" +
                "firstLineNumber lineNumberFormatter gutters fixedGutter scrollbarStyle coverGutterNextToScrollbar" +
                "inputStyle readOnly showCursorWhenSelecting lineWiseCopyCut undoDepth historyEventDelay" +
                "cursorBlinkRate cursorScrollMargin cursorHeight resetSelectionOnContextMenu workTime workDelay" +
                "pollInterval flattenSpans addModeClass maxHighlightLength viewportMargin",function(i,name){

                if(name in opts){
                    options[name] = opts[name];
                }
            });
            that.codeMirror = CodeMirror(that[0].dom,Std.extend({
                value : opts.value,
                autofocus:true
            },options));

            Std.loader.js(opts.basePath + "mode/" + opts.mode + "/" + opts.mode + ".js",function(){
                that.option("mode",opts.mode);
            });

            that.codeMirror.setSize("100%","100%");
        }
    },
    public:{
        /*
         * setOption
        */
        option:function(name,value){
            return this.opt(name,value,function(){
                this.codeMirror.setOption(name,value);
            });
        },
        /*
         * value
         */
        value:function(value){
            var that = this;

            if(value === undefined){
                return this.codeMirror.getValue();
            }
            this.codeMirror.setValue(value);

            return that;
        },
        /*
         * theme
        */
        theme:function(theme){
            var that = this;

            return that.opt("theme",theme,function(){
                Std.loader.css(that.opts.basePath + "theme/" + theme + ".css",function(){
                    that.option("theme",theme);
                });
            });
        },
        /*
         * on
        */
        on:function(name,callback){
            var that = this;

            that.codeMirror.on(name,callback);

            return that;
        },
        /*
         * off
        */
        off:function(name,callback){
            var that = this;

            that.codeMirror.off(name,callback);

            return that;
        },
        /*
         * clear
        */
        clear:function(){
            return this.value("")
        }
    },
    main:function(that,opts,dom){
        if(isEmpty(opts.basePath)){
            Std.dom.united("script").each(function(i,script){
                var src = script.attr("src") || "";
                if(/codemirror[\w\-\.]*\.js/.test(src.toLowerCase())) {
                    return opts.basePath = src.substring(0, src.lastIndexOf('/') + 1);
                }
            });
        }
        if(isEmpty(opts.basePath)){
            opts.basePath = "";
        }

        that.call_opts("theme")
    }
});

