function handleRouteParams(path) {
    const regexToIndetifyId = /:([a-zA-Z0-9]+)/g
    const replaceParams = path.replaceAll(regexToIndetifyId, '(?<$1>[a-z0-9\-_]+)')
    const pathRegex =  new RegExp(`^${replaceParams}(?<query>\\?(.*))?$`)

    return pathRegex
}


module.exports = {
    handleRouteParams
}