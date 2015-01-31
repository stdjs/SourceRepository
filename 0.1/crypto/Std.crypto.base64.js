/**
 * base64 encode
*/
Std.crypto.base64 = Std.module(function(){
    var reference = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        /*[#module option:static]*/
        static:{
            /*
             * encode base64
            */
            encode:function(data){
                if(!isString(data)){
                    return null;
                }

                var i    = 0;
                var ac   = 0;
                var temp = [];
                var o1,o2,o3,h1,h2,h3,h4,bits;

                data = escape(data);

                do{
                    o1 = data.charCodeAt(i++);
                    o2 = data.charCodeAt(i++);
                    o3 = data.charCodeAt(i++);

                    bits = o1 << 16 | o2 << 8 | o3;

                    h1 = bits >> 18 & 0x3f;
                    h2 = bits >> 12 & 0x3f;
                    h3 = bits >> 6 & 0x3f;
                    h4 = bits & 0x3f;

                    temp[ac++] = reference.charAt(h1) + reference.charAt(h2) + reference.charAt(h3) + reference.charAt(h4);
                }while(i < data.length);

                var r   = data.length % 3;
                var enc = temp.join('');

                return (r ? enc.slice(0,r-3) : enc) + '==='.slice(r || 3);
            },
            /*
             * decode base64
             */
            decode:function(data){
                if(!isString(data)){
                    return null;
                }

                var i    = 0;
                var ac   = 0;
                var temp = [];
                var o1,o2,o3,h1,h2,h3,h4,bits;

                data += '';

                do{
                    h1 = reference.indexOf(data.charAt(i++));
                    h2 = reference.indexOf(data.charAt(i++));
                    h3 = reference.indexOf(data.charAt(i++));
                    h4 = reference.indexOf(data.charAt(i++));

                    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                    o1 = bits >> 16 & 0xff;
                    o2 = bits >> 8 & 0xff;
                    o3 = bits & 0xff;

                    if(h3 == 64){
                        temp[ac++] = String.fromCharCode(o1);
                    }else if (h4 == 64) {
                        temp[ac++] = String.fromCharCode(o1,o2);
                    }else{
                        temp[ac++] = String.fromCharCode(o1,o2,o3);
                    }
                }while(i < data.length);

                return unescape(temp.join('').replace(/\0+$/, ''));
            }
        },
        /*[#module option:main]*/
        main:function(data){
            return Std.codec.base64.encode(data);
        }
    }
});