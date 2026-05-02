import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const accessToken = localStorage.getItem('accessToken')
    const username = localStorage.getItem('username')
    return accessToken ? { accessToken, username } : null
  })

  function login(data) {
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('username', data.username)
    setUser({ accessToken: data.accessToken, username: data.username })
  }

  async function logout() {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5280/api'}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ refreshToken }),
      })
    } finally {
      localStorage.clear()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}