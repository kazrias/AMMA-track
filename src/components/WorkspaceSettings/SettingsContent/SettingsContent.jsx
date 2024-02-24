
import { useState, useEffect } from "react";

import { WORKSPACE_PRICE } from '../../../constants/workspacePrice'
import { MAX_COUNT } from "../../../constants/boards";

import { useSelector, useDispatch } from "react-redux"
import { changeTitle, changeIcon, deleteWorkspace, closeSettings, activateProStatus } from "../../../redux/slices/workspacesSlice"

import { unsplash } from "../../../lib/unsplash";

import { db } from "../../../config/firebaseConfig"
import { collection, updateDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'

export const SettingsContent = ({ type }) => {

  const activeWorkspace = useSelector(state => state.workspaces.workspaces.find(workspace => workspace.active))
  const [newTitle, setNewTitle] = useState(activeWorkspace.title)
  const [pass, setPass] = useState('')
  const [imgList, setImgList] = useState([])
  const [selectedImg, setSelectedImg] = useState({ thumb: '', id: '' })
  const [passIsCorrect, setPassIsCorrect] = useState(true)
  const workspacesCollection = collection(db, 'workspaces')
  const dispatch = useDispatch()
  const loggedUs = useSelector(state => state.auth.loggedUser)

  const changeWorkspaceData = async (data) => {
    const snapshot = await getDocs(workspacesCollection)
    for (let workspaceDoc of snapshot.docs.filter(doc => doc.data().id === activeWorkspace.id)) {
      if (workspaceDoc.id) {
        await updateDoc(doc(db, 'workspaces', workspaceDoc.id), {
          ...workspaceDoc.data(),
          ...data,
        })
      }
    }
  }

  const titleChangeSubmit = async (e) => {
    e.preventDefault();
    dispatch(changeTitle({ id: activeWorkspace.id, newTitle }))
    changeWorkspaceData({ title: newTitle })
  }

  const iconChange = () => {
    dispatch(changeIcon({ id: activeWorkspace.id, thumb: selectedImg.thumb }))
    setSelectedImg({ thumb: '', id: '' });
    changeWorkspaceData({ img: { thumb: selectedImg.thumb } })
  }

  const onDeleteWorkspace = async (e) => {
    e.preventDefault()
    if (pass === loggedUs.password) {
      dispatch(deleteWorkspace({ id: activeWorkspace.id }))
      dispatch(closeSettings())
      setPassIsCorrect(true);
      const snapshot = await getDocs(workspacesCollection)
      for (let workspaceDoc of snapshot.docs.filter(doc => doc.data().id === activeWorkspace.id)) {
        if (workspaceDoc.id) {
          await deleteDoc(doc(db, 'workspaces', workspaceDoc.id))
        }
      }
    }
    else {
      setPassIsCorrect(false)
    }
  }

  const onStatusBuy = async () => {
    dispatch(activateProStatus({ id: activeWorkspace.id }))
    changeWorkspaceData({ status: 'Pro' })
  }

  const closeSettingBox = () => {
    setSelectedImg({ thumb: '', id: '' });
    dispatch(closeSettings())
    setNewTitle('')
  }
  useEffect(() => {
    setSelectedImg({ thumb: '', id: '' });
  }, [type])
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        })
        if (result && result.response) {
          const newImages = result.response;
          setImgList(newImages)
        }
        else {
          console.log('Failed to get images from unsplash')
        }
      }
      catch (err) {
        console.log(err);
        setImgList([])
      }
    }
    fetchImages()
  }, [])
  return (
    <div className="settings-content">
      <button onClick={closeSettingBox} className="setting-close"><span>+</span></button>
      {
        (() => {
          switch (type) {
            case 'title': {
              return (
                <div className="settings-title">
                  <p className="settings-title__text">Current title of workspace: <strong>{activeWorkspace?.title}</strong></p>
                  <p className="settings-title__text">Want to change it? Write new title below and save.</p>
                  <form onSubmit={(e) => titleChangeSubmit(e)}>
                    <label className="setting-title__input">New Title
                      <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                      <button type="submit">Save</button>
                    </label>
                  </form>
                </div>
              )
            }
            case 'icon': {
              return (
                <div className="settings-icon">
                  <p className="settings-title__text">Don't like workspace's icon? Just choose new one!</p>
                  <p className="settings-title__text">Here is some variants.</p>
                  <div className="icons-box">
                    {
                      imgList.map(img => {
                        return (<div key={img.id} onClick={() => setSelectedImg({ thumb: img?.urls.thumb, id: img?.id })} className={`icons-box__wrapper ${selectedImg.id === img?.id ? "active" : ''}`}>
                          <img src={img?.urls.thumb} />
                        </div>)
                      })
                    }
                  </div>
                  <button onClick={iconChange}>Save</button>
                </div>
              )
            }
            case 'members': {
              return (
                <div className="settings-icon">
                  <p className="settings-title__text">We're working on this future.</p>
                  <p className="settings-title__text">It will give you the opportunity to share this workspace with your colleagues and work together. </p>
                </div>
              )
            }
            case 'status': {
              return (
                <div className="settings-icon">
                  <p className="settings-title__text">Your current status is: <strong>{activeWorkspace.status}</strong></p>
                  {activeWorkspace.status === 'Pro' ? <p className="settings-title__text">
                    This status gives you the ability to create more and an infinite number of boards. In the future you also will be able to add members to this workspaces.
                  </p> : <>
                    <p className="settings-title__text">This status allows you to create <strong>{MAX_COUNT}</strong> boards. If this quantity does not suit you, you can activate the pro status.In the future you also will be able to add members to this workspaces.</p>
                    <p className="settings-title__text">Cost of <strong>Pro</strong> status is  {WORKSPACE_PRICE}.</p>
                    <button onClick={onStatusBuy}>Buy it</button>
                  </>}
                </div>
              )
            }
            case 'delete': {
              return (
                <div className="settings-icon">
                  <p className="settings-title__text">Before deleting <strong>{activeWorkspace.title}</strong> workspace, make sure you really need it.</p>
                  <p className="settings-title__text --delete">Workspaces cannot be restored.</p>
                  <form onSubmit={onDeleteWorkspace}>
                    <label className="setting-title__input">Input your password
                      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
                    </label>
                  </form>
                  {!passIsCorrect && <p>Wrong password, try again.</p>}
                  <button className="btn-delete" onClick={onDeleteWorkspace}>Delete</button>
                </div>
              )
            }
          }
        })()
      }
    </div>
  )
}
