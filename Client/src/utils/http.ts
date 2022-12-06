export function request(method: 'GET' | 'POST' | 'DELETE' | 'PUT', url: string, data?: any) {
  return new Promise<any>((resolve, reject) => {
    const currentColor = localStorage.getItem('access_token')
    const xhr = new XMLHttpRequest()
    xhr.open(method, `/api${url}`)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if (currentColor != null) {
      currentColor.replace(/\s/g, '')
      console.error(`Bearer ${currentColor}`)
      xhr.setRequestHeader('Authorization', `Bearer ${currentColor}`)
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
export function refreshToken() {
  // post('/v1/auth/refresh-token', {
  //   // eslint-disable-next-line @typescript-eslint/camelcase
  //   refresh_token: localStorage.getItem('refresh_token')
  // }).then((res) => {
  //   if (res.refresh_token) {
  //     localStorage.setItem('refresh_token', res.refresh_token)
  //     return 1;
  //   }
  //   return 0;
  // })
  console.log(localStorage.getItem('refresh_token'))
  request('POST', '/v2/refreshToken', {
    // eslint-disable-next-line @typescript-eslint/camelcase
    rToken: localStorage.getItem('refresh_token')
  }).then((res) => {
    console.log(res.status)
    if (res.status === 'success') {
      localStorage.setItem('refresh_token', res.rToken)
      localStorage.setItem('access_token', res.aToken)
      return
    }
    console.log('hellow')
  }).catch((e) => {
    console.error(e)
  })
}

export function post(url: string, data: any) {
  return request('POST', url, data)
}

export function get(url: string) {
  return request('GET', url)
}
export function del(url: string, data: any = {}) {
  return request('DELETE', url, data)
}
export function put(url: string, data: any) {
  return request('PUT', url, data)
}
