export const setCookie = (name: any, value: any, days = 7, path = '/') => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path
  }
  
export const getCookie = (name: any) => {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=')
      return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '')
  }
  
export const deleteCookie = (name: any, path: any = "/") => {
    setCookie(name, '', -1, path)
  }