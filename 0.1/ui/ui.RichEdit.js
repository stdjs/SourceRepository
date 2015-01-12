(function(Std,undefined){
    var richEditModule = Std.ui.module("richEdit",{
        /*[#module option:parent]*/
        parent:"widget",
        /*[#module option:action]*/
        action:{
            content:"value"
        },
        /*[#module option:option]*/
        option:{
            className:"StdUI_RichEdit",
            level:4,
            value:"",
            width:"auto",
            height:250,
            mode:"design",  //design,source
            fullScreen:false,
            designMode:true,
            tools:"undo redo delete ; " +
                  "bold italic strikeThrough underline removeFormat ; " +
                  "formatBlock fontSize fontName ; foreColor backColor ; " +
                  "justifyLeft justifyCenter justifyRight justifyFull ; " +
                  "createLink unlink ; " +
                  "image ; " +
                  "table languageCode horizontal ; template"
        },
        /*[#module option:events]*/
        events:"",
        /*[#module option:statics]*/
        static:{
            tools:{}
        },
        /*[#module option:protected]*/
        protected:{
            selection:null,
            range:null
        },
        /*[#module option:extend]*/
        extend:{
            /*
             * before render
            */
            beforeRender:function(){
                var that = this;

                that.initHeader();
                that.initFooter();

            },
            /*
             * render
            */
            render:function(){
                var that = this;
                var opts = that.opts;

                switch(opts.mode){
                    case "design":
                        that.initDesignEditor();
                        break;
                    case "source":
                        that.initSourceEditor();
                        break;
                }
                if(opts.fullScreen){
                    that.fullScreen(true);
                }
                that.initEvents();
                that.focus();
                that.refreshButtons();
            },
            /*
             * height
            */
            height:function(height){
                var that    = this;
                var boxSize = that.boxSize;

                if(height === "auto"){
                    height = that[0].offsetHeight();
                }

                that.D.client.height(height - boxSize.height - that.D.header.offsetHeight() - boxSize.footerHeight - 11);
            },
            remove:function(){
                var widgets = this.widgets;

                Std.each(widgets,function(name,widget){
                    widget.remove();
                    delete widgets[name];
                });
            },
            /*
             * init_boxSize
            */
            init_boxSize:function(){
                var that    = this;
                var boxSize = that.boxSize;

                if(!("footerHeight" in boxSize)){
                    boxSize.footerHeight = that.D.footer.offsetHeight();
                }
            }
        },
        /*[#module option:private]*/
        private:{
            /*
             * create window
            */
            createWindow:function(name,options){
                var that    = this;
                var widgets = that.widgets;

                if(name in widgets && widgets[name].renderState !== -1){
                    return widgets[name].show();
                }
                var window = widgets[name] = Std.ui("window",Std.extend({
                    lock:true,
                    maximizable:false,
                    resizable:false,
                    closeMethod:"hide"
                },options));

                return window;
            },
            /*
             * refresh buttons
            */
            refreshButtons:function(){
                var that           = this;
                var startContainer = that.startContainer();

                Std.each(that.tools,function(i,tool){
                    var command = tool.command;

                    if(tool.state !== null){
                        tool.dom.removeClass(tool.state);
                        tool.state = null;
                    }
                    if(isString(command)){
                        if(that.queryCommandState(command)){
                            tool.dom.addClass(tool.state = "selected");
                        }
                    }else if(isFunction(tool.queryState) && startContainer){
                        var state = tool.queryState.call(that,startContainer,tool);
                        if(state !== undefined){
                            tool.dom.addClass(tool.state = state);
                        }
                    }
                });

                return that;
            },
            /*
             *  init design editor
            */
            initDesignEditor:function(){
                var that   = this;
                var doms   = that.D;
                var design = doms.design = new Std.dom("div._design",doms.client);

                Std.dom(design).on({
                    keydown:function(e){
                        that._range = null;
                        if(e.keyCode == 9){
                            that.execCommand("insertHTML",'\t');
                            e.preventDefault();
                        }
                    },
                    keyup:function(){
                        that.refreshButtons();
                    },
                    mouseup:function(){
                        that.refreshButtons();
                    }
                });

                if(that.opts.designMode){
                    that.designMode(true);
                }
                doms.designButton.addClass("selected");
                return that;
            },
            /*
             *  init source code editor
            */
            initSourceEditor:function(){
                var that  = this;
                var doms  = that.D;

                doms.source = newDom("textarea","_source").appendTo(doms.client);
                doms.sourceButton.addClass("selected");

                return that;
            },
            /*
             *  init events
            */
            initEvents:function(){
                var that    = this;
                var opts    = that.opts;
                var doms    = that.D;
                var tools   = that.tools;

                doms.header.on("mousedown",function(e){
                    var nodeName = e.target.nodeName;
                    if(nodeName !== "INPUT"){
                        e.preventDefault();
                    }
                    that._range = doms.design.selectionRange();
                });
                doms.header.delegate("mouseenter","._button[toolname]",function(e){
                    var tool   = Std.dom(this);
                    var config = tools[tool.attr("toolname")];

                    if(tool.state === "disabled" || that.mode() === "source"){
                        return false;
                    }
                    tool.mouse({
                        auto:false,
                        click:function(){
                            var command = config.command;

                            if(isFunction(command)){
                                command.call(that);
                            }else if(isString(command)){
                                that.execCommand(command);
                            }
                        }
                    },e);
                });

                doms.footer.delegate("click","._switchButton",function(e){
                    var button = Std.dom(this);
                    var value  = that.value();

                    if(button.hasClass("_design") && opts.mode == "source"){
                        that.mode("design");
                        that.value(value);
                    }
                    if(button.hasClass("_source") && opts.mode == "design"){
                        that.mode("source");
                        that.value(value);
                    }
                });
                return that;
            },
            /*
             *  init header
            */
            initHeader:function(){
                var that = this;
                var opts = that.opts;

                Std.each(opts.tools,function(i,name){
                    if(!isEmpty(name)){
                        that.appendTool(name,richEditModule.tools[name]);
                    }
                });

                return that;
            },
            /*
             *  init footer
            */
            initFooter:function(){
                var that = this;
                var doms = that.D;

                doms.footer.append([
                    doms.designButton     = newDiv("_switchButton _design").html("Design"),
                    doms.sourceButton     = newDiv("_switchButton _source").html("Source"),
                    doms.fullScreenButton = newDiv("_fullScreen").attr("title","full-screen").mouse({
                        click:function(){
                            that.fullScreen(!that.fullScreen());
                        }
                    })
                ]);
                return that;
            }
        },
        /*[#module option:public]*/
        public:{
            /*
             * show full screen
            */
            fullScreen:function(state){
                var that = this;
                return that.opt("fullScreen",state,function(){
                    if(state === true){
                        var windowObject = Std.dom(window);
                        that._size = that.size();
                        that[0].addClass("_fullScreen").css("zIndex",++Std.ui.status.zIndex);
                        that.D.fullScreenButton.addClass("selected");
                        that.size(windowObject.width(),windowObject.height());
                    }else{
                        that[0].removeClass("_fullScreen");
                        that.D.fullScreenButton.removeClass("selected");
                        that.size(that._size);
                    }
                });
            },
            /*
             * focus
            */
            focus:function(){
                var that = this;
                var mode = that.opts.mode;

                if(mode === "design"){
                    that.D.design.focus();
                }else if(mode === "source"){
                    that.D.source.focus();
                }
                return that;
            },
            /*
             * html
            */
            value:function(value){
                var that = this;
                var opts = that.opts;
                var doms = that.D;
                var mode = opts.mode;

                if(mode === "design"){
                    if(value === undefined){
                        return that.D.design.html();
                    }
                    doms.design.html(value);
                }else if(mode === "source"){
                    if(value === undefined){
                        return doms.source.value();
                    }
                    doms.source.value(value)
                }
                return that;
            },
            /*
             * text
            */
            text:function(text){
                var that   = this;
                var design = that.D.design;

                if(text === undefined){
                    return design.text();
                }
                design.text(text);
                return that;
            },
            /*
             * preview
            */
            designMode:function(state){
                var that = this;
                var doms = that.D;

                if(!doms.design){
                    that.initDesignEditor();
                }
                doms.design.contentEditable(state);
                return that;
            },
            /*
             * mode
            */
            mode:function(mode){
                var that = this;
                var doms = that.D;

                return that.opt("mode",mode,function(){
                    if(mode === "design"){
                        if(!doms.design){
                            that.initDesignEditor();
                        }
                        if(doms.source){
                            doms.source.hide();
                        }
                        doms.design.show();
                        doms.designButton.addClass("selected");
                        doms.sourceButton.removeClass("selected");
                        doms.header.removeClass("disabled");
                    }else{
                        if(!doms.source){
                            that.initSourceEditor();
                        }
                        if(doms.design){
                            doms.design.hide();
                        }
                        doms.source.show().focus();
                        doms.designButton.removeClass("selected");
                        doms.sourceButton.addClass("selected");
                        doms.header.addClass("disabled");
                    }
                });
            },
            /*
             *  select
            */
            select:function(){
                var that = this;

                that.D.design.select();

                return that;
            },
            /*
             *  selected text
            */
            selectedText:function(){
                return this.D.design.selectedText();
            },
            /*
             *  selected html
            */
            selectedHTML:function(){
                return this.D.design.selectedHTML();
            },
            /*
             * restore selection range
            */
            restoreSelectionRange:function(){
                var that = this.focus();

                if(that._range !== null){
                    that.D.design.selectionRange(that._range);
                }
                return that;
            },
            /*
             *  exec command
            */
            execCommand:function(command,value){
                var that           = this.restoreSelectionRange();
                var selection      = that[0].selection();
                var documentObject = that[0].document();
                var hasCreateRange = "createRange" in selection;

                if(command.toLowerCase() == "inserthtml" && hasCreateRange){
                    selection.createRange().pasteHTML(value);
                }else{
                    documentObject.execCommand(command,0,value);
                }
                return that.refreshButtons();
            },
            /*
             * start container
            */
            startContainer:function(selectionRange){
                var range          = selectionRange || this.D.design.selectionRange();
                var startContainer = range.startContainer;

                if(startContainer){
                    if(startContainer.nodeType === 3){
                        startContainer = startContainer.parentNode;
                    }
                }else{
                    if(range.item){
                        return range.item(0);
                    }
                    var duplicate = range.duplicate();
                    if(duplicate.text.length > 0){
                        duplicate.moveStart('character',1)
                    }
                    duplicate.collapse(1);

                    return duplicate.parentElement();
                }
                return startContainer;
            },
            /*
             * query command value
            */
            queryCommandValue:function(command){
                return this[0].document().queryCommandValue(command);
            },
            /*
             * query command state
             */
            queryCommandState:function(command){
                return this[0].document().queryCommandState(command);
            },
            /*
             * append tool button
            */
            appendTool:Std.func(function(toolName,config){
                var that  = this;
                var tools = that.tools;

                if(toolName === ';'){
                    that.D.header.append(newDiv("_sep"));
                    return that;
                }
                if(!isString(toolName) && !isObject(config)){
                    return that;
                }
                if(toolName in tools){
                    that.removeTool(toolName);
                }
                var tool = tools[toolName] = {
                    dom:newDiv("_button " + config.className || "").attr({
                        title    : config.title || "",
                        toolname : toolName
                    }).appendTo(that.D.header),
                    command:config.command || null,
                    state:null
                };
                if(config.widget){
                    tool.dom.widget(config.widget);
                }
                if(config.element){
                    tool.dom.append(new Std.dom(config.element));
                }
                if(isFunction(config.queryState)){
                    tool.queryState = config.queryState;
                }
                if(isFunction(config.init)){
                    config.init.call(that);
                }
            },{
                each:[isArray,isObject]
            }),
            /*
             * remove button
            */
            removeTool:Std.func(function(toolName){
                var that  = this;
                var tools = that.tools;

                if(toolName in tools){
                    tools[toolName].dom.remove();

                    delete tools[toolName];
                }
            },{
                each:[isArray]
            })
        },
        /*[#module option:main]*/
        main:function(that,opts,dom){
            var doms = that.D = {};

            that.widgets = {};
            that.tools   = {};
            dom.append([
                doms.header = newDiv("_header"),
                doms.client = newDiv("_client"),
                doms.footer = newDiv("_footer")
            ]);
        },
        /*[#module option:entrance]*/
        entrance:function(module){
            var defaultActions = [
                "bold","italic","strikeThrough","underline","removeFormat",
                "justifyLeft","justifyCenter","justifyRight","justifyFull",
                "undo","redo","delete",
                "unlink"
            ];

            defaultActions.each(function(i,data){
                module.tools[data] = {
                    command:data,
                    title:data.unCamelCase(),
                    className:"_"+data
                };
            });
        }
    });


    /*
     * format block
    */
    richEditModule.tools.formatBlock = {
        className:"_combobox _formatBlock",
        title:"format block",
        widget:{
            ui:"combobox",
            height:24,
            value:0,
            items:[
                {text:"null",value:0},
                {text:"p",value:"p"},
                {text:"h1",css:{fontSize:"30px"},value:"h1"},
                {text:"h2",css:{fontSize:"27px"},value:"h2"},
                {text:"h3",css:{fontSize:"24px"},value:"h3"},
                {text:"h4",css:{fontSize:"21px"},value:"h4"},
                {text:"h5",css:{fontSize:"18px"},value:"h5"},
                {text:"h6",value:"h6"}
            ]
        },
        queryState:function(container){
            var that   = this;
            var widget = that.tools["formatBlock"].dom.widget();
            var result = Std.each("P H1 H2 H3 H4 H5",function(i,value){
                if(container.nodeName === value){
                    widget.emit(false);
                    widget.value(value.toLowerCase());
                    widget.emit(true);
                    return false;
                }
            });
            if(result !== false){
                widget.emit(false);
                widget.value(0);
                widget.emit(true);
            }
        },
        init:function(){
            var that   = this;
            var widget = that.tools["formatBlock"].dom.widget();

            widget.on("change",function(){
                that.execCommand("formatBlock",this.value())
            })
        }
    };

    /*
     * font size
    */
    richEditModule.tools.fontSize = {
        className:"_combobox _fontSize",
        title:"font size",
        widget:{
        ui:"combobox",
            height:24,
            editable:true,
            inputValue:"12",
            items:[
                {text:"10"},
                {text:"12"},
                {text:"16"},
                {text:"18"},
                {text:"24"},
                {text:"32"},
                {text:"48"}
            ]
        },
        queryState:function(container,tool){
            var size   = Std.dom(container).css("fontSize");
            var widget = tool.dom.widget();

            widget.inputValue(int(size));
        },
        init:function(){
            var that   = this;
            var widget = that.tools["fontSize"].dom.widget();

            widget.on("change",function(){
                var value = widget.inputValue();

                that.execCommand("fontSize",value);
                widget.D.input.value(value);
                Std.dom.united("font[size]",that.design).removeAttr("size").css("fontSize",value + "px");
            })
        }
    };

    /*
     * font name
    */
    richEditModule.tools.fontName = function(){
        var fonts = {
            "sans-serif":0,
            "Microsoft Yahei":1,
            "Source Code Pro":2,
            "楷体":3,
            "宋体":4,
            "黑体":5,
            "隶书":6
        };
        var items = [];
        for(var name in fonts){
            items.push({
                text:name,
                css:{
                    fontFamily:name
                },
                value:fonts[name]
            });
        }
        return {
            className:"_combobox _fontName",
            title:"font name",
            widget:{
            ui:"combobox",
                height:24,
                value:0,
                items:items
            },
            queryState:function(container){
                var that   = this;
                var widget = that.tools["fontName"].dom.widget();
                var face   = Std.dom(container).attr("face");
                widget.emit(false);
                widget.value(fonts[face] || 0);
                widget.emit(true);
            },
            init:function(){
                var that   = this;
                var widget = that.tools["fontName"].dom.widget();

                widget.on("change",function(){
                    that.execCommand("fontName",widget.currentItem().dom.text());
                })
            }
        };
    }();

    /*
     * fore color
    */
    richEditModule.tools.foreColor = {
        className:"_foreColor",
        title:"fore color",
        element:"._color",
        queryState:function(container,tool){
            var that  = this;
            var color = Std.dom(container).css("color");

            Std.dom("._color",tool.dom).css("background",color);
        },
        command:function(){
            var that   = this;
            var create = function(){
                this.colorPicker = Std.ui("colorPicker",{
                    on:{
                        submit:function(){
                            window.hide();
                            var dom   = that.tools["foreColor"].dom;
                            var color = this.value();

                            Std.dom("._color",dom).css("background-color",color);
                            that.execCommand("foreColor",color);
                        }
                    }
                });
                this.opts.centralWidget = {
                    layout:{
                        ui:"VArrayLayout",
                        items:[this.colorPicker]
                    }
                };
            };

            var window = that.createWindow("foreColorWindow",{
                width:400,
                height:280,
                titleBar:{text:"font color"},
                on:{create:create}
            });
        }
    };

    /*
     * background color
    */
    richEditModule.tools.backColor = {
        className:"_backColor",
        title:"background color",
        element:"._color",
        queryState:function(container,tool){
            var color = Std.dom(container).css("background-color");

            Std.dom("._color",tool.dom).css("background",color);
        },
        command:function(){
            var that   = this;
            var events = {
                create:function(){
                    this.colorPicker = Std.ui("colorPicker",{
                        on:{
                            submit:function(){
                                window.hide();
                                var dom   = that.tools["backColor"].dom;
                                var color = this.value();
                                Std.dom("._color",dom).css("background-color",color);
                                that.execCommand("backColor",color);
                            }
                        }
                    });
                    this.opts.centralWidget = {
                        layout:{
                            ui:"VArrayLayout",
                            items:[this.colorPicker]
                        }
                    };
                }
            };
            var window = that.createWindow("backColorWindow",{
                width:400,
                height:280,
                titleBar:{text:"background color"},
                on:events
            });
        }
    };

    /*
     * template
    */
    richEditModule.tools.template = {
        className:"_template",
        title:"load template",
        queryState:function(container){
            var that  = this;

        },
        command:function(){
            var that   = this;
            var window = that.createWindow("templateWindow",{
                width:400,
                height:180,
                resizable:true,
                maximizable:true,
                titleBar:{text:"load template"},
                centralWidget:{
                    layout:{
                        ui:"VBoxLayout",
                        items:[]
                    }
                },
                on:{
                    visible:function(state){
                        if(state === false){

                        }
                    }
                }
            });
        }
    };

    /*
     * table
    */
    richEditModule.tools.table = {
        className:"_table",
        title:"insert table",
        queryState:function(container){
            var that  = this;

        },
        command:function(){
            var that      = this;
            var create    = function(){
                this.widgets = Std.ui({
                    column:{
                        ui:"lineEdit",
                        validator:"Number",
                        value:3
                    },
                    row:{
                        ui:"lineEdit",
                        validator:"Number",
                        value:3
                    },
                    className:{
                        ui:"lineEdit",
                        value:"_table"
                    },
                    background:{
                        ui:"lineEdit",
                        value:"#F8F8F8"
                    },
                    width:{
                        ui:"lineEdit",
                        value:"90%"
                    },
                    height:{
                        ui:"lineEdit",
                        value:"auto"
                    }
                });
                var layoutItems = [
                    {
                        ui:"HBoxLayout",
                        items:[
                            {ui:"label",text:"Column:",width:80},
                            this.widgets.column,
                            {ui:"label",text:"Row:",width:80},
                            this.widgets.row,
                        ]
                    },
                    {
                        ui:"HBoxLayout",
                        items:[
                            {ui:"label",text:"Class:",width:80},
                            this.widgets.className,
                            {ui:"label",text:"Background:",width:80},
                            this.widgets.background
                        ]
                    },
                    {
                        ui:"HBoxLayout",
                        items:[
                            {ui:"label",text:"width:",width:80},
                            this.widgets.width,
                            {ui:"label",text:"height:",width:80},
                            this.widgets.height
                        ]
                    }
                ];
                this.opts.centralWidget = {
                    layout:{
                        ui:"VBoxLayout",
                        items:layoutItems
                    }
                };
            };
            var saveTable = function(){
                var values = {};
                var table  = "(table";

                Std.each("column row className background width height",function(i,name){
                    values[name] = window.widgets[name].value();
                });
                if(!isEmpty(values.className)){
                    table += "." + values.className;
                }
                table += "[style='background:" + values["background"] + ";width:" + values["width"] + ";height:" + values["height"] + ";']";
                table += "[cellspacing=0]";
                table += ">tbody>tr*"+values.row+">(" +"td*" + values.column +"))+p";
                that.execCommand("insertHTML",Std.css.html(table));
                window.remove();
            };
            var window = that.createWindow("tableWindow",{
                width:400,
                height:180,
                titleBar:{text:"Insert Table"},
                toolBar:{
                    items:[
                        {
                            text:"保存",
                            icon:":StdUI_RichEdit_Icon_Save",
                            click:saveTable
                        }
                    ]
                },
                centralWidget:{
                    layout:{
                        ui:"VBoxLayout",
                        items:[]
                    }
                },
                on:{create:create}
            });

        }
    };

    /*
     * language code
    */
    richEditModule.tools.languageCode = {
        className:"_languageCode",
        title:"insert language code",
        queryState:function(){
            var that = this;

        },
        command:function(){
            var that   = this;
            var create = function(){
                this.widgets = Std.ui({
                    "Language":{
                        ui:"combobox",
                        items:[
                            {text:"Javascript",value:"Javascript"},
                            {text:"CSS",value:"CSS"},
                            {text:"HTML",value:"HTML"}
                        ],
                        value:"Javascript"
                    },
                    "SourceCode":{
                        ui:"codeEdit"
                    }
                });
                var layoutItems = [
                    {
                        ui:"HBoxLayout",
                        items:[
                            {ui:"label",text:"Language:",width:80},
                            this.widgets.Language
                        ]
                    },
                    this.widgets.SourceCode
                ];
                this.opts.centralWidget = {
                    layout:{
                        ui:"VBoxLayout",
                        items:layoutItems
                    }
                };
            };

            var saveCode = function(){
                var widgets  = window.widgets;
                var language = widgets["Language"].value();
                var codeText = widgets["SourceCode"].value();

                widgets.SourceCode.value("");
                window.hide();

                that.execCommand("insertHTML","<pre class='StdUI_SourceCode _"+language+"'>" + codeText + "</pre><p></p>");
            };

            var window = that.createWindow("languageCodeWindow",{
                width:800,
                height:600,
                resizable:true,
                maximizable:true,
                titleBar:{text:"Insert Language Code"},
                toolBar:{
                    items:[
                        {
                            text:"保存",
                            icon:":StdUI_RichEdit_Icon_Save",
                            click:saveCode
                        }
                    ]
                },
                on:{create:create}
            });
        }
    };

    /*
     * horizontal line
    */
    richEditModule.tools.horizontal = {
        className:"_horizontal",
        title:"insert horizontal line",
        command:function(){
            var that = this;
            that.execCommand("insertHTML","<hr noshade/><br/>");
        }
    };

    /**
     * image
    */
    richEditModule.tools.image = function(){
        var window = null;
        var createWindow = function(that,callback){
            var toolbar = {
                items:[
                    {
                        text:"保存",
                        icon:":StdUI_RichEdit_Icon_Save",
                        click:function(){
                            var values  = {};
                            var widgets = window.widgets;
                            Std.each("Src Alt Width Height",function(i,name){
                                values[name] = widgets[name].value();
                            });
                            var html = "img[src='"+values.Src+"'][alt='"+values.Alt+"']";
                            if(values["Width"] !== "auto"){
                                html += "[width='"+values.Width+"']";
                            }
                            if(values["Height"] !== "auto"){
                                html += "[height='"+values.Height+"']";
                            }
                            if(isFunction(callback)){
                                callback();
                            }
                            that.execCommand("insertHTML",Std.css.html(html));
                            window.remove();
                        }
                    }
                ]
            };
            var events = {
                create:function(){
                    this.widgets = Std.ui({
                        "Src":{
                            ui:"lineEdit"
                        },
                        "Upload":{
                            ui:"button",
                            text:"Upload",
                            height:26
                        },
                        "Alt":{
                            ui:"lineEdit"
                        },
                        "Width":{
                            ui:"lineEdit",
                            value:"auto"
                        },
                        "Height":{
                            ui:"lineEdit",
                            value:"auto"
                        }
                    });
                    var layoutItems = [
                        {
                            ui:"HBoxLayout",
                            items:[
                                {ui:"label",text:"Url Address:",width:80},
                                this.widgets.Src,
                                this.widgets.Upload
                            ]
                        },{
                            ui:"HBoxLayout",
                            items:[
                                {ui:"label",text:"Link Title:",width:80},
                                this.widgets.Alt
                            ]
                        },{
                            ui:"HBoxLayout",
                            items:[
                                {ui:"label",text:"width:",width:80},
                                this.widgets.Width,

                                {ui:"label",text:"height:",width:80},
                                this.widgets.Height
                            ]
                        }
                    ];
                    this.opts.centralWidget = {
                        layout:{
                            ui:"VBoxLayout",
                            items:layoutItems
                        }
                    };
                }
            };
            window = that.createWindow("ImageWindow",{
                width:500,
                height:180,
                resizable:true,
                titleBar:{text:"image"},
                toolBar:toolbar,
                on:events
            });
        };
        return {
            className:"_image",
            title:"image",
            init:function(){
                var that = this;
                that.D.client.on("dblclick","img",function(){
                    var img = Std.dom(this);

                    createWindow(that,function(){
                        img.remove();
                    });
                    Std.each("Src Alt Width Height",function(i,name){
                        window.widgets[name].value(img.attr(name.toLowerCase()));
                    });
                })
            },
            command:function(){
                var that = this;
                createWindow(that);
            }
        }
    }();

    /*
     * create link tool
    */
    richEditModule.tools.createLink = function(){

        var createWindow = function(that,callback){
            var window = that.createWindow("URLLinkWindow",{
                width:500,
                height:280,
                resizable:true,
                titleBar:{text:"URL Link"},
                toolBar:{
                    items:[
                        {
                            text:"保存",
                            icon:":StdUI_RichEdit_Icon_Save",
                            click:function(){
                                var widgets = window.widgets;
                                var values  = {};

                                ["URLAddress","Title","NewWindow","Class","Text"].each(function(i,name){
                                    values[name] = widgets[name].value();
                                });
                                ["URLAddress","Title","Class","Text"].each(function(i,name){
                                    widgets[name].value("");
                                });

                                var element = newDom("a",values.Class || undefined).html(values["Text"]).attr({
                                    href:values["URLAddress"]
                                });
                                if(values["NewWindow"] == 1){
                                    element.attr("target","_blank");
                                }
                                if(!isEmpty(values["Title"])){
                                    element.attr("title",values["Title"]);
                                }
                                that.execCommand("insertHTML",element.outerHTML());
                                window.hide();
                                element = null;
                                if(isFunction(callback)){
                                    callback();
                                }
                            }
                        }
                    ]
                },
                on:{
                    create:function(){
                        this.widgets = Std.ui({
                            "URLAddress":{
                                ui:"lineEdit"
                            },
                            "Title":{
                                ui:"lineEdit"
                            },
                            "Text":{
                                ui:"textEdit"
                            },
                            "NewWindow":{
                                ui:"combobox",
                                width:80,
                                fixedLayoutWidth:true,
                                items:[
                                    {text:"No",value:0},
                                    {text:"Yes",value:1}
                                ],
                                value:0
                            },
                            "Class":{
                                ui:"lineEdit"
                            }
                        });
                        var layoutItems = [
                            {
                                ui:"HBoxLayout",
                                items:[
                                    {ui:"label",text:"Url Address:",width:80},
                                    this.widgets.URLAddress
                                ]
                            },{
                                ui:"HBoxLayout",
                                items:[
                                    {ui:"label",text:"Link Title:",width:80},
                                    this.widgets.Title
                                ]
                            },{
                                ui:"HBoxLayout",
                                items:[
                                    {ui:"label",text:"New Window:",width:80},
                                    this.widgets.NewWindow,
                                    {ui:"label",text:"class:",width:80},
                                    this.widgets.Class
                                ]
                            },
                            this.widgets["Text"]
                        ];
                        this.opts.centralWidget = {
                            layout:{
                                ui:"VBoxLayout",
                                items:layoutItems
                            }
                        };
                    },
                    visible:function(state){
                        if(state == true && !isEmpty(that.selectedHTML(that._range))){
                            var container = Std.dom(that.startContainer(that._range));

                            if(!container || container.nodeName() !== "A"){
                                return;
                            }
                            var target  = container.attr("target");
                            var title   = container.attr("title");
                            var href    = container.attr("href");
                            var content = that.selectedHTML(that._range);

                            this.widgets["Title"].value(title);
                            this.widgets["Text"].value(content);
                            this.widgets["Class"].value(container.className());
                            this.widgets["URLAddress"].value(href);
                            this.widgets["NewWindow"].value(target === "_blank" ? 1 : 0);
                        }
                    }
                }
            });
        };

        return {
            className:"_createLink",
            title:"Create Url Link",
            queryState:function(container,tool){
                if(container.nodeName === "A"){
                    tool.dom.addClass(tool.state = "selected");
                }
            },
            command:function(){
                var that   = this;


                createWindow(that);
            }
        };
    }();
})(Std);