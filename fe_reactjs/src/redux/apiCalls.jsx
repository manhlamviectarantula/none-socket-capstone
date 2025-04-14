import axios from "axios"
import { loginFailure, loginStart, loginSuccess, logoutSucess } from "./userRedux"

export const login = async (dispatch, user) => {
    dispatch(loginStart())
    try {
        const res = await axios.post(`${process.env.REACT_APP_API}/auth/login`, user)
        dispatch(loginSuccess(res.data))
        return true;
    } catch (err) {
        const ErroMes = err.response.data.error
        dispatch(loginFailure(ErroMes))
    }
}

export const logout = async (dispatch) => {
    try {
        // const res = await axios.post('http://localhost:8000/api/v0/auth/logout-user')
        dispatch(logoutSucess())
    } catch (err) {
        console.log(err)
    }
}