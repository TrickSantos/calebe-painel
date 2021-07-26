import axios from 'axios'

const api = axios.create({ baseURL: process.env.REACT_APP_API })

api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN_API')}`
  config.headers.common.Authorization = `Bearer ${localStorage.getItem(
    'TOKEN_API'
  )}`
  return config
})

api.interceptors.response.use(undefined, error => {
  if (error.response.status === 401) {
    localStorage.clear()
  }
  return Promise.reject(error)
})

export default api
