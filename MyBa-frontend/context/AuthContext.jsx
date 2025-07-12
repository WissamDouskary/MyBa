import { createContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const AuthContext = createContext({
  userToken: null,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null)

  const login = async (token) => {
    await AsyncStorage.setItem("userToken", token)
    setUserToken(token)
  }

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "userData", "accountData"])
      setUserToken(null)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const checkToken = async () => {
    const token = await AsyncStorage.getItem("userToken")
    setUserToken(token)
  }

  useEffect(() => {
    checkToken()
  }, [])

  return <AuthContext.Provider value={{ userToken, login, logout }}>{children}</AuthContext.Provider>
}
