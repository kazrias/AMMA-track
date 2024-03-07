//css
import './Workspaces.css'
//react hooks
import { useEffect, useRef } from 'react'
//constants

//components
import { workspaceCreationBoxHandle } from '../../redux/slices/creationBoxSlice'
import { addWorkspace, toggleActiveWorkspace } from '../../redux/slices/workspacesSlice'
import { Button } from '../Button/Button'
import { WorkspacesItem } from '../WorkspacesItem/WorkspacesItem'
import { CreateBox } from '../CreateBox/CreateBox'
//imgs

//helpers

//redux
import { useDispatch, useSelector } from 'react-redux'
//libraries
import { useNavigate } from "react-router-dom";
//database
import { db } from '../../config/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

export const Workspaces = ({ workspacesClicked, setWorkspacesClicked }) => {
  const create = useSelector((state) => state.creation.workspaceCreationBox)
  const currentUser = useSelector((state) => state.auth.loggedUser)
  const workspaces = useSelector((state) => state.workspaces.workspaces)
  const workspacesToShow = workspaces && workspaces.filter(workspace => workspace?.user?.id === currentUser.id)

  const dispatch = useDispatch()
  const loggedIn = window.localStorage.getItem("isLoggedIn")
  const navigate = useNavigate();

  useEffect(() => {
    const activeWorkspaceId = localStorage.getItem('activeWorkspaceId');
    if (workspacesToShow.find(({ id }) => id === activeWorkspaceId))
      dispatch(toggleActiveWorkspace({ id: activeWorkspaceId }))
  }, [dispatch, workspacesToShow.length])
  useEffect(() => {
    if (loggedIn && loggedIn === "OFF") {
      navigate("/");
    }
  }, [loggedIn, navigate]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const workspacesCollection = collection(db, 'workspaces')
      const snapshot = await getDocs(workspacesCollection)
      snapshot.docs.reverse().map((doc) => (dispatch(addWorkspace({ ...doc.data() }))))

    }
    if (!workspaces.length) fetchWorkspaces()
  }, [workspaces.length, dispatch])

  const workspacesRef = useRef(null)
  useEffect(() => {

    const handleClickOutside = (event) => {
      console.log(event.target);
      if (workspacesRef.current && !workspacesRef.current.contains(event.target) && !event.target.classList.contains('Workspaces-button ') &&
        !event.target.closest('.Workspaces-button') && !event.target.classList.contains('settings-container') &&
        !event.target.closest('.settings-container')) {
        setWorkspacesClicked(false)
      }
    };
    console.log(workspacesClicked);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };

  }, [dispatch]);
  return (
    <div ref={workspacesRef} className={`workspaces ${workspacesClicked ? 'clicked' : ''}`}>
      <div className="workspaces-title">
        <h4>Workspaces</h4>
        <Button onClick={() => dispatch(workspaceCreationBoxHandle({ val: true }))} type="main">+</Button>
        {create && <CreateBox handleBox={workspaceCreationBoxHandle} type={'workspace'} />}
      </div>
      {
        workspacesToShow.map((workspace) => {
          return (
            <WorkspacesItem key={workspace.id} {...workspace} />
          )
        })
      }
      {

      }
    </div>


  )
}