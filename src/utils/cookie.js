// 操作cookie方法
let cookie = {
    "setCookie": function (cname, cvalue, exdays = 0, path = "") {
        var expires = '';
        if (exdays != 0) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            expires = "expires=" + d.toUTCString();
        }
        var pathValue = "";
        if (path === "") {
            pathValue = "path=/";
        } else {
            pathValue = "path=" + path;
        }
        document.cookie = cname + "=" + cvalue + "; " + expires + "; " + pathValue;
        //document.cookie.setMa
    },
    "getCookie": function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    },
    "removeCookie": function (name) {
        // var exp = new Date();
        // exp.setTime(exp.getTime() - 1);
        // var cval = this.getCookie(name);
        // if (cval != null)
        //     //document.cookie= name + "="+cval+";expires="+exp.toUTCString();
        //     document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        this.setCookie(name,'',-1);
    },
    "exsitKey": function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) === 0) return true;
        }
        return false;
    }
};
export default cookie;
