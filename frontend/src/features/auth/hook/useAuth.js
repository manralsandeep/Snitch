import { register, login, getMe, logout } from "../service/auth.api"
import { useDispatch } from "react-redux"
import { setUser, setLoading, setError } from "../state/auth.slice"

export function useAuth() {

    const dispatch = useDispatch()

    async function handleLogin({ email, password }) {

        const data = await login({ email, password })
        dispatch(setUser(data.user))
        return data.user

    }


    async function handleRegister({ email, password, contact, fullname, isSeller = false }) {

        const data = await register({ email, password, contact, fullname, isSeller })
        dispatch(setUser(data.user))
        return data.user
    }

    async function handleGetme() {

        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
            return data.user
        } catch (err) {
            console.log(err)
        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleLogout() {
        const data = await logout()
        
    }

    return { handleLogin, handleRegister, handleGetme ,handleLogout }

}