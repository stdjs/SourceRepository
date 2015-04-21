/**
 * sha256 crypto
 */
Std.crypto.sha256 = Std.module(function(){
    var K256 = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    var sha256_hex_digits = "0123456789abcdef";

    function rotateRight(n,x) {
        return ((x >>> n) | (x << (32 - n)));
    }
    function choice(x,y,z) {
        return ((x & y) ^ (~x & z));
    }
    function majority(x,y,z) {
        return ((x & y) ^ (x & z) ^ (y & z));
    }
    function sha256_Sigma0(x) {
        return (rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x));
    }
    function sha256_Sigma1(x) {
        return (rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x));
    }
    function sha256_sigma0(x) {
        return (rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3));
    }
    function sha256_sigma1(x) {
        return (rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10));
    }
    function sha256_expand(W, j) {
        return (W[j&0x0f] += sha256_sigma1(W[(j+14)&0x0f]) + W[(j+9)&0x0f] + sha256_sigma0(W[(j+1)&0x0f]));
    }
    function safe_add(x,y){
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff);
    }
    function sha256_init(){
        var ihash  = new Array(8);
        var count  = new Array(2);
        var buffer = new Array(64);

        count[0] = count[1] = 0;
        ihash[0] = 0x6a09e667;
        ihash[1] = 0xbb67ae85;
        ihash[2] = 0x3c6ef372;
        ihash[3] = 0xa54ff53a;
        ihash[4] = 0x510e527f;
        ihash[5] = 0x9b05688c;
        ihash[6] = 0x1f83d9ab;
        ihash[7] = 0x5be0cd19;

        return {
            ihash:ihash,
            count:count,
            buffer:buffer
        };
    }
    function sha256_transform(option){
        var T1, T2;
        var W = new Array(16);
        var a = option.ihash[0];
        var b = option.ihash[1];
        var c = option.ihash[2];
        var d = option.ihash[3];
        var e = option.ihash[4];
        var f = option.ihash[5];
        var g = option.ihash[6];
        var h = option.ihash[7];

        for(var i=0;i<16; i++){
            W[i] = ((option.buffer[(i<<2)+3]) | (option.buffer[(i<<2)+2] << 8) | (option.buffer[(i<<2)+1] << 16) | (option.buffer[i<<2] << 24));
        }
        for(var j=0;j<64; j++){
            T1  = h + sha256_Sigma1(e) + choice(e, f, g) + K256[j];
            T1 += j < 16 ? W[j] : sha256_expand(W,j);
            T2  = sha256_Sigma0(a) + majority(a,b,c);
            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
        }
        option.ihash[0] += a;
        option.ihash[1] += b;
        option.ihash[2] += c;
        option.ihash[3] += d;
        option.ihash[4] += e;
        option.ihash[5] += f;
        option.ihash[6] += g;
        option.ihash[7] += h;
    }
    function sha256_update(option,data,inputLen){
        var curpos    = 0;
        var buffer    = option.buffer;
        var index     = ((option.count[0] >> 3) & 0x3f);
        var remainder = (inputLen & 0x3f);

        if((option.count[0] += (inputLen << 3)) < (inputLen << 3)){
            option.count[1]++;
        }
        option.count[1] += (inputLen >> 29);
        for(var i=0;i+63<inputLen;i+=64){
            for(var j=index;j<64;j++){
                buffer[j] = data.charCodeAt(curpos++);
            }
            sha256_transform(option);
            index = 0;
        }
        for(var j=0;j<remainder;j++){
            buffer[j] = data.charCodeAt(curpos++);
        }
    }
    function sha256_final(option) {
        var index  = ((option.count[0] >> 3) & 0x3f);
        var buffer = option.buffer;

        buffer[index++] = 0x80;

        if(index <= 56){
            for(var i=index;i<56;i++){
                buffer[i] = 0;
            }
        }else{
            for(var i=index;i<64;i++){
                buffer[i] = 0;
            }
            sha256_transform(option);
            for(var i=0;i<56;i++){
                buffer[i] = 0;
            }
        }
        buffer[56] = (option.count[1] >>> 24) & 0xff;
        buffer[57] = (option.count[1] >>> 16) & 0xff;
        buffer[58] = (option.count[1] >>> 8) & 0xff;
        buffer[59] = (option.count[1]) & 0xff;
        buffer[60] = (option.count[0] >>> 24) & 0xff;
        buffer[61] = (option.count[0] >>> 16) & 0xff;
        buffer[62] = (option.count[0] >>> 8) & 0xff;
        buffer[63] = (option.count[0]) & 0xff;

        sha256_transform(option);
    }
    function sha256_encode_bytes(option){
        var output = new Array(32);

        for(var i= 0,j=0;i<8; i++) {
            output[j++] = ((option.ihash[i] >>> 24) & 0xff);
            output[j++] = ((option.ihash[i] >>> 16) & 0xff);
            output[j++] = ((option.ihash[i] >>> 8) & 0xff);
            output[j++] = (option.ihash[i] & 0xff);
        }
        return output;
    }
    function sha256_encode_hex(option){
        var output = "";
        for(var i=0;i<8;i++){
            for(var j=28;j>=0;j-=4){
                output += sha256_hex_digits.charAt((option.ihash[i] >>> j) & 0x0f);
            }
        }
        return output;
    }
    function sha256_digest(text) {
        var option = sha256_init();

        sha256_update(option,text,text.length);
        sha256_final(option);

        return sha256_encode_hex(option);
    }

    return {
        /*[#module option:main]*/
        main:function(text){
            return sha256_digest(text);
        }
    }
});
