import "./Header.css";

import { useState, useRef, useEffect } from "react";

import { Button } from "../Button/Button";
import { Account } from "../Account/Account"

import ammaTruckLogo from "../../images/amma-truck-logo.png";
import us from '../../images/us.png'

import { useDispatch, useSelector } from "react-redux";
import { deleteActiveWorkspace, closeSettings } from "../../redux/slices/workspacesSlice";
import { boardCreationBoxHandle, workspaceCreationBoxHandle } from "../../redux/slices/creationBoxSlice";
import { logOut } from "../../redux/slices/authenticationSlice";

import { Link } from "react-router-dom";

export const Header = () => {
  let buttons;
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const loggedUser = useSelector((state) => state.auth.loggedUser);
  const dispatch = useDispatch();
  const [settingsOpened, setSettingsOpened] = useState(false)
  const onClickAccount = () => {
    dispatch(closeSettings());
    dispatch(boardCreationBoxHandle({ val: false }));
    dispatch(workspaceCreationBoxHandle({ val: false }))
    setSettingsOpened(true)
  }
  const accountSettingsRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountSettingsRef.current && !accountSettingsRef.current.contains(event.target) && event.target.alt !== 'userImg') {
        setSettingsOpened(false)
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const onClickLogout = () => {
    dispatch(logOut());
    dispatch(closeSettings());
    dispatch(deleteActiveWorkspace({}));
    dispatch(boardCreationBoxHandle({ val: false }));
    dispatch(workspaceCreationBoxHandle({ val: false }))
  }
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
    buttons = (
      <>

        <div className="account-setting">
          <Button onClick={onClickAccount} type="account-btn"><div className="user-avatar"><img src={us} alt="userImg" /></div></Button>
          <p>{loggedUser.userName}</p>
          {settingsOpened && <Account ref={accountSettingsRef} onClickLogout={onClickLogout} />}
        </div>

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
