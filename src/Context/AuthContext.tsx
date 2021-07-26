import { AxiosError, AxiosResponse } from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import api from '../Service/api'
import { ILogin, IResponseLogin, IUsuario } from '../Types'

const TOKEN_API = 'TOKEN_API'
const STORAGE_USER = 'STORAGE_USER'

interface AuthContextData {
  signed: boolean
  user: IUsuario | null
  login(data: ILogin): Promise<AxiosResponse>
  logout(): Promise<AxiosResponse>
  loading: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<IUsuario | null>(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storageUser = localStorage.getItem(STORAGE_USER)
    const storageToken = localStorage.getItem(TOKEN_API)

    if (storageToken && storageUser) {
      api.defaults.headers.common.Authorization = `Bearer ${storageToken}`
      api.defaults.headers.Authorization = `Bearer ${storageToken}`
      setUser(JSON.parse(storageUser))
    }
  }, [])

  const login = async (request: ILogin) => {
    setLoading(true)
    return new Promise<AxiosResponse>((resolve, reject) => {
      api
        .post('/login', request)
        .then(response => {
          setLoading(false)
          const { token, user }: IResponseLogin = response.data

          if (user.perfil === 'membro') {
            throw new Error('Acesso não permitido!')
          }

          setUser(user)

          api.defaults.headers.common.Authorization = `Bearer ${token}`
          api.defaults.headers.Authorization = `Bearer ${token}`

          localStorage.setItem(STORAGE_USER, JSON.stringify(user))
          localStorage.setItem(TOKEN_API, token)
          resolve(response)
        })
        .catch(error => {
          setLoading(false)
          const err = error as AxiosError

          reject(err)
        })
    })
  }

  async function logout() {
    return new Promise<AxiosResponse>(resolve => {
      api.post('/logout').then(response => {
        localStorage.clear()
        setUser(null)
        resolve(response)
      })
    })
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
