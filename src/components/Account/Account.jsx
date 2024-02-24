import "./Account.css";

import { useState, forwardRef } from "react";

import { validatePassword } from "../../validations/validate";

import { useDispatch, useSelector } from "react-redux";
import {
  updatePassword,
  deleteAccount,
  updateUsername,
  logOut
} from "../../redux/slices/authenticationSlice";

import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";


import { db } from "../../config/firebaseConfig";
import {
  collection,
  updateDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";


export const Account = forwardRef((props, ref) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.loggedUser);

  const [currentPassword, setCurrentPassword] = useState('');
  const [wrongCurrent, setWrongCurrent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [newUsername, setNewUsername] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangeUsernameModal, setShowChangeUsernameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const usersCollection = collection(db, "users");

  const changeAccountData = async (data) => {
    const snapshot = await getDocs(usersCollection);
    for (let userDoc of snapshot.docs.filter(
      (doc) => doc.data().id === user.id
    )) {
      if (userDoc.id) {
        await updateDoc(doc(db, "users", userDoc.id), {
          ...userDoc.data(),
          ...data
        });
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (user.password !== CryptoJS.SHA256(currentPassword).toString(CryptoJS.enc.Hex)) {
      setWrongCurrent(true);
      return;
    }
    const errors = validatePassword(newPassword);
    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0 && newPassword === confirmPassword) {
      await changeAccountData({ password: CryptoJS.SHA256(newPassword).toString(CryptoJS.enc.Hex) });
      dispatch(updatePassword({ userId: user.id, newPassword: CryptoJS.SHA256(newPassword).toString(CryptoJS.enc.Hex) }));
      const updatedUser = { ...user, password: CryptoJS.SHA256(newPassword).toString(CryptoJS.enc.Hex) };
      window.localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
      setNewPassword();
      setConfirmPassword("");
      setCurrentPassword("")
      setShowChangePasswordModal(false);
    } else if (newPassword !== confirmPassword) {
      setPasswordErrors({
        ...errors,
        confirmPassword: "Passwords do not match."
      });
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    if (newUsername.trim() === "") {
      return;
    }
    const updatedUser = { ...user, userName: newUsername };
    dispatch(updateUsername({ userId: user.id, newUsername }));
    window.localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
    setShowChangeUsernameModal(false);

    await changeAccountData({ userName: newUsername });
  };


  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmation = async () => {
    const snapshot = await getDocs(usersCollection);
    for (let userDoc of snapshot.docs.filter(
      (doc) => doc.data().id === user.id
    )) {
      if (userDoc.id) await deleteDoc(doc(db, "users", userDoc.id));
    }
    dispatch(deleteAccount({ userId: user.id }));
    dispatch(logOut());
    setShowDeleteModal(false);
    localStorage.clear()
    navigate("/");
  };


  return (
    <div ref={ref} className="accountSettings-section" >
      {showChangePasswordModal && (
        <div className="change-modal">
          <div className="change-modal-content">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              {Object.keys(passwordErrors).length > 0 && (
                <div className="password-validation-errors">
                  {Object.values(passwordErrors).map((error, index) => (
                    <p key={index} className="error-message">
                      {error}
                    </p>
                  ))}

                </div>
              )}
              {
                wrongCurrent && <p className="error-message">
                  Password is wrong!
                </p>
              }
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="form__modal-btns">
                <button type="submit">Change Password</button>
                <button onClick={() => setShowChangePasswordModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {
        showChangeUsernameModal && (
          <div className="change-modal">
            <div className="change-modal-content">
              <h2>Change Username</h2>
              <form onSubmit={handleUsernameChange}>
                <input
                  type="text"
                  placeholder="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <div className="form__modal-btns">
                  <button type="submit">Change Username</button>
                  <button onClick={() => setShowChangeUsernameModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      {
        showDeleteModal && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <h2>Confirm Account Deletion</h2>
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="form__modal-btns form__modal-btns--delete">
                <button onClick={handleDeleteConfirmation}>Yes, Delete</button>
                <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )
      }
      <div className="account-container">
        <button onClick={() => setShowChangeUsernameModal(true)}>
          Change Username
        </button>
        <button onClick={() => setShowChangePasswordModal(true)}>
          Change Password
        </button>
        <button onClick={handleDeleteAccount}>Delete Account</button>
        <button onClick={props.onClickLogout}>Logout</button>
      </div>
    </div >
  );
})
