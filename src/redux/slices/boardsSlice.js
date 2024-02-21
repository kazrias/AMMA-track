import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  boards: [],
  selectedImg: {
    thumb: '',
    bigImg: '',
  },
}

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addBoard: (state, action) => {
      // state.boards.push({ id: action.payload.id, title: action.payload.title, img: action.payload.img, workspace: action.payload.workspace })
      state.boards.push(action.payload)
    },

    selectBoardImg: (state, action) => {
      state.selectedImg.thumb = action.payload.regular;
      state.selectedImg.bigImg = action.payload.raw;
    },
    deleteBoard: (state, action) => {
      state.boards = state.boards.filter(board => board.id !== action.payload.id)
    },
    editBoard: (state, action) => {
      const boardToChange = state.boards.find(board => board.id === action.payload.id);
      boardToChange.title = action.payload.title

    }
  }
})


export const { addBoard, selectBoardImg, deleteBoard, editBoard } = boardsSlice.actions
export default boardsSlice.reducer