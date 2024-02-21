import "./Header.css";

import { Button } from "../Button/Button";

import ammaTruckLogo from "../../images/amma-truck-logo.png";

import { useDispatch, useSelector } from "react-redux";
import { deleteActiveWorkspace, closeSettings } from "../../redux/slices/workspacesSlice";

import { boardCreationBoxHandle, workspaceCreationBoxHandle } from "../../redux/slices/creationBoxSlice";

import { Link } from "react-router-dom";

export const Header = () => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  let buttons;
  const loggedUser = useSelector((state) => state.auth.loggedUser);
  const dispatch = useDispatch();
  if (!loggedIn) {
    buttons = (
      <>
        <Link to="/login">
          <Button type="main">Sign In</Button>
        </Link>
        <Link to="/sign-up">
          <Button type="secondary">Sign Up</Button>
        </Link>
      </>
    );
  } else {
    const userAvatar =
      loggedUser && loggedUser.userName
        ? loggedUser.userName[0].toUpperCase()
        : "";
    buttons = (
      <>
        <Link to="/account">
          <Button onClick={() => { dispatch(closeSettings()); dispatch(boardCreationBoxHandle({ val: false })); dispatch(workspaceCreationBoxHandle({ val: false })) }} type="account-btn">{userAvatar}</Button>
        </Link>
        <Link to="/log-out">
          <Button
            onClick={() => { dispatch(closeSettings()); dispatch(deleteActiveWorkspace({})); dispatch(boardCreationBoxHandle({ val: false })); dispatch(workspaceCreationBoxHandle({ val: false })) }}
            type="secondary"
          >
            Log Out
          </Button>
        </Link>
      </>
    );
  }

  return (
    <div className="header">
      <div className="container">
        <div className="header-wrapper">
          <Link to={`${loggedIn ? "/workspaces" : "/"}`}>
            <img src={ammaTruckLogo} alt="logo" />
            <p>AMMA-TRACK</p>
          </Link>
          <div className="header-buttons">{buttons}</div>
        </div>
      </div>
    </div>
  );
};
