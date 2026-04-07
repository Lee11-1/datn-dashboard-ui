import axios from 'axios'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

class RequestHandler {
  constructor (base_url) {
    this.axios = axios.create({
      baseURL: base_url,
      withCredentials: true
    })
  }

  make_request_data ({
                       method,
                       payload,
                       headers = null,
                       progress_handler = null
                     }) {
    if (!headers) {
      headers = {}
    }
    if (method === 'get' || method === 'delete') {
      const params = {}
      if (payload) {
        Object.keys(payload).forEach(k => {
          let v = payload[k]
          if (Array.isArray(v)) v = v.join(',')
          params[k] = v
        })
      }
      return [{
        headers: headers,
        params: params
      }]
    } else if (method === 'post' || method === 'put' || method === 'patch') {
      const options = {}
      if (typeof progress_handler === 'function') options['onUploadProgress'] = progress_handler
      return [
        payload,
        {headers: headers, ...options}
      ]
    }
  }

  async do_request ({url, method, payload, headers, progress_handler}) {
    if (!payload || !(payload instanceof Object)) payload = {}

    const request_data = this.make_request_data({
      method,
      payload,
      headers,
      progress_handler
    })

    const result = {
      status: 200,
      data: null,
      error: null,
      message: null
    }

    try {
      const response = await this.axios[method](url, ...request_data)
      result.status = response.status
      result.data = response.data
    } catch (error) {
      const response = error.response || {}
      result.status = response.status || 500
      result.data = response.data || {error: 'UnknownError'}
    }
    return result
  }
}

class Api {
  constructor ({store, router}) {
    console.log(process.env.API_URL || '----test----api---')
    this.request_handler = new RequestHandler(
      process.env.API_URL
    )
    this.store = store
    this.router = router
  }

  async do_request (endpoint, {method, payload, headers, progress_handler}) {
    let final_headers = {
      Authorization: 'Bearer ' + this.store.state.Auth.access_token,
    }
    if (headers) {
      Object.assign(final_headers, headers)
    }

    let request_params = {
      url: endpoint,
      headers: final_headers,
      method,
      payload,
      progress_handler
    }
    const response = await this.request_handler.do_request(request_params)
    if (response.status === 401) {
      this.store.commit('Auth/signed_out')
      this.router.push('/auth')
    }
    return response
  }

  authenticate ({username, password}) {

    const payload = {
      username,
      password,
      scope_type: 'System'
    }

    return this.do_request(
      '/auth/login',
      {
        method: 'post',
        payload,
      }
    )
  }



}

export default Api

export const use_api = () => {
  const router = useRouter()
  const store = useStore()
  return new Api({store, router})
}
