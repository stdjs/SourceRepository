/**
 * grid widget module
*/
Std.ui.module("GridView",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"clear selectionModeChange itemClick itemDblClick",
    /*[#module option:option]*/
    option:{
        className:"StdUI_GridView",
        level:4,
        height:300,
        width:500,
        minWidth:120,
        minHeight:60,
        headerHeight:29,
        headerVisible:true,
        headerResizable:true,
        headerSortable:false,
        rowHeight:30,
        rowNumbers:false,
        rowEditable:false,
        rowCheckable:false,
        cellPadding:3,
        cellEditable:false,
        cellTemplate:null,
        cellBorder:true,
        hoverMode:"row",     //row,cell
        selectionMode:"row", //row,rows,cell,cells,checkedRows,column,columns,none
        columns:null,
        items:null,
        dataSource:null
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * column index
        */
        columnIndex:0,
        /*
         * column width
        */
        columnWidth:null,
        /*
         * cell index
        */
        cellIndex:0,
        /*
         * row count
        */
        rowCount:0,
        /*
         * row numbers width
        */
        rowNumbersWidth:60,
        /*
         * column count
        */
        columnCount:0,
        /*
         * lastRowBlock
        */
        lastRowBlock:null,
        /*
         * selected column
        */
        selectedColumn:null,
        /*
         * selected row
        */
        selectedRow:null,
        /*
         * selected cell
        */
        selectedCell:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            that.repaint();
            that.updateStyle();
        },
        /*
         * height
        */
        height:function(height){
            var that    = this;
            var opts    = that.opts;
            var boxSize = that.boxSize;

            if(!isNumber(height)){
                height = that.height();
            }
            that[1].height(opts.headerHeight);
            that[2].height(height - boxSize.height - opts.headerHeight - 1);
        },
        /*
         * remove
         */
        remove:function(item){
            var that = this;

            if(item === undefined){
                that.CSSStyle.remove();
            }
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * init header
        */
        initHeader:function(){
            var that = this;
            var opts = that.opts;

            that[0].append(
                that[1] = newDiv("_header").append(
                    that.D.columns = newDiv("_columns")
                )
            );
            if(opts.columns !== null){
                that.appendColumn(opts.columns);
            }
            return that;
        },
        /*
         * init body
        */
        initBody:function(){
            var that = this;
            var opts = that.opts;

            that[0].append(
                that[2] = newDiv("_body")
            );

            return that;
        },
        /*
         * init scroll event
        */
        initScrollEvent:function(){
            var that  = this;
            var timer = null;

            that[2].on("scroll",function(){
                that[1].css("left",-this.scrollLeft());
            });
            that[2].on("scroll",function(){
                if(timer !== null){
                    clearTimeout(timer);
                }
                timer = setTimeout(function(){
                    that.repaint();
                    timer = null;
                },5);
            });

            return that;
        },
        /*
         * init resizer
        */
        initColumnResizer:function(column){
            var that        = this;
            var offset      = column.offset();
            var resizer     = newDiv("_resizer").appendTo(that[0]).css({
                left   : column.position().x - that[2].scrollLeft(),
                width  : column.offsetWidth(),
                height : that.height()
            });
            var mousemove   = function(e){
                resizer.width(e.pageX - offset.x + 2);
            };
            Std.dom(document).on("mousemove",mousemove).once("mouseup",function(e){
                var width = resizer.outerWidth();
                var index = column.index();

                resizer.remove();
                that._columns[index].width = width;
                this.off("mousemove",mousemove);
                that.updateStyle();
            });
            return that;
        },
        /*
         * init header events
        */
        initHeaderEvents:function(){
            var that = this;
            var opts = that.opts;

            that.D.columns.on("mouseenter","._column",function(e){
                this.mouse({
                    auto:false,
                    down:function(){
                        if(opts.selectionMode.indexOf("column") !== -1){

                        }
                    }
                },e);
            }).on("mouseenter","._column > ._resizeHandle",function(e){
                opts.headerResizable && this.mouse({
                    auto:false,
                    unselect:true,
                    down:function(){
                        that.initColumnResizer(this.parent());
                        return false;
                    }
                },e);
            });
            return that;
        },
        /*
         * init cell events
        */
        initCellEvents:function(){
            var that        = this;
            var opts        = that.opts;
            var dblclick    = function(e){
                if(opts.cellEditable){
                    that.editCell(this);
                }
            };
            var selectCells = function(){
                if(this.hasClass("selected")){
                    that._selectedCell.remove(this.removeClass("selected"));
                }else{
                    that.selectCell(this);
                }
            };
            that[2].delegate("mouseenter","._block > ._row > ._cell",function(e){
                var selectionMode = opts.selectionMode;

                this.mouse({
                    auto:false,
                    classStatus:opts.hoverMode === "cell",
                    down:function(){
                        if(selectionMode === "cells" && e.ctrlKey){
                            selectCells.call(this,e);
                        }else if(selectionMode === "cell"){
                            that.clearSelected("cell");
                            that.selectCell(this);
                        }
                    },
                    dblclick:dblclick
                },e);
            });

            return that;
        },
        /*
         * init row events
        */
        initRowEvents:function(){
            var that       = this;
            var opts       = that.opts;
            var selectRows = function(){
                if(this.hasClass("selected")){
                    that._selectedRow.remove(this.removeClass("selected"));
                }else{
                    that.selectRow(this);
                }
            };
            that[2].delegate("mouseenter","._block > ._row",function(e){
                var selectionMode = opts.selectionMode;

                this.mouse({
                    auto:false,
                    classStatus:opts.hoverMode === "row",
                    down:function(e){
                        if(selectionMode === "rows" && e.ctrlKey){
                            selectRows.call(this,e);
                        }else if(selectionMode === "row"){
                            that.clearSelected("row");
                            that.selectRow(this);
                        }
                    }
                },e);
            });

            return that;
        },
        /*
         * init body events
        */
        initBodyEvents:function(){
            var that = this;

            that.initScrollEvent();
            that.initRowEvents();
            that.initCellEvents();

            return that;
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
            }).mouse({

            });

            that.initHeaderEvents();
            that.initBodyEvents();
            return that;
        },
        /*
         * create row html
        */
        createRowHtml:function(row,cell){
            var html    = "";
            var rowHtml = "";

            for(var i=0;i<cell;i++){
                rowHtml += "<div class='_cell _cell"+i+"'></div>";
            }
            for(var y=0;y<row;y++){
                html += "<div class='_row'>"+rowHtml+"</div>";
            }
            return html;
        },
        /*
         * update Cell
        */
        paintCell:function(element,data){
            var that = this;

            if(isString(data)){
                element.innerHTML = data;
            }else if(isObject(data)){
                if(isWidget(data)){
                    Std.dom(element).widget(data);
                }else if(that.opts.cellTemplate){
                    that.cellTemplate().renderTo(element,data);
                }else if(data.ui){
                    Std.dom(element).widget(data);
                }else{
                    Std.dom(element).set(data);
                }
            }
            return element;
        },
        /*
         * paint cell
        */
        paintRow:function(rowIndex,blockID,rowElement,rowData){
            var that  = this;
            var cells = [];

            for(var y=0,children=rowElement.childNodes,cellCount=children.length;y<cellCount;y++){
                if(!rowData || !rowData.cells[y]){
                    continue;
                }
                cells[y] = that.paintCell(children[y],rowData.cells[y]);
            }

            return that._rows[rowIndex] = {
                row:rowElement,
                cells:cells,
                blockID:blockID
            };
        },
        /*
         * edit cell
        */
        editCell:function(cell){
            var that     = this;
            var position = cell.position();
            var input    = newDom("input","_input").value(cell.text()).on({
                blur:function(){
                    cell.html(this.value());
                    input.remove();
                },
                keypress:function(e){
                    if(e.keyCode === 13){
                        this.blur();
                    }
                }
            }).appendTo(this[2]).css({
                top  : position.y + that[2].scrollTop(),
                left : position.x + that[2].scrollLeft(),
                outerWidth:cell.outerWidth(),
                outerHeight:cell.outerHeight()
            });

            setTimeout(input.focus.bind(
                input.lineHeight(input.height())
            ),10);

            return that;
        },
        /*
         * update row blocks
        */
        updateRowBlocks:function(){
            var that      = this;
            var rowCount  = that._rowCount;
            var rowBlocks = that._rowBlocks;
            var fragment  = document.createDocumentFragment();
            //var t1 = Std.timer.now();

            for(var i=0,length=Math.ceil(rowCount / 10) - that._rowBlocks.length;i<length;i++){
                var block = document.createElement("div");
                block.className = "_block _block"+i;

                fragment.appendChild(block);
                rowBlocks.push(block)
            }
            that[2].dom.appendChild(fragment);

            if(that._lastRowBlock !== null){
                Std.dom(that._lastRowBlock).removeStyle("height");
            }

            that._lastRowBlock = Std.dom(rowBlocks[rowBlocks.length-1]).height(
                (that._rowCount - (rowBlocks.length-1) * 10) * (that.opts.rowHeight)
            ).dom;

            //alert(Std.timer.now() - t1);
            return that;
        },
        /*
         * update style
        */
        updateStyle:function(){
            var that        = this;
            var opts        = that.opts;
            var CSSData     = {};
            var bodyWidth   = 0;
            var gridWidth   = that.width() - that.boxSize.width;
            var rowHeight   = opts.rowHeight - 1;
            var blockHeight = (rowHeight + 1) * 10 + "px";
            var cellHeight  = rowHeight - opts.cellPadding * 2;

            var columnData  = {
                "._column":{
                    height:opts.headerHeight - 1 + "px",
                    lineHeight:opts.headerHeight - 1 + "px"
                }
            };
            var cellData    = {
                "._cell":{
                    padding:opts.cellPadding + "px",
                    height:cellHeight + "px",
                    lineHeight:cellHeight + "px"
                }
            };

            for(var i=0,length=that._columnCount;i<length;i++){
                var column = that._columns[i];
                var width  = (column.width || 80) - 1 + "px";

                columnData["._column" + column.index] = {
                    width:width
                };
                cellData["._cell" + column.index] = {
                    width:(column.width || 80) - opts.cellPadding * 2 + "px"
                };
                bodyWidth += (column.width || 80) + 1;
            }

            if(bodyWidth < gridWidth){
                bodyWidth = "100%";
            }else{
                bodyWidth += "px";
            }

            CSSData[".StdUI_GridView." + that.objectName] = {
                '>':{
                    "._header":{
                        '>':{
                            "._columns":{
                                '>':columnData
                            }
                        }
                    },
                    "._body":{
                        '>':{
                            "._block":{
                                width:bodyWidth,
                                height:blockHeight
                            },
                            "._block > ._row":{
                                height:rowHeight + "px",
                                lineHeight:rowHeight + "px",
                                '>':cellData
                            }
                        }
                    }
                }
            };

            if(opts.cellBorder === false){
                cellData["._cell"].borderColor = "transparent";
            }
            that.CSSStyle.clear().append(CSSData);
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * headerResizable
        */
        headerResizable:function(state){
            return this.opt("headerResizable",state);
        },
        /*
         * header visible
        */
        headerVisible:function(state){
            var that = this;

            return that.opt("headerVisible",state,function(){
                that[1].visible(state);
            });
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
         * row numbers
        */
        rowNumbers:function(state){
            var that = this;
            var doms = that.D;

            return that.opt("rowNumbers",state,function(){
                that.renderState && that.updateStyle();
            });
        },
        /*
         * row count
        */
        rowCount:function(value){
            var that = this;

            if(value === undefined){
                return that._rowCount;
            }
            if(value === that._rowCount){
                return that;
            }

            that._rowCount = value;
            that.updateRowBlocks();
            that.repaint();

            return that;
        },
        /*
         * cell template
        */
        cellTemplate:function(template){
            var that = this;
            var opts = that.opts;

            if(template === undefined){
                return opts.cellTemplate;
            }
            if(isString(template)){
                template = Std.template(template);
            }
            if(template instanceof Std.template){
                opts.cellTemplate = template;
            }
            return that;
        },
        /*
         * repaint
        */
        repaint:function(){
            var that        = this;
            var opts        = that.opts;
            var items       = opts.items;
            var blocks      = that._rowBlocks;
            var scrollTop   = that[2].dom.scrollTop;
            var blockHeight = (opts.rowHeight) * 10;
            var beginBlock  = Math.floor(scrollTop / blockHeight);
            var blockNumber = Math.ceil((that.height() - that.boxSize.height - opts.headerHeight - 1) / blockHeight  + (scrollTop / blockHeight % 1));

            for(var i=0;i<blockNumber;i++){
                var blockID = beginBlock + i;
                var block   = blocks[blockID];

                if(!block || block.childNodes.length !== 0){
                    continue;
                }
                var rowCount  = block === that._lastRowBlock ? that._rowCount - blockID * 10 : 10;
                var blockHtml = that.createRowHtml(rowCount,that._columnCount);
                var fragment  = Std.dom.fragment(blockHtml);

                for(var y=0,rows=fragment.childNodes,length=rows.length;y<length;y++){
                    that.paintRow(blockID * 10 + y,blockID,rows[y],items[blockID * 10 + y]);
                }
                block.appendChild(fragment);
            }

            return that;
        },
        /*
         * insert column
        */
        insertColumn:function(column,index){
            var that        = this;
            var text        = "";
            var name        = "";
            var width       = null;
            var columnIndex = that._columnIndex++;
            var element     = newDiv("_column _column" + columnIndex);
            var columns     = that._columns;

            if(isString(column)){
                text = column;
            }else if(isObject(column)){
                text  = column.text  || "column"+columnIndex;
                name  = column.name  || null;
                width = column.width || null;
            }
            var columnData = {
                name:name,
                text:text,
                index:columnIndex,
                width:width,
                element:element.append([
                    newDiv("_client").html(column),
                    newDiv("_resizeHandle")
                ])
            };

            if(index != null && index < that._columnCount){
                element.insertBefore(columns[index].element)
                columns.insert(columnData,index);
            }else{
                that.D.columns.append(element);
                columns.push(columnData);
            }
            that._columnCount++;

            return that;
        },
        /*
         * cell
        */
        cell:function(row,cell,data){
            var that  = this;
            var item  = that._rows[row];
            var cells = item.cells;

            if(data === undefined){
                return Std.dom(cells[cell]);
            }
            if(Std.mold[1](data)){
                cells[cell].innerHTML = data+"";
            }

            return that;
        },
        /*
         * select row
        */
        selectRow:function(row){
            var that        = this;
            var selectedRow = that._selectedRow;

            if(isObject(row)){
                if(selectedRow.indexOf(row) === -1){
                    selectedRow.push(row.addClass("selected"));
                }
            }else if(isNumber(row)){

            }

            return that;
        },
        /*
         * select cell
        */
        selectCell:function(cell){
            var that         = this;
            var selectedCell = that._selectedCell;

            if(isObject(cell)){
                if(selectedCell.indexOf(cell) === -1){
                    selectedCell.push(cell.addClass("selected"));
                }
            }else if(isNumber(cell)){

            }

            return that;
        },
        /*
         * append column
        */
        appendColumn:Std.func(function(column){
            return this.insertColumn(column);
        },{
            each:[isArray]
        }),
        /*
         * insert row
        */
        insertRow:Std.func(function(row){

        },{
            each:[isArray]
        }),
        /*
         * append row
        */
        appendRow:function(row){
            var that  = this;
            var items = that.opts.items;

            if(isArray(row)){
                items.mergeArray(row);
                that._rowCount += row.length;
            }else if(isObject(row) && "cells" in row){
                items.push(row);
                that._rowCount++;
            }
            that.updateRowBlocks();
        },
        /*
         * remove column
        */
        removeColumn:Std.func(function(column){
            var that = this;


        },{
            each:[isArray]
        }),
        /*
         * remove row
        */
        removeRow:Std.func(function(row){

        },{
            each:[isArray]
        }),
        /*
         * clear selected
         */
        clearSelected:Std.func(function(type){
            var that = this;

            switch(type){
                case undefined:
                    that.clearSelected("column row cell");
                    break;
                case "column":

                    break;
                case "row":
                    Std.each(that._selectedRow,function(i,row){
                        row.removeClass("selected");
                    });
                    that._selectedRow.clear();
                    break;
                case "cell":
                    Std.each(that._selectedCell,function(i,cell){
                        cell.removeClass("selected");
                    });
                    that._selectedCell.clear();
                    break;
            }
            return that;
        },{
            each:[isArray]
        }),
        /*
         * clear
        */
        clear:function(){
            var that = this;

            that.clearSelected();

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.addClass(that.objectName);
        that.D               = {};
        that.CSSStyle        = new Std.css;

        that._rows           = [];
        that._columns        = [];
        that._rowBlocks      = [];
        that._columnWidth    = {};
        that._selectedColumn = [];
        that._selectedRow    = [];
        that._selectedCell   = [];

        that.initHeader();
        that.initBody();
        that.initEvents();

        that.call_opts({
            cellTemplate:null,
            rowNumbers:false
        },true);

        if(opts.items === null){
            opts.items = [];
        }
    }
});