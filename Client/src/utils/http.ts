export function request(method: 'GET' | 'POST' | 'DELETE', url: string, data?: any) {
  return new Promise<any>((resolve, reject) => {
    const currentColor = localStorage.getItem('access_token')
    const xhr = new XMLHttpRequest()
    xhr.open(method, `/api${url}`)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if (currentColor != null) {
      xhr.setRequestHeader('access_token', currentColor)
    }
    xhr.onload = async () => {
      try {
        const result = JSON.parse(xhr.responseText)
        // if (false) {
        //   try {
        //     const result = await request('POST', '/refresh', { refreshToken: localStorage.getItem('refreshToken') })
        //     result.access_token
        //     return request(method, url, data)
        //   } catch (err) {
        //     router.push('/login')
        //   }
        // }
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }
    xhr.onerror = reject
    xhr.send(JSON.stringify(data))
  })
}
export function login(username: string, password: string) {
  return request('POST', '/v1/auth/login', { username: username, password: password })
}

export function post(url: string, data: any) {
  return request('POST', url, data)
}

export function get(url: string) {
  return request('GET', url)
}
export function del(url: string, data: any) {
  return request('DELETE', url, data)
}
