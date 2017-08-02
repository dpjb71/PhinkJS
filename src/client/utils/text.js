var Phink = Phink || {}

Phink.Utils = function () {

};

Phink.Utils.find = function (haystack, index, needle) {
    var result = [];

    if (haystack.length === 0) return result;
    var first = JSON.parse(haystack[0]);
    if (first.length < index - 1) return result;

    for (var k = 0; k < haystack.length; ++k) {
        var row = JSON.parse(haystack[k]);
        if (needle == row[index]) {
            result = row;
            break;
        }
    }

    return result;
};

/**
 * 
 * @param {type} haystack
 * @param {type} key
 * @param {type} needle
 * @returns {Array|TUtils.grep.haystack}
 */
Phink.Utils.grep = function (haystack, key, needle) {
    var result = [];

    if (haystack.length === 0) return result;
    var first = JSON.parse(haystack[0]);
    if (!first.hasOwnProperty(key)) return result;

    for (var k = 0; k < haystack.length; ++k) {
        var row = JSON.parse(haystack[k]);
        if (needle == row[key]) {
            result = row;
            break;
        }
    }

    return result;
};

Phink.Utils.resizeIframe = function (ui) {
    ui.style.height = ui.contentWindow.document.body.scrollHeight + 'px';
};

Phink.Utils.html64 = function (container, html) {
    $(container).html(Phink.Utils.base64Decode(html));
};

Phink.Utils.secondsToString = function (seconds) {
    var minutes = Math.floor(seconds / 60)
    var seconds = seconds - (minutes * 60)

    return minutes + ':' + ('00' + seconds).toString().slice(-2)
}

function debugLog(message) {
    alert(message);
}

Phink.Utils.base64Decode = function (data) {
    if (!data) {
        return data;
    }

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];
    data += '';

    do {
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4; o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff; o3 = bits & 0xff;
        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        }
        else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        }
        else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }

    }
    while (i < data.length);

    dec = tmp_arr.join('');
    dec = Phink.Utils.utf8Decode(dec);

    return dec;
}

Phink.Utils.base64Encode = function (data) {
    if (!data) {
        return data;
    }

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = "", tmp_arr = [];

    data = Phink.Utils.utf8Encode(data + '');
    do {
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++); o3 = data.charCodeAt(i++);
        bits = o1 << 16 | o2 << 8 | o3; h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    }
    while (i < data.length);

    enc = tmp_arr.join('');
    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

Phink.Utils.utf8Decode = function (str_data) {
    var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0; str_data += '';
    
    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 < 128) {
            tmp_arr[ac++] = String.fromCharCode(c1); i++;
        } else if (c1 > 191 && c1 < 224) {
            c2 = str_data.charCodeAt(i + 1); tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63)); i += 2;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2); tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)); i += 3;
        }
    }
    
    return tmp_arr.join('');
}

Phink.Utils.utf8Encode = function (argString) {
    if (argString === null || typeof argString === "undefined") {
        return "";
    }
    var string = (argString + '');
    var utftext = "", start, end, stringl = 0; start = end = 0; stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;
        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) { utftext += string.slice(start, end); }
            utftext += enc; start = end = n + 1;
        }
    }
    if (end > start) {
        utftext += string.slice(start, stringl);
    }
    
    return utftext;
}
