import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeUserSession = async (token, user, account) => {
  try {
    await AsyncStorage.setItem("userToken", token)
    await AsyncStorage.setItem("userData", JSON.stringify(user))
    await AsyncStorage.setItem("accountData", JSON.stringify(account))
  } catch (error) {
    console.error("Error storing session:", error)
  }
}

export const getUserSession = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken")
    const userJson = await AsyncStorage.getItem("userData")
    const accountJson = await AsyncStorage.getItem("accountData")

    return {
      token,
      user: userJson ? JSON.parse(userJson) : null,
      account: accountJson ? JSON.parse(accountJson) : null,
    }
  } catch (error) {
    console.error("Error retrieving session:", error)
    return { token: null, user: null, account: null }
  }
}
