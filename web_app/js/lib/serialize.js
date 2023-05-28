export function serialize(params) {
    let data = '';

    for (let key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            let param = params[key];
            let type = Object.prototype.toString.call(param);
            let value;

            if (data.length) {
                data += '&';
            }

            if (type === '[object Array]') {
                value = (Object.prototype.toString.call(param[0]) === '[object Object]') ? JSON.stringify(param) : param.join(',');
            } else if (type === '[object Object]') {
                value = JSON.stringify(param);
            } else if (type === '[object Date]') {
                value = param.valueOf();
            } else {
                value = param;
            }

            data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
    }

    return data;
}