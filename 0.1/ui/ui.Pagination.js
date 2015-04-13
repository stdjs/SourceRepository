/**
 * pagination widget module
*/
Std.ui.module("Pagination",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        level:3,
        total:0,
        page:0,
        pageSize:9,
        pageCount:"auto",
        pageRows:10,
        tabIndex:null,
        link:false,
        hotKey:false,
        text:"<b><?=page?></b> / <b><?=pageCount?></b><b style='margin-left: 10px'>total:</b><?=total?>",
        href:"#<?=page?>",
        defaultClass:"StdUI_Pagination",
        height:34,
        first:"First",
        last:"Last",
        prev:"Prev",
        next:"Next",
        editable:true
    },
    /*[#module option:events]*/
    events:"change",
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            that.refreshPages();
            that.refreshText();
            that.refreshList();
        },
        /*
         * remove
        */
        remove:function(){
            var that = this;

            if(that._pageList){
                that._pageList.remove();
            }
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * init keyboard
        */
        initKeyboard:function(){
            var that = this;

            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;
            var doms = that.D;

            that[0].on("mouseenter","._buttons > ._button",function(e){
                var button = this.mouse({
                    auto:false,
                    click:function(){
                        if(button.hasClass("selected")){
                            return;
                        }
                        var result = Std.each("first prev next last",function(i,name){
                            if(name in doms && doms[name].is(button)){
                                that.page(that.pageIndex(name));
                                return true;
                            }
                        });
                        if(result !== true){
                            that.page(that.pageIndex(button.text()));
                        }
                    }
                },e);
            });
            return that;
        },
        /*
         * init elements
        */
        initElements:function(){
            var that = this;
            var doms = that.D = {
                main:newDom("tr"),
                buttons:newDom("td"),
                text:newDom("td","_text")
            };

            that[0].append(newDom("table").attr({cellspacing:0,cellpadding:0}).append(
                newDom("tbody").append(
                    doms.main = newDom("tr").append([
                        doms.left,
                        doms.buttons.append([
                            doms.left  = newDiv("_buttons -left"),
                            doms.pages = newDiv("_buttons -pages"),
                            doms.right = newDiv("_buttons -right"),
                            doms.jump  = newDiv("_jump")
                        ]),
                        doms.text
                    ])
                )
            ));
            return that;
        },
        /*
         * create button
        */
        createButton:function(page){
            var that      = this;
            var opts      = that.opts;
            var element   = newDom("a");
            var className = "_button";

            if(opts.link){
                element.attr("href",(new Std.template(opts.href)).render({
                    page:that.pageIndex(page)
                }))
            }
            if("first prev next last".indexOf(page) != -1){
                element.html(opts[page]);
                className += " -" +page;
            }else{
                element.html(page);
            }
            return element.className(className);
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * total
        */
        total:function(total){
            return this.opt("total",total,function(){
                this.refreshText();
            });
        },
        /*
         * text
         */
        text:function(text){
            return this.opt("text",text,function(){
                this.refreshText();
            });
        },
        /*
         * editable
        */
        editable:function(editable){
            var that = this;

            return that.opt("editable",editable,function(){
                if(editable){
                    that.refreshList();
                }else{
                    that._pageList && that._pageList.remove();
                }
            });
        },
        /*
         * page size
        */
        pageSize:function(size){
            return this.opt("pageSize",size,function(){
                this.refreshPages().refreshText();
            });
        },
        /*
         * page rows
        */
        pageRows:function(number){
            return this.opt("pageRows",number);
        },
        /*
         * page
        */
        page:function(page){
            var that     = this;
            var opts     = that.opts;
            var pageList = that._pageList;

            if(page === undefined){
                return opts.page;
            }
            if(page !== opts.page){
                opts.page = page;
                if(pageList && pageList.value() != page){
                    pageList.value(page);
                }
                that.refreshPages().refreshText().emit("change",page);
            }
            return that;
        },
        /*
         * page index
        */
        pageIndex:function(page){
            switch(page){
                case "first":
                    page = 1;
                    break;
                case "prev":
                    page = this.page() - 1;
                    break;
                case "next":
                    page = this.page() + 1;
                    break;
                case "last":
                    page = this.pageCount();
                    break;
            }
            return ~~page;
        },
        /*
         * page count
        */
        pageCount:function(count){
            var that = this;
            var opts = that.opts;

            if(count === undefined){
                if(opts.pageCount === "auto"){
                    return Math.ceil(opts.total / opts.pageSize);
                }
                return opts.pageCount;
            }
            opts.pageCount = count;
            return that.refreshText().refreshList();
        },
        /*
         * page numbers
        */
        pageNumbers:function(){
            var that  = this;
            var opts  = that.opts;
            var page  = opts.page;
            var min   = page;
            var max   = that.pageCount();
            var half  = Math.floor(opts.pageSize / 2);
            var pages = [];

            for(var i=page-1;i>page-1-half;i--){
                if(i < 1) break; min = i;
            }
            for(i=page+1;i<page+1+half;i++){
                if(i > Math.ceil(opts.total / opts.pageSize)) break; max = i;
            }
            for(i=min;i<=max;i++){
                pages.push(i);
            }
            return pages;
        },
        /*
         * refresh text
        */
        refreshText:function(){
            var that = this;

            if(that.renderState){
                (new Std.template(that.opts.text)).renderTo(that.D.text.clear(),{
                    page:that.page(),
                    pageSize:that.pageSize(),
                    pageCount:that.pageCount(),
                    total:that.total()
                });
            }
            return that;
        },
        /*
         * refresh list
        */
        refreshList:function(){
            var that = this;

            if(!that.opts.editable){
                return that;
            }
            if(!that._pageList){
                that._pageList = Std.ui("ComboBox",{
                    inputMode:"input",
                    value:that.page(),
                    renderTo:that.D.jump,
                    width:60
                });
                that._pageList.on("change",function(){
                    that.page(~~this.value());
                });
            }
            that._pageList.clear().append(function(){
                var pages = [];
                for(var i=1,length=that.pageCount();i<=length;i++){
                    if(i > 10000 && i + 10000 < length){
                        i += 9999;
                    }else if(i > 1000 && i + 1000 < length){
                        i += 999;
                    }else if(i > 100 && i + 100 < length){
                        i += 99;
                    }
                    pages.push(i+"");
                }
                return pages;
            }()).value(that.page());

            return that;
        },
        /*
         * refresh pages
        */
        refreshPages:function(){
            var that = this.clear();
            var opts = that.opts;
            var doms = that.D;
            var page = opts.page;

            if(!that.renderState){
                return that;
            }
            if(page > 1){
                doms.left.append([
                    doms.first = that.createButton("first"),
                    doms.prev  = that.createButton("prev")
                ]);
            }
            Std.each(that.pageNumbers(),function(i,number){
                var pageElement = that.createButton(number).appendTo(doms.pages);
                if(page == number){
                    pageElement.addClass("selected");
                }
            });
            if(page < that.pageCount()){
                doms.right.append([
                    doms.next = that.createButton("next"),
                    doms.last = that.createButton("last")
                ]);
            }
            return that;
        },
        /*
         * repaint
        */
        repaint:function(){
            var that = this;

            that.refreshPages();
            that.refreshText();
            that.refreshList();

            return that;
        },
        /*
         * clear
        */
        clear:function(){
            var that = this;
            var doms = that.D;

            doms.left.clear();
            doms.pages.clear();
            doms.right.clear();

            Std.each("first prev next last",function(i,name){
                delete doms[name];
            });
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        if(opts.change){
            that.on("change",opts.change);
        }
        that.initElements();
        that.initEvents();
        that.initKeyboard();
    }
});

