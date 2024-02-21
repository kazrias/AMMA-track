import './BoardsPage.css'

import { useEffect } from 'react'

import { Header } from '../../components/Header/Header'
import { Workspaces } from '../../components/Workspaces/Workspaces'
import { BoardsList } from '../../components/BoardsList/BoardsList'
import { WorkspaceSettings } from '../../components/WorkspaceSettings/WorkspaceSettings'

import { useSelector, useDispatch } from 'react-redux'
import { toggleActiveWorkspace } from '../../redux/slices/workspacesSlice'


const BoardsPage = () => {
  const activeWorkspaceId = useSelector(state => state.workspaces.workspaces.find(workspace => workspace.active));
  const settings = useSelector(state => state.workspaces.settingsOpened);
  const workspaces = useSelector((state) => state.workspaces.workspaces)
  const dispatch = useDispatch()
  useEffect(() => {
    const activeWorkspaceId = localStorage.getItem('activeWorkspaceId')
    dispatch(toggleActiveWorkspace({ id: activeWorkspaceId }))
  }, [workspaces.length])
  return (
    <>
      <Header />
      <div className="container container--boardsPage">
        <Workspaces />
        {activeWorkspaceId && < BoardsList />}
      </div>
      {settings && <WorkspaceSettings />}
    </>

  )
}

export default BoardsPage


