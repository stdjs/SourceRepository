/**
    Std UI Kit Library
    http://ui.stdjs.com
	module: DataGrid
*/
Std.ui.module("DataGrid",{b:"widget",c:"clear selectionModeChange cellChange columnClick rowClick cellClick columnDblClick rowDblClick cellDblClick columnDropStart columnDropStop removeColumn removeRow updateRow dataSourceLoad",e:{level:4,minWidth:120,minHeight:60,headerHeight:29,headerVisible:!0,columnWidth:80,columnResizable:!0,columnSortable:!1,columnTextAlign:"left",columnDroppable:!0,columnEditable:!1,rowHeight:32,rowEditable:!1,rowNumbers:!1,rowCheckable:!1,rowCheckboxWidth:40,rowCollapsible:!1,cellPadding:3,cellEditable:!1,cellBorder:!0,cellTextAlign:"left",cellDroppable:!1,contextMenu:null,stripeRows:!1,hoverMode:"row",selectionMode:"row",value:null,items:null,columns:null,dataSource:null,valueFormat:"auto",defaultClass:"StdUI_DataGrid"},h:{rowCount:0,columnCount:0,rowNumbersWidth:0,selectedColumn:null,selectedRow:null,selectedRowIndex:null,selectedCell:null,columnPositions:null,lastRowBlock:null,sortHandle:null,cellWidgets:null,startAt:0,checkboxInit:!1,disabledLocker:null},g:{enable:function(e){var t=this;e||t._disabledLocker?e&&(t._disabledLocker.remove(),t._disabledLocker=null):t._disabledLocker=newDiv("_disabledLocker").opacity(.1).appendTo(t[0]),t[0].unselect(!e)},render:function(){var e=this;e.updateRowBlocks(),e.repaint(),e.updateStyle(),e.initEvents(),e.call_opts({contextMenu:null},!0)},height:function(e){var t=this,n=t.opts,o=t.boxSize;isNumber(e)||(e=t.height()),t[1].height(n.headerHeight),t[2].height(e-o.height-n.headerHeight-1),t.rendered&&t.refresh()},destroy:function(){var e=this;e._CSSStyle.remove(),e.clear()}},i:{initHeader:function(){var e=this,t=e.opts;return e[0].append(e[1]=newDiv("_header").append(e.DOMMap.columns=newDiv("_columns"))),null!==t.columns&&e.appendColumn(t.columns),e},initBody:function(){var e=this;return e[0].append(e[2]=newDiv("_body")),e},initColumnPositions:function(){var e=this,t=e.opts;e._columnPositions=[];for(var n=0,o=e._columns.length,r=0;o>n;n++){var l=e._columns[n];e._columnPositions.push({begin:r,end:r=isNumber(l.width)?r+l.width:r+t.columnWidth})}return e._columnPositions},initScrollEvent:function(){var e=this,t=null;return e[2].on("scroll",function(){e[1].css("left",-this.scrollLeft())}),e[2].on("scroll",function(){null!==t&&clearTimeout(t),t=setTimeout(function(){e.repaint(),t=null},5+Math.ceil(e._rowCount/5e3))}),e},initColumnResizeEvent:function(e){var t=this,n=e.offset(),o=newDiv("_resizer").appendTo(t[0]).css({left:e.position().x-t[2].scrollLeft(),width:e.offsetWidth(),height:t.height()}),r=function(e){o.width(e.pageX-n.x+2)};return Std.dom(document).on("mousemove",r).once("mouseup",function(){var n=o.outerWidth(),l=e.index()-t._startAt;this.off("mousemove",r),t._columns[l].resizable!==!1&&(t._columns[l].width=n,t.updateStyle().refresh()),o.remove()}),t},initColumnDropHandle:function(e){var t=this,n=t.opts;return newDiv().css({position:"absolute",cursor:"move",zIndex:Std.ui.status.zIndex+1,border:"1px solid "+e.css("border-right-color"),paddingLeft:n.cellPadding+3,outerWidth:e.outerWidth()+1,outerHeight:e.outerHeight()+2,lineHeight:e.height(),background:t[1].css("background-color"),color:e.css("color"),fontSize:e.css("font-size"),textAlign:n.columnTextAlign}).html(e.html()).appendTo("body")},initColumnDropEvent:function(e){var t=this,n=t.opts,o=0,r=0,l=0,i=e.index()-t._startAt,s=e.offset(),c=!1,u=null,a=0,d=t._columnPositions=t.initColumnPositions(),h=null,m=function(n){c=!0,u=t.initColumnDropHandle(e),o=s.x-n.pageX-1,r=s.y-n.pageY-1,a=t[1].offset(),l=e.outerWidth(),a.x+=Std.dom(t._columns[0].element).position().x,t.emit("columnDropStart",[n.pageX,n.pageY],!0)},f=function(e){return!(e.pageX+o+l<a.x||e.pageX+o>a.x+t.width()||e.pageY+r+n.headerHeight<s.y||e.pageY+r>a.y+n.headerHeight)},p=function(e){for(var t=0,n=e.pageX+o+l/2,r=d.length;r>t;t++){var i=d[t].begin,s=d[t].end,c=a.x;if(c>n&&e.pageX+o+l>c)return 0;if(n>=c+i&&c+i+(s-i)/2>=n)return t;if(n>=c+i&&c+s>=n&&n>=c+i+(s-i)/2)return++t;if(t===r-1&&e.pageX+o<=c+s)return++t}return-1},w=function(e){if(0==c&&m(e),f(e)){var n=p(e);-1!==n&&n!=h&&t.showColumnDropPosition(h=n)}else t.hideColumnDropPosition();u.css({left:e.pageX+o,top:e.pageY+r}),e.preventDefault()},v=function(){u.animate("end").animate({to:{left:s.x,top:s.y,opacity:.5}},300,function(){u.remove(),u=null})};Std.dom(document).on("mousemove",w).once("mouseup",function(e){if(null!==u)if(f(e)){var n=p(e);-1!==n&&n!==i&&t.moveColumn(i,n),u.remove(),u=null}else v();this.off("mousemove",w),t.emit("columnDropStop",[e.pageX,e.pageY],!0).updateStyle(),t.hideColumnDropPosition()})},initCheckbox:function(){var e=this;return e.DOMMap.columns.on("mouseenter","._defColumn._rowCheckbox>._checkbox",function(t){e.enable()&&this.mouse({auto:!1,click:function(){for(var t=!this.hasClass("checked"),n=0,o=e._rows.length;o>n;n++)e._rows[n].checked=t;this.toggleClass("checked",t),e.refresh()}},t)}),e[2].on("mouseenter","._block>._row>._defCell._rowCheckbox>._checkbox",function(t){var n=this,o=n.parent(),r=o.parent(),l=e.computeRowIndexByCell(o),i=e._rows[l];e.enable()&&n.mouse({auto:!1,click:function(){n.toggleClass("checked",i.checked=!i.checked),"checkedRows"===e.selectionMode()&&(i.checked?e.selectRow(l,o.parent()):(r.removeClass("selected"),delete e._selectedRow[l]))}},t)}),e._checkboxInit=!0,e},initHeaderEvents:function(){var e=this,t=e.opts,n=function(n){var o=this.index()-e._startAt;e.enable()&&this.mouse({auto:!1,dblclick:function(){t.columnEditable&&e.editColumn(this),e.emit("columnDblClick",o)},down:function(n){var r=t.selectionMode;t.columnDroppable&&1==n.which&&(e.initColumnDropEvent(this),n.preventDefault()),"column"===r&&(e.clearSelected(r),e.selectColumn(o))},click:function(){if(!(0>o)){var n=e._columns[o].sortType;switch(n){case"asc":n="desc";break;case"desc":n="asc";break;default:n="asc"}t.columnSortable&&e.sortColumn(o,n),e.emit("columnClick",o)}}},n)};return e.DOMMap.columns.on("mouseenter","._column",n).delegate("mouseenter","._column > ._resizeHandle",function(n){e.enable()&&t.columnResizable&&e.enable()&&this.mouse({auto:!1,unselect:!0,down:function(){return e.initColumnResizeEvent(this.parent()),!1}},n)}),e},initCellEvents:function(){var e=this,t=e.opts,n=function(t){this.hasClass("selected")?t in e._selectedCell&&(this.removeClass("selected"),delete e._selectedCell[t]):e.selectCell(t,this)};return e[2].delegate("mouseenter","._block > ._row > ._cell",function(o){var r=null,l=this,i=-1,s=-1,c=-1,u=t.selectionMode,a=null;e.enable()&&l.mouse({auto:!1,classStatus:"cell"===t.hoverMode,click:function(){e.emit("cellClick",a)},dblclick:function(n){var o=e.column(i).type;if(i>=0&&t.cellEditable&&"widget"!==e.column(i).type){var r=e.queryRowByIndex(10*c+s);e.editCell(this,o,e.queryCellByIndex(r,i),function(t){e.updateCellByIndex(r,i,t),e.emit("cellChange",[a,t],!0),e.refresh()})}e.emit("cellDblClick",a),n.preventDefault()},down:function(t){r=l.parent(),i=l.index()-e._startAt,s=r.index(),c=r.parent().index(),a=sprintf("%d:%d",10*c+s,i),"cells"===u&&t.ctrlKey?("cells"===u&&1===t.which&&(t.preventDefault(),e.cellsSelectStart(this,c,s,i)),n.call(this,a)):("cells"===u||"cell"===u)&&(e.clearSelected("cell"),e.selectCell(a,this))}},o)}),e},initRowEvents:function(){var e=this,t=e.opts,n=function(t){if(this.hasClass("selected")){var n=e.rowIndex(t);e._selectedRow[n]&&(this.removeClass("selected"),delete e._selectedRow[n])}else e.selectRow(t,this)};return e[2].delegate("mouseenter","._block > ._row",function(o){var r,l,i,s=t.selectionMode,c=this;e.enable()&&c.mouse({auto:!1,classStatus:"row"===t.hoverMode,click:function(){e.emit("rowClick",i)},dblclick:function(){e.emit("rowDblClick",i)},down:function(t){r=c.index(),l=c.parent().index(),i=sprintf("%d:%d",l,r),"rows"===s&&t.ctrlKey?(1===t.which&&(t.preventDefault(),e.rowsSelectStart(c,l,r)),n.call(c,i)):("rows"===s||"row"===s)&&(e.clearSelected("row"),e.selectRow(i,c))}},o)}),e},initBodyEvents:function(){var e=this;return e.initScrollEvent(),e.initRowEvents(),e.initCellEvents(),e},initCellWidgets:function(){var e=this;return Std.each(e._cellWidgets,function(e,t){t.rendered||t.render()}),e},initEvents:function(){var e=this;return e[0].focussing(function(){e.addClass("focused")},function(){e.removeClass("focused")}).mouse(),e.initHeaderEvents(),e.initBodyEvents(),e},showColumnDropPosition:function(e){var t=this,n=t.opts,o=t[1].offset(),r=o.x-6+e+(e===t._columns.length?t._columnPositions[e-1].end:t._columnPositions[e].begin),l=Std.ui.status.zIndex+1;return r+=t._columns[0].element.position().x,t.hideColumnDropPosition(),t.DOMMap.columnPos1=newDiv("StdUI_DataGrid_ColumnPosition _top").appendTo("body").css({top:o.y-12,left:r,zIndex:l}),t.DOMMap.columnPos2=newDiv("StdUI_DataGrid_ColumnPosition _bottom").appendTo("body").css({top:o.y+n.headerHeight,left:r,zIndex:l}),t},hideColumnDropPosition:function(){var e=this;return e.DOMMap.columnPos1&&e.DOMMap.columnPos1.remove(),e.DOMMap.columnPos2&&e.DOMMap.columnPos2.remove(),e},createRowHtml:function(e,t){var n=this.opts,o="",r="",l="_row",i=l+(n.stripeRows?" _odd":"");n.rowNumbers&&(r+="<div class='_defCell _rowNumber'></div>"),n.rowCheckable&&(r+="<div class='_defCell _rowCheckbox'></div>");for(var s=0;t>s;s++)r+="<div class='_cell _cell"+s+"'></div>";for(var c=0;e>c;c++)o+="<div class='"+(c%2==0?l:i)+"'>"+r+"</div>";return o},paintCell:function(e,t,n,o,r){var l=this,i=l.opts;switch(e.type){case"template":t.innerHTML=e.template.render(isObject(n)?n:{value:n});break;case null:case"text":isString(n)||isNumber(n)?t.innerHTML=n+"":isObject(n)&&(isWidget(n)||n.ui?Std.dom(t).widget(n):Std.dom(t).set(n));break;case"widget":if(Std.ui.exist(e.ui)){var s=Std.ui(e.ui,Std.extend({width:(e.width||i.columnWidth)-2*i.cellPadding,height:i.rowHeight-2*i.cellPadding,value:n},e.option));s.on("change",function(){s.rendered&&l.updateCellByIndex(o,r,s.value())}),l._cellWidgets.push(t.ui=s.appendTo(t))}}return t},paintRow:function(e,t,n,o){var r=this,l=r.opts,i=[],s=r._columns,c=o.cells;if(!isArray(c)&&isObject(c)){var u=new Array(r._columnCount),a=[];for(var d in c){var h=r.queryColumnIndexByName(d);-1!==h&&(u[h]=c[d],a[h]=s[h])}s=a,c=u}var m=n.childNodes;l.rowNumbers&&(m[0].innerHTML=e+1),l.rowCheckable&&(m[l.rowNumbers?1:0].appendChild(newDiv("_checkbox"+(o.checked?" checked":"")).dom),o.checked&&"checkedRows"===r.selectionMode()&&r.selectRow(e,Std.dom(n)));for(var f=0,p=m.length;p>f;f++)o&&void 0!=c[f]&&(i[f]=r.paintCell(s[f],m[r._startAt+f],c[f],o,f));return{row:n,cells:i,blockID:t}},editCell:function(e,t,n,o){var r=this,l=e.text();return"template"===t&&(isString(n)||isNumber(n)?l=n:isObject(n)&&"value"in n&&(l=n.value)),Std.ui("Item").edit(e,{text:l,changeText:!1,fixedWidth:!0,fixedHeight:!0,apply:o}),r},editColumn:function(e){var t=this,n=e.position(),o=newDom("input","_input").value(e.text()).on({blur:function(){var n=this.value(),r=t._columns[e.index()];Std.dom("._client",e).html(r.text=n),o.remove()},keypress:function(e){13===e.keyCode&&this.blur()}}).appendTo(this[1]).css({top:n.y+t[1].scrollTop(),left:n.x+t[1].scrollLeft(),outerWidth:e.outerWidth(),outerHeight:e.outerHeight()});return setTimeout(o.focus.bind(o.lineHeight(o.height())),10),t},editRow:function(){var e=this;return e},rowsSelectStart:function(e,t,n){var o=this,r="._block > ._row",l={},i=function(){if(o.enable()){Std.each(l,function(e,t){e in o._selectedRow&&delete o._selectedRow[e],t.removeClass("selected"),delete l[e]});var e=this,r=e.index(),i=e.parent().index(),s=n,c=t;(c>i||i==c&&s>r)&&(r^=s,s^=r,r^=s,c^=i,i^=c,c^=i);for(var u=c;i>=u;u++){var a=Std.dom(o._rowBlocks[u]).children(),d=a.length,h=0,m=d-1;u===c?(h=s,c===i&&(m=r)):u===i&&(h=0,m=r);for(var f=h;m>=f;f++)l[10*u+f]=a[f]}Std.each(l,function(e,t){t.addClass("selected")})}};return Std.dom(document).once("mouseup",function(){Std.each(l,function(e,t){o.selectRow(~~e,t)}),o[2].off("mouseenter",r,i)}),o[2].delegate("mouseenter",r,i),o},cellsSelectStart:function(e,t,n,o){var r=this,l="._block > ._row > ._cell",i={},s=function(){if(r.enable()){Std.each(i,function(e,t){e in r._selectedCell&&delete r._selectedCell[e],t.removeClass("selected"),delete i[e]});var e=this,l=e.parent(),s=e.index(),c=l.index(),u=l.parent().index(),a=o,d=n,h=t;a>s&&(s^=a,a^=s,s^=a),(h>u||u==h&&d>c)&&(c^=d,d^=c,c^=d,h^=u,u^=h,h^=u);for(var m=h;u>=m;m++){var f=Std.dom(r._rowBlocks[m]).children(),p=f.length,w=0,v=p-1;m===h?(w=d,h===u&&(v=c)):m===u&&(w=0,v=c);for(var _=w;v>=_;_++)for(var C=f[_].children(),b=a;s>=b;b++)i[10*m+_+":"+b]=C[b]}Std.each(i,function(e,t){t.addClass("selected")})}};return Std.dom(document).once("mouseup",function(){Std.each(i,function(e,t){r.selectCell(e,t)}),r[2].off("mouseenter",l,s)}),r[2].delegate("mouseenter",l,s),r},updateRowBlocks:function(){for(var e=this,t=e._rowCount,n=e._rowBlocks,o=document.createDocumentFragment(),r=0,l=Math.ceil(t/10)-n.length;l>r;r++){var i=document.createElement("div");i.className="_block _block"+r,o.appendChild(i),n.push(i)}e[2].dom.appendChild(o),null!==e._lastRowBlock&&Std.dom(e._lastRowBlock).removeStyle("height");var s=Std.dom(n[n.length-1]);return null!==s&&(e._lastRowBlock=s.height((e._rowCount-10*(n.length-1))*e.opts.rowHeight).dom),e},updateStyle:function(){var e=this,t=e.opts,n={},o=0,r=e.width()-e.boxSize.width,l=t.rowHeight-1,i=10*(l+1)+"px",s=l-2*t.cellPadding,c=t.columnWidth,u=t.headerHeight,a=e._rowNumbersWidth,d={"._defColumn":{height:u-1+"px"},"._column":{textAlign:t.columnTextAlign,height:u-1+"px",lineHeight:u-1+"px",">":{"._sortType":{marginTop:(u-7)/2+"px"}}}},h={"._cell":{padding:t.cellPadding+"px",height:s+"px",lineHeight:s+"px",textAlign:t.cellTextAlign}};t.rowNumbers&&(h["._defCell._rowNumber"]={height:t.rowHeight+"px",width:a+1+"px"},d["._defColumn._rowNumbers"]={height:u+"px",width:a+"px"},o+=a+2),t.rowCheckable&&(h["._defCell._rowCheckbox"]={height:t.rowHeight+"px",width:t.rowCheckboxWidth+1+"px"},d["._defColumn._rowCheckbox"]={width:t.rowCheckboxWidth+"px"},o+=t.rowCheckboxWidth+2);for(var m=0,f=e._columnCount;f>m;m++){var p=e._columns[m],w=(p.width||c)-1+"px";d["._column"+m]={width:w},h["._cell"+m]={width:(p.width||c)-2*t.cellPadding+"px"},o+=(p.width||c)+1}r>=o?o="100%":o+="px";var v={height:l+"px",lineHeight:l+"px",">":h};return n[".StdUI_DataGrid.StdUI_"+e.objectName]={">":{"._header":{">":{"._columns":{">":d}}},"._body":{">":{"._block":{width:o,height:i},"._block > ._row":v}}}},t.cellBorder===!1&&(h["._cell"].borderColor=v.borderColor="transparent"),e._CSSStyle.clear().append(n),e}},j:{each:function(e,t){var n=this;return Std.each(n._rows,function(t,o){return isFunction(e)?e.call(n,t,o):void 0},t)},dataSource:function(e){return this.opt("dataSource",e,function(){this.reload()})},columnResizable:function(e){return this.opt("columnResizable",e)},selectionMode:function(e){return this.opt("selectionMode",e,function(){this.emit("selectionModeChange",e)})},valueFormat:function(e){return this.opt("valueFormat",e)},columnDroppable:function(e){return this.opt("columnDroppable",e)},columnSortable:function(e){return this.opt("columnSortable",e)},columnTextAlign:function(e){return this.opt("columnTextAlign",e,function(){this.updateStyle()})},cell:function(e,t){return this.queryCellByIndex(e,t)},row:function(e){return this.queryRowByIndex(e)},queryRowByIndex:function(e){return this._rows[this.rowIndex(e)]||null},queryRowByID:function(e){for(var t=this,n=t._rows,o=0,r=n.length;r>o;o++)if(n[o].ID===e)return n[o];return null},queryCellByColumnName:function(e,t){var n;if(isObject(e)?n=e.cells:(isNumber(e)||isString(e))&&null!==(e=this.queryRowByIndex(e))&&(n=e.cells),isArray(n)){var o=this.queryColumnIndexByName(t);if(-1!==o&&void 0!==n[o])return n[o]}else if(isObject(n)&&void 0!==n[t])return n[t];return null},queryCellByIndex:function(e,t){var n;if(isObject(e)?n=e.cells:(isNumber(e)||isString(e))&&null!==(e=this.queryRowByIndex(e))&&(n=e.cells),isArray(n)&&void 0!==n[t])return n[t];if(isObject(n)){var o=this.queryColumnByIndex(t);if(o&&o.name&&void 0!==n[o.name])return n[o.name]}return null},column:function(e){var t=this;return isNumber(e)?t.queryColumnByIndex(e):isString(e)?t.queryColumnByName(e):null},queryColumnByIndex:function(e){return this._columns[e]||null},queryColumnIndexByName:function(e){for(var t=0;t<this._columnCount;t++)if(e===this._columns[t].name)return t;return-1},queryColumnByName:function(e){var t=this.queryColumnIndexByName(e);return-1!==t?this._columns[t]:null},rowIndex:function(e){if(isString(e)){var t=(e=e.split(":")).length;1==t?e=~~e[0]:2==t&&(e=10*~~e[0]+~~e[1])}return e},computeRowIndexByCell:function(e){var t=e.parent();return 10*t.parent().index()+t.index()},headerVisible:function(e){var t=this;return t.opt("headerVisible",e,function(){t[1].visible(e)})},contextMenu:function(e){var t=this;return t.plugin("contextMenu",Std.extend({handle:t[2]},e)),t},stripeRows:function(e){return this.opt("stripeRows",e,function(){this.refresh()})},rowCheckable:function(e){var t=this,n=t._defColumns;return t.opt("rowCheckable",e,function(){if(1!=e||n.rowCheckable)0==e&&"rowCheckable"in n&&(n.rowCheckable&&n.rowCheckable.remove(),delete n.rowCheckable,t._startAt--);else{var o=n.rowCheckable=newDiv("_defColumn _rowCheckbox").append(newDiv("_checkbox"));t._checkboxInit||t.initCheckbox(),t.rowNumbers()?t.DOMMap.columns.insertAfter(o,n.rowNumbers):t.DOMMap.columns.prepend(o),t._startAt++}t.rendered&&t.refresh().updateStyle()})},rowNumbers:function(e){var t=this,n=t._defColumns;return t.opt("rowNumbers",e,function(){1!=e||n.rowNumbers?0==e&&"rowNumbers"in n&&(n.rowNumbers&&n.rowNumbers.remove(),t._startAt--,delete n.rowNumbers):(t.DOMMap.columns.prepend(n.rowNumbers=newDiv("_defColumn _rowNumbers")),t._startAt++),t.rendered&&t.refresh().updateStyle()})},selectRow:function(e,t){var n=this,o=-1,r=n._selectedRow;return void 0===e?r:(o=isString(t)&&void 0===e?n.rowIndex(t):isString(e)?n.rowIndex(e):isNumber(t)?t:e,isObject(t)||(t=n._rowBlocks[Math.floor(o/10)].children(o%10)),!t||o in r||(r[o]=t.addClass("selected")),n)},selectedRow:function(){var e=this,t=e._selectedRow,n=e.selectionMode();if("row"==n)for(var o in t)return o;else if("rows"==n){var r=[];for(var o in t)r.push(o);return r}return null},selectCell:function(e,t){var n=this,o=n._selectedCell,r=-1;if(void 0===e){if("cell"==n.selectionMode())for(var l in o)return o[l];return o}if(isString(e)&&(r=e.split(":")),!isObject(t)){var i=n._rowBlocks[Math.floor(r[0]/10)].children(r[0]%10);t=i.children(r[1])}return!t||e in o||(o[e]=t.addClass("selected")),n},selectedCell:function(){var e=this,t=e._selectedCell,n=e.selectionMode();if("cell"==n)for(var o in t)return t[o];else if("cells"==n){var r=[];for(var o in t)r.push(o);return r}return null},selectColumn:function(e){var t=this,n=t._columns,o=t._selectedColumn;return e in o||(o[e]=n[e],o[e].element.addClass("selected")),t},updateCellByColumnName:function(e,t,n){var o;if(isObject(e)?o=e.cells:(isNumber(e)||isString(e))&&null!==(e=this.queryRowByIndex(e))&&(o=e.cells),isArray(o)){var r=this.queryColumnIndexByName(t);-1!==r&&void 0!==o[r]&&(o[r]=n)}else isObject(o)&&void 0!==o[t]&&(o[t]=n);return this},updateCellByIndex:function(e,t,n){var o;if(isObject(e)?o=e.cells:(isNumber(e)||isString(e))&&null!==(e=this.queryRowByIndex(e))&&(o=e.cells),isArray(o)&&void 0!==o[t])o[t]=n;else if(isObject(o)){var r=this.queryColumnByIndex(t);r&&r.name&&void 0!==o[r.name]&&(o[r.name]=n)}return this},updateRowByIndex:function(e,t){var n=this,o=n._rows;if(isNumber(e)||isString(e))-1!==(e=n.rowIndex(e))&&(o[e]=t);else if(isObject(e))for(var r in e)-1!==(r=n.rowIndex(r))&&(o[r]=e[r]);return n},updateRowByID:function(e,t){var n=this,o=n._rows,r=function(e,t){for(var r=0,l=n._rowCount;l>r;r++)if(o[r].ID===e){o[r]=t;break}};if(isNumber(e)||isString(e))r(e,t);else if(isObject(e))for(var l in e)r(l,e[l]);return n},value:function(e){var t=this,n=t.valueFormat();if(void 0!==e)return t;for(var o=null,r=0;r<t._rowCount;r++){var l=t._rows[r];o||("auto"==n?o||(o="ID"in l?{}:[]):"array"==n?o=[]:"object"==n&&(o={})),isArray(o)?o.push(l.cells):isObject(o)&&"ID"in l&&(o[l.ID]=l.cells)}return o},mergeCells:function(){var e=this;return e},moveColumn:function(e,t){var n=this,o=n._columns;t===o.length?o[e].element.insertAfter(o[t-1].element):o[e].element.insertBefore(o[t].element),o.move(e,t>e?--t:t);for(var r=0;r<n._rowCount;r++){var l=n._rows[r].cells;isArray(l)&&l.move(e,t)}return n.resetColumnClass().refresh()},swapColumn:function(e,t){var n=this,o=n._columns;o[e].element.swap(o[t].element),o.swap(e,t);for(var r=0;r<n._rowCount;r++){var l=n._rows[r].cells;isArray(l)&&l.swap(e,t)}return n.resetColumnClass().refresh()},insertColumn:function(e,t){var n=this,o="",r=newDiv("_column _column"+n._columnCount),l=n._columns;isString(e)?o=e:isObject(e)&&(o=e.text||"column"+n._columnCount);var i={text:o,element:r.append([newDiv("_client").html(o),newDiv("_resizeHandle")])};return Std.each("ui name type width option template resizable",function(t,n){i[n]=void 0===e[n]?null:e[n]}),null!=t&&t<n._columnCount?(l.insert(i,t),n.DOMMap.columns.insert(r,t)):(n.DOMMap.columns.append(r),l.push(i)),n._columnCount++,n.rendered&&n.updateStyle(),n},sortColumn:function(e,t){var n=this,o=n._columns[e],r=function(e,t){return isArray(e)?t:o.name};return null!==n._sortHandle&&n._sortHandle.remove(),"desc"===t?n._rows.sort(function(t,n){return t.cells[r(t.cells,e)]<n.cells[r(n.cells,e)]}):"asc"===t&&n._rows.sort(function(t,n){return t.cells[r(t.cells,e)]>n.cells[r(n.cells,e)]}),o.sortType=t,o.element.append(n._sortHandle=newDiv("_sortType"+(t?" _"+t:""))),n.refresh()},appendColumn:Std.func(function(e){return this.insertColumn(e)},{each:[isArray]}),insertRow:Std.func(function(){},{each:[isArray]}),appendRow:function(e){var t=this;return isArray(e)?(t._rows.mergeArray(e),t._rowCount+=e.length):isObject(e)&&"cells"in e&&(t._rows.push(e),t._rowCount++),t.rendered&&t.refresh(),t},resetColumnClass:function(e){for(var t=this,n=t._columns,o=e||0,r=n.length;r>o;o++)n[o].element.className("_column _column"+o);return t},refresh:function(){var e=this;return e.clearCellWidgets(),e.clearRowBlocks(),e.updateRowBlocks(),e.repaint()},reload:function(e){var t=this,n=t.opts,o=n.dataSource,r=o.read;return o&&"ajax"===o.type&&isObject(r)&&Std.ajax.json({url:r.url,data:Std.extend(r.data||{},e),type:r.type||"get",success:function(e){t.clear(),t.appendRow(Std.mold.dataPath(e,r.dataPath)),t.emit("dataSourceLoad",e)}}),t},repaint:function(){for(var e=this,t=e.opts,n=e[2].dom.scrollTop,o=10*t.rowHeight,r=Math.floor(n/o),l=Math.ceil((e.height()-e.boxSize.height-t.headerHeight-1)/o+n/o%1),i=0,s=0;l>s;s++){var c=r+s,u=e._rowBlocks[c];if(u&&0===u.childNodes.length){for(var a=u===e._lastRowBlock?e._rowCount-10*c:10,d=e.createRowHtml(a,e._columnCount),h=Std.dom.fragment(d),m=0,f=h.childNodes,p=f.length;p>m;m++)e.paintRow(10*c+m,c,f[m],e._rows[i=10*c+m]);u.appendChild(h)}}if(t.rowNumbers){var w=newDom("span","_tester").html(e._rowCount).appendTo(e);(e._rowNumbersWidth=w.width()+10)<30&&(e._rowNumbersWidth=30),w.remove()}return e.initCellWidgets()},clearSelected:Std.func(function(e){var t=this;switch(e){case void 0:t.clearSelected("column row cell");break;case"column":Std.each(t._selectedColumn,function(e,n){n.element.removeClass("selected"),delete t._selectedColumn[e]});break;case"row":Std.each(t._selectedRow,function(e,n){n.removeClass("selected"),delete t._selectedRow[e]});break;case"cell":Std.each(t._selectedCell,function(e,n){n.removeClass("selected"),delete t._selectedCell[e]})}},{each:[isArray,isString]}),removeColumn:function(e){var t=this,n=t._columns;if(isString(e)&&(e=t.queryColumnIndexByName(e)),isNumber(e)&&t._columnCount>e&&e>=0){for(var o=n[e],r=n.indexOf(o),l=0;l<t._rowCount;l++){var i=t._rows[l].cells;isArray(i)?i.remove(r):isObject(i)&&delete i[o.name]}o.element.remove(),n.remove(r),t.resetColumnClass(e)}return t._columnCount=t._columns.length,t.refresh().emit("removeColumn",e)},removeRow:function(e){var t=this;if(isNumber(e)||isArray(e))t._rows.remove(e);else if("select"===e){var n=[];Std.each(t._selectedRow,function(e){n.push(~~e)}),t._rows.remove(n)}return t._rowCount=t._rows.length,t.refresh().emit("removeRow",e)},clear:function(){var e=this;return e._rowCount=0,e._rows.clear(),e.clearRowBlocks(),e.clearCellWidgets(),e.emit("clear")},clearCellWidgets:function(){var e=this;return Std.each(e._cellWidgets,function(e,t){t.remove()}),e._cellWidgets.clear(),e},clearRowBlocks:function(){var e=this;return e._lastRowBlock=null,e._rowBlocks.clear(),e.clearSelected(),e[2].clear(),e}},k:function(e,t){e.addClass("StdUI_"+e.objectName),e.DOMMap={},e._CSSStyle=new Std.css,e._rows=[],e._columns=[],e._rowBlocks=[],e._selectedColumn={},e._selectedRow={},e._selectedCell={},e._cellWidgets=[],e._defColumns={},e.initHeader(),e.initBody(),e.call_opts({rowNumbers:!1,rowCheckable:!1,dataSource:null},!0),isArray(t.items)&&(e._rows.mergeArray(t.items),e._rowCount+=t.items.length)},m:{rule:{children:"appendRow"},html:{nodeName:["DIV"],create:function(e){var t=[],n=[],o=function(e){Std.each(e.children(),function(e,n){t.push(Std.extend({text:n.html().trim()},Std.options.get(n),3))})},r=function(e){n.push(Std.extend({cells:Std.each(e.children(),function(e,t){return t.html().trim()},!0)},Std.options.get(e)))},l=function(e){Std.each(e,function(e,t){"UL"===t.nodeName()&&o(t)})},i=function(e){Std.each(e,function(e,t){"UL"===t.nodeName()&&r(t)})};e.children(function(e,t){var n=t.attr("std-type"),o=t.children();"header"===n?l(o):"body"===n&&i(o)}),this.appendColumn(t),this.appendRow(n)}}}});