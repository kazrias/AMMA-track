import { createSlice, current } from "@reduxjs/toolkit";
const initialState = {
  workspaces: [],
  selectedImg: {
    thumb: ""
  },
  settingsOpened: false
};

export const workSpacesSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    addWorkspace: (state, action) => {
      state.workspaces = state.workspaces.map((workspace) => {
        return { ...workspace, active: false };
      });
      state.workspaces.unshift({
        id: action.payload.id,
        title: action.payload.title,
        img: action.payload.img,
        user: action.payload.user,
        active: action.payload.active,
        status: action.payload.status,
        count: action.payload.count,
      });
      // console.log(current(state).workspaces)
      // state.workspaces = [action.payload, ...state.workspaces]
    },
    workspaceCreationBoxHandle: (state, action) => {
      state.creationBox = action.payload.val;
    },
    selectWorkspaceImg: (state, action) => {
      state.selectedImg.thumb = action.payload.thumb;
    },
    toggleActiveWorkspace: (state, action) => {
      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.id === action.payload.id) {
          return { ...workspace, active: true };
        } else return { ...workspace, active: false };
      });
    },
    deleteActiveWorkspace: (state, action) => {
      state.workspaces = state.workspaces.map((workspace) => {
        return { ...workspace, active: false };
      });
    },

    openSettings: (state, action) => {
      state.settingsOpened = true;
    },
    closeSettings: (state, action) => {
      state.settingsOpened = false;
    },
    changeTitle: (state, action) => {
      const workSpaceToChange = state.workspaces.find(workspace => workspace.id === action.payload.id);
      workSpaceToChange.title = action.payload.newTitle;
    },
    changeIcon: (state, action) => {
      const workSpaceToChange = state.workspaces.find(workspace => workspace.id === action.payload.id);
      workSpaceToChange.img.thumb = action.payload.thumb
    },
    deleteWorkspace: (state, action) => {
      state.workspaces = state.workspaces.filter(workspace => workspace.id !== action.payload.id)
    },
    activateProStatus: (state, action) => {
      const workSpaceToActivate = state.workspaces.find(workspace => workspace.id === action.payload.id);
      workSpaceToActivate.status = 'Pro';
    },
    remainingDecr: (state, action) => {
      const workSpaceToDecr = state.workspaces.find(workspace => workspace.id === action.payload.id);
      workSpaceToDecr.count -= 1;
    },
    remainingInc: (state, action) => {
      const workSpaceToInc = state.workspaces.find(workspace => workspace.id === action.payload.id);
      workSpaceToInc.count += 1;
    },
    changeCount: (state, action) => {
      const workSpaceToChange = state.workspaces.find(workspace => workspace.id === action.payload.id);
      workSpaceToChange.count-=action.payload.count;
    }
  }
});
export const {
  addWorkspace,
  selectWorkspaceImg,
  toggleActiveWorkspace,
  deleteActiveWorkspace,
  openSettings,
  changeTitle,
  changeIcon,
  deleteWorkspace,
  closeSettings,
  activateProStatus,
  remainingInc,
  remainingDecr,
  changeCount
} = workSpacesSlice.actions;
export default workSpacesSlice.reducer;
