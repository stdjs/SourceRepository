/**
 * md6 encode
 */
Std.crypto.md6 = Std.module(function(){
    function to_word(input){
        var output = [];
        for(var i=0,length=input.length;i<length;i += 8){
            output.push([
                ((input[i + 0] & 0xff) << 24) |
                ((input[i + 1] & 0xff) << 16) |
                ((input[i + 2] & 0xff) << 8) |
                ((input[i + 3] & 0xff) << 0),
                ((input[i + 4] & 0xff) << 24) |
                ((input[i + 5] & 0xff) << 16) |
                ((input[i + 6] & 0xff) << 8) |
                ((input[i + 7] & 0xff) << 0)
            ]);
        }
        return output;
    }
    function from_word(input){
        var output = [];
        for(var i=0,length=input.length;i<length;i += 1){
            output.push((input[i][0] >> 24) & 0xff);
            output.push((input[i][0] >> 16) & 0xff);
            output.push((input[i][0] >> 8) & 0xff);
            output.push((input[i][0] >> 0) & 0xff);
            output.push((input[i][1] >> 24) & 0xff);
            output.push((input[i][1] >> 16) & 0xff);
            output.push((input[i][1] >> 8) & 0xff);
            output.push((input[i][1] >> 0) & 0xff);
        }
        return output;
    }
    function _xor(x,y){
        return [x[0] ^ y[0], x[1] ^ y[1]];
    }
    function _and(x,y){
        return [x[0] & y[0], x[1] & y[1]];
    }
    function _shl(x,n){
        var a = x[0] | 0x0, b = x[1] | 0x0;

        if(n >= 32){
            return [(b << (n - 32)), 0x0];
        }
        return [((a << n) | (b >>> (32 - n))), (b << n)];
    }
    function _shr(x,n){
        var a = x[0] | 0x0, b = x[1] | 0x0;

        if(n >= 32){
            return [0x0, (a >>> (n - 32))];
        }
        return [(a >>> n), ((a << (32 - n)) | (b >>> n))];
    }
    function crop(size,hashData,right){
        var length = Math.floor((size + 7) / 8), remain = size % 8;

        if(right){
            hashData = hashData.slice(hashData.length - length);
        }else{
            hashData = hashData.slice(0, length);
        }

        if(remain > 0) {
            hashData[length - 1] &= (0xff << (8 - remain)) & 0xff;
        }
        return hashData;
    }
    function hash(size,data,key,levels){
        var b, c, n, d, M, K, k, r, L, ell, S0, Sm, Q, t, rs, ls;
        b = 512;
        c = 128;
        n = 89;
        d = size;
        M = data;
        K = key.slice(0, 64);
        k = K.length;

        while(K.length < 64){
            K.push(0x00);
        }

        K = to_word(K);
        r = Math.max((k ? 80 : 0), (40 + (d / 4)));
        L = levels;
        ell = 0;
        S0 = [0x01234567, 0x89abcdef];
        Sm = [0x7311c281, 0x2425cfa0];
        Q = [
            [0x7311c281, 0x2425cfa0], [0x64322864, 0x34aac8e7], [0xb60450e9, 0xef68b7c1],
            [0xe8fb2390, 0x8d9f06f1], [0xdd2e76cb, 0xa691e5bf], [0x0cd0d63b, 0x2c30bc41],
            [0x1f8ccf68, 0x23058f8a], [0x54e5ed5b, 0x88e3775d], [0x4ad12aae, 0x0a6d6031],
            [0x3e7f16bb, 0x88222e0d], [0x8af8671d, 0x3fb50c2c], [0x995ad117, 0x8bd25c31],
            [0xc878c1dd, 0x04c4b633], [0x3b72066c, 0x7a1552ac], [0x0d6f3522, 0x631effcb]
        ];
        t = [17, 18, 21, 31, 67, 89];
        rs = [10, 5, 13, 10, 11, 12, 2, 7, 14, 15, 7, 13, 11, 7, 6, 12];
        ls = [11, 24, 9, 16, 15, 9, 27, 15, 6, 2, 29, 8, 15, 5, 31, 9];

        function f(N){
            var i, j, s, x, S = [].concat(S0), A = [].concat(N);
            for(j = 0, i = n ; j < r ; j += 1, i += 16) {
                for(s = 0 ; s < 16 ; s += 1) {
                    x = [].concat(S);
                    x = _xor(x, A[i + s - t[5]]);
                    x = _xor(x, A[i + s - t[0]]);
                    x = _xor(x, _and(A[i + s - t[1]], A[i + s - t[2]]));
                    x = _xor(x, _and(A[i + s - t[3]], A[i + s - t[4]]));
                    x = _xor(x, _shr(x, rs[s]));
                    A[i + s] = _xor(x, _shl(x, ls[s]));
                }
                S = _xor(_xor(_shl(S, 1), _shr(S, (64 - 1))), _and(S, Sm));
            }
            return A.slice(A.length - 16);
        }
        function mid(B, C, i, p, z) {
            var U, V;
            U = [
                ((ell & 0xff) << 24) | ((i / Math.pow(2, 32)) & 0xffffff),
                i & 0xffffffff
            ];
            V = [
                ((r & 0xfff) << 16) | ((L & 0xff) << 8) | ((z & 0xf) << 4) | ((p & 0xf000) >> 12),
                (((p & 0xfff) << 20) | ((k & 0xff) << 12) | ((d & 0xfff)))
            ];
            return f([].concat(Q, K, [U, V], C, B));
        }
        function par(M) {
            var i, l, p, z, P = 0, B = [], C = [];
            z = (M.length > b ? 0 : 1);
            while((M.length < 1) || ((M.length % b) > 0)) {
                M.push(0x00);
                P += 8;
            }
            M = to_word(M);
            while(M.length > 0) {
                B.push(M.slice(0, (b / 8)));
                M = M.slice(b / 8);
            }
            for(i = 0, p = 0, l = B.length ; i < l ; i += 1, p = 0) {
                p = (i === (B.length - 1)) ? P : 0;
                C = C.concat(mid(B[i], [], i, p, z));
            }
            return from_word(C);
        }
        function seq(M){
            var i, l, p, z, P = 0, B = [], C = [
                [0x0, 0x0], [0x0, 0x0], [0x0, 0x0], [0x0, 0x0],
                [0x0, 0x0], [0x0, 0x0], [0x0, 0x0], [0x0, 0x0],
                [0x0, 0x0], [0x0, 0x0], [0x0, 0x0], [0x0, 0x0],
                [0x0, 0x0], [0x0, 0x0], [0x0, 0x0], [0x0, 0x0]
            ];
            while((M.length < 1) || ((M.length % (b - c)) > 0)) {
                M.push(0x00);
                P += 8;
            }
            M = to_word(M);
            while(M.length > 0) {
                B.push(M.slice(0, ((b - c) / 8)));
                M = M.slice((b - c) / 8);
            }
            for(i = 0, p = 0, l = B.length ; i < l ; i += 1, p = 0) {
                p = (i === (B.length - 1)) ? P : 0;
                z = (i === (B.length - 1)) ? 1 : 0;
                C = mid(B[i], C, i, p, z);
            }
            return from_word(C);
        }
        do{
            ell += 1;
            M = ell > L ? seq(M) : par(M);
        } while(M.length !== c);

        return crop(d, M, true);
    }
    function bytes(input){
        var output = [];
        for(var i=0,length=input.length;i<length;i++){
            var ch = input.charCodeAt(i);
            if(ch <= 0x7f){
                output.push(ch);
            }else if(ch <= 0x7ff){
                output.push((ch >> 6) | 0xc0);
                output.push((ch & 0x3F) | 0x80);
            }else if(ch <= 0xffff){
                output.push((ch >> 12) | 0xe0);
                output.push(((ch >> 6) & 0x3f) | 0x80);
                output.push((ch & 0x3f) | 0x80);
            }else{
                output.push((ch >> 18) | 0xf0);
                output.push(((ch >> 12) & 0x3f) | 0x80);
                output.push(((ch >> 6) & 0x3f) | 0x80);
                output.push((ch & 0x3f) | 0x80);
            }
        }
        return output;
    }
    function prehash(data,size,key,levels){
        if(data === undefined){
            data = "";
        }
        if(size === undefined){
            size = 256
        }
        if(key === undefined){
            key = ""
        }
        if(levels === undefined){
            levels = 64;
        }

        data = bytes(data);
        key  = bytes(key);

        if(size <= 0){
            size = 1;
        }else if(size > 512){
            size = 512;
        }
        return hash(size,data,key,levels);
    }
    function md6_hex(data,size,key,levels){
        var _text = "";
        var _hash = prehash(data,size,key,levels);

        for(var i=0,length=_hash.length;i<length;i++) {
            var x = _hash[i].toString(16);
            if(x.length === 1){
                x = "0" + x;
            }
            _text += x;
        }
        return _text;
    }
    function raw(data,size,key,levels){
        var _text = "";
        var _hash = prehash(data, size, key, levels);

        for(var i=0,length=_hash.length;i<length;i++){
            _text += String.fromCharCode(_hash[i]);
        }
        return _text;
    }


    return {
        /*[#module option:main]*/
        main:function(text){
            return md6_hex(text);
        }
    }
});
