import { createSlice, current } from '@reduxjs/toolkit';
const initialState = {
  workspaceCreationBox: false,
  boardCreationBox: false,
}

export const creationSlice = createSlice({
  name: 'creation',
  initialState,
  reducers: {
    boardCreationBoxHandle: (state, action) => {
      state.boardCreationBox = action.payload.val;
    },
    workspaceCreationBoxHandle: (state, action) => {
      state.workspaceCreationBox = action.payload.val;
    },
  }
})

export const { boardCreationBoxHandle, workspaceCreationBoxHandle } = creationSlice.actions
export default creationSlice.reducer