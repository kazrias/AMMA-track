import './BoardsPage.css'

import { useState } from 'react'

import { Header } from '../../components/Header/Header'
import { Workspaces } from '../../components/Workspaces/Workspaces'
import { BoardsList } from '../../components/BoardsList/BoardsList'
import { WorkspaceSettings } from '../../components/WorkspaceSettings/WorkspaceSettings'

import workspaces from '../../images/workspaces.svg'

import { useSelector } from 'react-redux'

const BoardsPage = () => {
  const activeWorkspaceId = useSelector(state => state.workspaces.workspaces.find(workspace => workspace.active));
  const settings = useSelector(state => state.workspaces.settingsOpened);
  const [workspacesClicked, setWorkspacesClicked] = useState(false)
  return (
    <>
      <Header />
      <div className="container container--boardsPage">
        <Workspaces workspacesClicked={workspacesClicked} setWorkspacesClicked={setWorkspacesClicked} />
        {activeWorkspaceId && < BoardsList />}
      </div>
      {settings && <WorkspaceSettings />}
      <button onClick={() => setWorkspacesClicked(true)} className='Workspaces-button'><img src={workspaces} alt="" />Workspaces </button>
    </>

  )
}

export default BoardsPage


