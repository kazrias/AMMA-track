import './CreateBox.css'

import { useEffect, useState } from 'react'

import { MAX_COUNT } from '../../constants/boards'

import { Button } from '../Button/Button'
import { ImgWrapper } from './ImgWrapper/ImgWrapper'

import { useDispatch, useSelector } from 'react-redux'
import { addBoard, selectBoardImg } from '../../redux/slices/boardsSlice'
import { addWorkspace, selectWorkspaceImg, remainingDecr } from
  '../../redux/slices/workspacesSlice'

import { unsplash } from '../../lib/unsplash'

import { db } from '../../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export const CreateBox = ({  type, handleBox }) => {
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([])
  const selectedWorkspaceImg = useSelector((state) => state.workspaces.selectedImg.thumb)
  const selectedBoardImg = useSelector(state => state.boards.selectedImg)
  const activeWorkspace = useSelector(state => state.workspaces.workspaces.find(workspace => workspace.active))
  const currentUser = useSelector((state) => state.auth.loggedUser)
  const dispatch = useDispatch();

  const handleAddClick = async () => {
    switch (type) {
      case 'workspace':
        const workspaceId = new Date().toISOString()
        const newWorkspace = {
          id: workspaceId,
          title,
          img: {
            thumb: selectedWorkspaceImg,
          },
          user: currentUser,
          active: true,
          status: 'Free',
          count: MAX_COUNT,
        };
        if (selectedWorkspaceImg) {
          dispatch(addWorkspace(newWorkspace));
          dispatch(handleBox({ val: false }));
          setTitle('');

          dispatch(selectWorkspaceImg({ thumb: '' }))
        }
        const workspacesCollection = collection(db, 'workspaces')
        await addDoc(workspacesCollection, { id: workspaceId, 
          title, 
          img: { thumb: selectedWorkspaceImg }, 
          user: currentUser, 
          status: 'Free',
          count: MAX_COUNT,
        })
        return
      case 'board':
        const boardId = new Date().toISOString()
        const newBoard = {
          id: boardId,
          title,
          img: selectedBoardImg,
          workspace: activeWorkspace,
        };
        if (selectedBoardImg) {
          dispatch(addBoard(newBoard));
          dispatch(handleBox({ val: false }));
          dispatch(remainingDecr({ id: activeWorkspace.id }))
          setTitle('');
          dispatch(selectBoardImg({ regular: '', raw: '' }))
        }
        const boardsCollection = collection(db, 'boards')
        await addDoc(boardsCollection, { id: boardId, title, img: selectedBoardImg, workspace: activeWorkspace, })


        return
    }

  }
  const handleEnter = async event => {
    if (event.key === 'Enter') {
      switch (type) {
        case 'workspace':
          const workspaceId = new Date().toISOString()
          const newWorkspace = {
            id: workspaceId,
            title,
            img: {
              thumb: selectedWorkspaceImg,
            },
            user: currentUser,
            active: true,
            status: 'Free',
            count: MAX_COUNT,
          };
          if (selectedWorkspaceImg) {
            dispatch(addWorkspace(newWorkspace));
            dispatch(handleBox({ val: false }));

            setTitle('');
            dispatch(selectWorkspaceImg({ thumb: '' }))
          }
          const workspacesCollection = collection(db, 'workspaces')
          await addDoc(workspacesCollection, { id: workspaceId, 
            title, 
            img: { thumb: selectedWorkspaceImg }, 
            user: currentUser, 
            status: 'Free',
            count: MAX_COUNT,
          })
          return
        case 'board':
          const boardId = new Date().toISOString()
          const newBoard = {
            id: boardId,
            title,
            img: selectedBoardImg,
            workspace: activeWorkspace,
          };
          if (selectedBoardImg) {
            dispatch(addBoard(newBoard));
            dispatch(handleBox({ val: false }));
            setTitle('');
            dispatch(selectBoardImg({ regular: '', raw: '' }))
            dispatch(remainingDecr({ id: activeWorkspace.id }))
          }
          const boardsCollection = collection(db, 'boards')
          await addDoc(boardsCollection, { id: boardId, title, img: selectedBoardImg, workspace: activeWorkspace, })
          return
      }
    }
  };
  const handleClose = () => {
    dispatch(selectWorkspaceImg({ thumb: '' }))
    dispatch(selectBoardImg({ regular: '', raw: '' }))
    dispatch(handleBox({ val: false }))
  }
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        })
        if (result && result.response) {
          const newImages = result.response;
          setImages(newImages)
        }
        else {
          console.log('Failed to get images from unsplash')
        }
      }
      catch (err) {
        console.log(err);
        setImages([])
      }
    }

    fetchImages()
  }, [])

  return (
    <div className={`create-box ${type}`}>
      <p className='create-box__type'>Create {type}</p>
      <div onClick={handleClose} className="create-box__btn"><Button>X</Button></div>
      <div className='create-box__images'>
        {
          images.map(img => {
            return (
              <ImgWrapper type={type} key={img.id} urls={img?.urls} />
            )
          })
        }
      </div>
      <div className="create-box__info">
        <p className='create-box__title'><span>{type}</span> title</p>
        <label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={handleEnter} />
          <Button disabled={!(selectedWorkspaceImg || selectedBoardImg.thumb)} type={'secondary'} onClick={handleAddClick} >Add {type}</Button>
        </label>
      </div>
    </div>
  )
}