/**
 * data source pagination plugin
*/
Std.plugin.module("dataSourcePagination",{
    /*[#module option:option]*/
    option:{
        dataPath:""
    },
    /*[#module option:private]*/
    private:{
        /*
         * init DataGrid
        */
        initDataGrid:function(){
            var that       = this;
            var opts       = that.opts;
            var widget     = that.widget;
            var pagination = that._pagination;
            var updateSize = function(){
                widget[2].height(widget.height() - widget.opts.headerHeight - widget.boxSize.height - 1 - pagination.height());
            };

            widget.on("resize",updateSize);
            widget.on("dataSourceLoad",function(responseJSON){
                var data = Std.mold.dataPath(responseJSON,opts.dataPath);

                Std.each("total pageSize pageCount pageRows page",function(i,type){
                    pagination.opts[type] = data[type];
                });
                pagination.refreshPages().refreshText().refreshList();
            });
            pagination.renderTo(widget)[0].css("borderTopColor",widget[0].css("borderTopColor"));

            if(widget.renderState){
                updateSize();
            }
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * remove
        */
        remove:function(){
            this._pagination.remove();
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,widget){
        that._pagination = Std.ui("Pagination",opts);

        switch(widget.ui){
            case "DataGrid":
                that.initDataGrid();
                break;
        }
    }
});