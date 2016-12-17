module.exports = function (obj /*, varargs properties*/) {
    let props = Array.prototype.slice.call(arguments, 1);

    for (let i = 0; i < props.length; i++) {
        if (!obj || !obj.hasOwnProperty(props[i])) {
            return false
        }
        obj = obj[props[i]]
    }
    return obj
}