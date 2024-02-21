import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../redux/slices/authenticationSlice";

import { Navigate } from "react-router-dom";

export default function LogOut() {
    const loggedIn = useSelector((state) => state.auth.loggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        if (loggedIn) {
            dispatch(logOut());
        }
    }, [dispatch, loggedIn]);

    return <Navigate to="/" />
}