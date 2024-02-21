import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../slices/authenticationSlice'
import workspacesReducer from '../slices/workspacesSlice'
import boardsReducer from '../slices/boardsSlice'
import creationReducer from '../slices/creationBoxSlice'
import todosReducer from '../slices/todosSlice'
import cardsReducer from '../slices/cardsSlice'
import cardModalReducer from '../slices/cardModalSlice'


const store = configureStore({
  reducer: {
    auth: authReducer,
    workspaces: workspacesReducer,
    boards: boardsReducer,
    creation: creationReducer,
    todos:todosReducer,
    cards: cardsReducer,
    cardModal: cardModalReducer,
  }
});

export default store;