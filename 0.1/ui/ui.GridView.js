/**
 * grid view widget module
*/
Std.ui.module("GridView",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"clear selectionModeChange cellChange columnClick rowClick cellClick columnDblClick rowDblClick cellDblClick columnDropStart columnDropStop removeColumn removeRow dataSourceLoad",
    /*[#module option:option]*/
    option:{
        level:4,
        height:300,
        minWidth:120,
        minHeight:60,
        headerHeight:29,
        headerVisible:true,
        columnWidth:80,
        columnResizable:true,
        columnSortable:false,
        columnTextAlign:"left",
        columnDroppable:true,
        columnEditable:false,
        rowHeight:30,
        rowEditable:false,
        rowNumbers:false,
        rowCheckable:false,
        rowCollapsible:false,
        cellPadding:3,
        cellEditable:false,
        cellBorder:true,
        cellTextAlign:"left",
        cellDroppable:false,
        contextMenu:null,
        stripeRows:false,
        hoverMode:"row",     //row,cell
        selectionMode:"row", //row,rows,cell,cells,checkedRows,column,columns,none
        items:null,
        columns:null,
        dataSource:null,
        value:null,
        defaultClass:"StdUI_GridView"
    },
    /*[#module option:private]*/
    private:{
        /*
         * row count
        */
        rowCount:0,
        /*
         * column count
        */
        columnCount:0,
        /*
         * selected column
        */
        selectedColumn:null,
        /*
         * selected row
        */
        selectedRow:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){

        },
        /*
         * height
        */
        height:function(){

        },
        /*
         * remove
        */
        remove:function(){

        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init header
        */
        initHeader:function(){
            var that = this;


        },
        /*
         * init body
        */
        initBody:function(){

        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].focussing(function(){
                that.addClass("focus");
            },function(){
                that.removeClass("focus");
            }).mouse();
        },
        /*
         * init base node
        */
        initBaseNode:function(){
            var that = this;
            var doms = that.D = {};

            doms.table = newDom("table").append(doms.tbody = newDom("tbody").append([
                doms.header = newDom("tr","_header").append([
                    doms.lcolumns = newDom("td","_lcolumns"),
                    doms.rcolumns = newDom("td","_rcolumns")
                ]),
                doms.body   = newDom("tr","_body").append([
                    doms.lrows    = newDom("td","_lrows"),
                    doms.rrows    = newDom("td","_rrows")
                ])
            ])).appendTo(that[0]);
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * data source
        */
        dataSource:function(dataSource){
            return this.opt("dataSource",dataSource,function(){
                this.reload();
            });
        },
        /*
         * columnResizable
        */
        columnResizable:function(state){
            return this.opt("columnResizable",state);
        },
        /*
         * selection mode
        */
        selectionMode:function(mode){
            return this.opt("selectionMode",mode,function(){
                this.emit("selectionModeChange",mode);
            });
        },
        /*
         * column draggable
        */
        columnDroppable:function(droppable){
            return this.opt("columnDroppable",droppable);
        },
        /*
         * column sortable
        */
        columnSortable:function(sortable){
            return this.opt("columnSortable",sortable);
        },
        /*
         * column text align
        */
        columnTextAlign:function(value){
            return this.opt("columnTextAlign",value,function(){
                this.updateStyle();
            });
        },
        /*
         * reload
        */
        reload:function(data){
            var that       = this;
            var opts       = that.opts;
            var dataSource = opts.dataSource;
            var read       = dataSource.read;

            if(dataSource && dataSource.type === "ajax" && isObject(read)){
                Std.ajax.json({
                    url:read.url,
                    data:Std.extend(read.data || {},data),
                    type:read.type || "get",
                    success:function(responseJSON){
                        that.clear();
                        that.appendRow(Std.mold.dataPath(responseJSON,read.dataPath));
                        that.emit("dataSourceLoad",responseJSON);
                    }
                });
            }
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        that.addClass("StdUI_" + that.objectName);
        that._rows    = [];
        that._columns = [];

        that.initBaseNode();
        that.initEvents();
    }
});