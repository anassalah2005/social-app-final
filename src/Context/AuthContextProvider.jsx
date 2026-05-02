import React, { useState, createContext } from 'react'

export const AuthContext = createContext()

export default function AuthContextProvider({ children }) {

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken === "null" || savedToken === "undefined" || !savedToken) return null;
    return savedToken;
  });

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}