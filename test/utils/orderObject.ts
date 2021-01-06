export default function orderObject(object: any): any {
    Object.keys(object).map(key => {
        if (Array.isArray(object[key])) {
            object[key] = object[key].sort();
        } else if (typeof object[key] === 'object') {
            object[key] = orderObject(object[key]);
        }
    });

    return object;
}
