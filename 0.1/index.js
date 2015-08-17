Std.source.response("StdJS",function(){
    function CSSFile_UI(name){
        return "ui/theme/default/" + name + ".css";
    }
    function JSFile_UI(name){
        return "ui/" + name + ".js";
    }
    function JSCSSFile_UI(name){
        return [CSSFile_UI(name),JSFile_UI(name)];
    }
    function cryptoJS(name){
        return "crypto/"+name+".js";
    }
    return {
        "ui.Canvas":JSFile_UI("ui.Canvas"),
        "ui.Image":JSFile_UI("ui.Image"),
        "ui.Label":JSFile_UI("ui.Label"),
        "ui.Splitter":JSFile_UI("ui.Splitter"),
        "ui.Item":JSCSSFile_UI("ui.Item"),
        "ui.FieldSet":JSCSSFile_UI("ui.FieldSet"),
        "ui.ToolTip":JSCSSFile_UI("ui.ToolTip"),
        "ui.CheckBox":JSCSSFile_UI("ui.CheckBox"),
        "ui.RadioBox":JSCSSFile_UI("ui.RadioBox"),
	    "ui.SpinBox":{
            basics:"ui.LineEdit",
            files:JSCSSFile_UI("ui.SpinBox")
        },
        "ui.SwitchBox":JSCSSFile_UI("ui.SwitchBox"),
        "ui.LineEdit":JSCSSFile_UI("ui.Edit"),
	    "ui.TextEdit":JSCSSFile_UI("ui.Edit"),
        "ui.DateTimeEdit":{
            basics:["ui.LineEdit","ui.DatePicker"],
            files:JSCSSFile_UI("ui.DateTimeEdit")
        },
        "ui.DateTimeView":{
            files:JSFile_UI("ui.DateTimeView")
        },
        "ui.Button":JSCSSFile_UI("ui.Button"),
        "ui.ColorPicker":JSCSSFile_UI("ui.ColorPicker"),
        "ui.DatePicker":JSCSSFile_UI("ui.DatePicker"),
        "ui.List":{
            basics:"ui.Item",
            files:JSCSSFile_UI("ui.List")
        },
        "ui.Menu":{
            basics:"ui.Item",
            files:JSCSSFile_UI("ui.Menu")
        },
        "ui.MenuBar":{
            basics:"ui.Menu",
            files:JSCSSFile_UI("ui.MenuBar")
        },
        "ui.PathBar":JSCSSFile_UI("ui.PathBar"),
        "ui.ComboBox":{
            basics:"ui.Item",
            files:JSCSSFile_UI("ui.ComboBox")
        },
        "ui.ToolBar":{
            basics:"ui.Button",
            files:JSCSSFile_UI("ui.ToolBar")
        },
        "ui.Panel":{
            basics:"ui.ToolBar",
            files:JSCSSFile_UI("ui.Panel")
        },
        "ui.Window":{
            basics:["ui.Panel","ui.Menu"],
            files:JSCSSFile_UI("ui.Window")
        },
        "ui.MessageBox":JSCSSFile_UI("ui.MessageBox"),
        "ui.Pagination":{
            basics:"ui.ComboBox",
            files:JSCSSFile_UI("ui.Pagination")
        },
        "ui.Progress":JSCSSFile_UI("ui.Progress"),
        "ui.Accordion":{
            basics:"ui.Item",
            files:JSCSSFile_UI("ui.Accordion")
        },
        "ui.TabPanel":{
            basics:"ui.Button",
            files:JSCSSFile_UI("ui.TabPanel")
        },
        "ui.Slider":JSCSSFile_UI("ui.Slider"),
        "ui.Tree":JSCSSFile_UI("ui.Tree"),
        "ui.DataGrid":JSCSSFile_UI("ui.DataGrid"),
        "ui.TreeGrid":JSCSSFile_UI("ui.TreeGrid"),
        "ui.PropertyGird":JSCSSFile_UI("ui.PropertyGrid"),
        "ui.Video":JSCSSFile_UI("ui.Video"),
        "ui.TaskBar":{
            basics:"ui.Item",
            files:JSCSSFile_UI("ui.TaskBar")
        },
        "ui.Tray":JSCSSFile_UI("ui.Tray"),
        "ui.ImageCutter":{
            basics:[
                "ui.Slider","ui.Button"
            ],
            files:[
                JSFile_UI("ui.ImageCutter")
            ]
        },

        "ui.KindEditor":{
            files:[
               "ui/kindeditor/themes/default/default.css","ui/kindeditor/kindeditor-all-min.js","ui/kindeditor/kindeditor.js"
            ]
        },
        "ui.CodeMirror":{
            files:[
                "ui/CodeMirror/codemirror.css","ui/CodeMirror/codemirror.min.js","ui/CodeMirror/ui.CodeMirror.js"
            ]
        },
	
        "crypto.sha1":cryptoJS("sha1"),
        "crypto.sha256":cryptoJS("sha256"),
        "crypto.base64":cryptoJS("base64"),
        "crypto.md5":cryptoJS("md5"),
	    "crypto.md6":cryptoJS("md6"),
        "crypto.aes":{
            basics:[
                "crypto.base64"
            ],
            files:[
                cryptoJS("aes")
            ]
        },
	
	    "plugin.upload":"plugin/upload.js",
        "plugin.smoothWheel":"plugin/smoothWheel.js",

        "io.websocket":"io/websocket.js"
    };
});