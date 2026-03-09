import React, { useState, createContext } from 'react'

export const AuthContext = createContext()

export default function AuthContextProvider({ children }) {

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}