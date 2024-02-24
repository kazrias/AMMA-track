import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

const initialState = {
  loggedIn: false,
  users: [],
  loggedUser: {}
};

export const uploadUserImage = createAsyncThunk(
  "authentication/uploadUserImage",
  async (imageFile, { getState }) => {
    // Here you would handle the actual file upload logic
    // For example, uploading to a server and getting back a URL

    const imageUrl = URL.createObjectURL(imageFile);
    return imageUrl;
  }
);

export const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    signUp: (state, action) => {
      state.users = [...state.users, action.payload];
    },

    login: (state, action) => {
      state.loggedIn = true;
      state.loggedUser = action.payload;
      window.localStorage.setItem("isLoggedIn", "ON");
      window.localStorage.setItem("loggedUser", JSON.stringify(action.payload));
    },

    logOut: (state) => {
      state.loggedIn = false;
      state.loggedUser = {};
      window.localStorage.setItem("isLoggedIn", "OFF");
      window.localStorage.removeItem("loggedUser");
    },
    updatePassword: (state, action) => {
      const { userId, newPassword } = action.payload;
      console.log(newPassword);
      const user = state.users.find((u) => u.id === userId);
      state.loggedUser.password = newPassword;
      if (user) {
        user.password = newPassword;
      }
      console.log(current(state).loggedUser);
      console.log(current(state).users);
    },

    switchAccount: (state) => {
      state.loggedIn = false;
      state.loggedUser = {};
      window.localStorage.setItem("isLoggedIn", "OFF");
      window.localStorage.removeItem("loggedUser");
    },
    updateUsername: (state, action) => {
      const { userId, newUsername } = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex].userName = newUsername;
        if (state.loggedUser.id === userId) {
          state.loggedUser.userName = newUsername;
        }
      }
    },

    deleteAccount: (state, action) => {
      const { userId } = action.payload;
      state.users = state.users.filter((u) => u.id !== userId);
      if (state.loggedUser.id === userId) {
        state.loggedIn = false;
        state.loggedUser = {};
        window.localStorage.setItem("isLoggedIn", "OFF");
        window.localStorage.removeItem("loggedUser");
      }
    },
    extraReducers: (builder) => {
      builder.addCase(uploadUserImage.fulfilled, (state, action) => {
        const userId = state.loggedUser.id;
        const imageUrl = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          user.image = imageUrl;
        }
        if (state.loggedUser.id === userId) {
          state.loggedUser.image = imageUrl;
        }
      });
    }
  }
});

export const {
  signUp,
  login,
  logOut,
  updatePassword,
  updateUsername,
  switchAccount,
  deleteAccount,
} = authSlice.actions;

export default authSlice.reducer;
