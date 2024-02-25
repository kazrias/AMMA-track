import './BoardsList.css'

import { useEffect, useState } from 'react'

import { CreateBox } from '../CreateBox/CreateBox'
import { BoardItem } from '../BoardItem/BoardItem'
import { boardCreationBoxHandle } from '../../redux/slices/creationBoxSlice'

import person from '../../images/person-svgrepo-com.svg'
import freeCard from '../../images/free-credit-card.png'
import proCard from '../../images/credit-card_pro.png'

import { useSelector, useDispatch } from 'react-redux'
import { addBoard } from '../../redux/slices/boardsSlice'
import { changeCount } from '../../redux/slices/workspacesSlice'

import { db } from '../../config/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'



export const BoardsList = () => {
  const dispatch = useDispatch()

  const logged = useSelector(state => state.auth.loggedUser)
  const activeWorkspace = useSelector(state => state.workspaces.workspaces.find(workspace => workspace.active && workspace.user.id === logged.id))
  const boards = useSelector(state => state.boards.boards)
  const boardsToShow = activeWorkspace ? boards.filter(board => board.workspace.id === activeWorkspace.id && logged.id === activeWorkspace.user.id) : []

  const limit = activeWorkspace?.status === 'Free';
  const create = useSelector(state => state.creation.boardCreationBox)
  const [showError, setShowError] = useState(false)
  useEffect(() => {
    const fetchBoards = async () => {
      const boardsCollection = collection(db, 'boards')
      const snapshot = await getDocs(boardsCollection)
      snapshot.docs.map((doc) => (dispatch(addBoard({ ...doc.data() }))))
    }
    if (!boards.length) fetchBoards()
  }, [boards.length, dispatch])
  useEffect(() => {
    if (activeWorkspace?.count === 7)
      dispatch(changeCount({ count: boardsToShow.length, id: activeWorkspace.id }))
  }, [boardsToShow.length])
  const onClickCreate = () => {
    if (activeWorkspace.count > 0 || !limit)
      dispatch(boardCreationBoxHandle({ val: true }))
    else {
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 2800)
    }
  }
  return (
    <>
      {activeWorkspace && <div className="boardsList">
        <div className="workspace-box">
          <img src={activeWorkspace.img.thumb} alt="workspace img" />
          <div className="workspace-box__text-info">
            <p>{activeWorkspace.title}</p>
            <p className='workspace-status'>
              <img className={`${activeWorkspace.status === 'Pro' ? 'workspace-status__img--pro' : 'workspace-status__img--free'} workspace-status__img`} src={activeWorkspace.status === 'Free' ? freeCard : proCard} alt="" />
              <span>{activeWorkspace.status}</span>
            </p>
          </div>
        </div>
        <div className='boardsList-text'>
          <img src={person} alt="person" />
          <p>Your boards</p>
        </div>
        <div className="boardsList-items">
          {boardsToShow.map(item => <BoardItem key={item.id} {...item} />)}
          <div className="boardsList-items__create-wrapper">
            <div onClick={onClickCreate} className='boardsList-items__create'>
              <p>Create new board</p>
              {limit && <p className='boardsList-items__create--limit'>{showError ? <p className='boardList-items__create--error'>Activate Pro status in settings if u need more</p> : `${activeWorkspace.count} remaining`}</p>}
            </div>
            {create && <CreateBox handleBox={boardCreationBoxHandle} type={'board'} />}
          </div>
        </div>
      </div>}
    </>
  )
}