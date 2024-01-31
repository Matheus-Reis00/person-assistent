export const handleSetParamsUrl = (uri: string, params: any): string => {
    let url = new URL(uri)
    const paramsKeys = Object.keys(params)

    if (paramsKeys.length > 0) {
        paramsKeys.forEach((paramKey) => {
            if (!(url.searchParams.get(paramKey) && url.searchParams.get(paramKey) === params[paramKey]))
                url.searchParams.set(paramKey, params[paramKey])
            else if (!params[paramKey])
                url.searchParams.delete(paramKey)
        })
    }

    return url.href
}