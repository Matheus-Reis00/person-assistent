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

export function currencyFormatter(currency: string) {
    let input = currency

    // remove tudo que não for número
    input = input.replace(/\D/g, "");

    // se não tiver nada, limpa
    if (input === "") {
      return ''
    }

    // transforma em número (últimos 2 dígitos são os centavos)
    const numero = parseFloat(input) / 100;

    // formata no padrão BRL
    const formatado = numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formatado;
}
