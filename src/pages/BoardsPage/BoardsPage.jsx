import './BoardsPage.css'

import { Header } from '../../components/Header/Header'
import { Workspaces } from '../../components/Workspaces/Workspaces'
import { BoardsList } from '../../components/BoardsList/BoardsList'
import { WorkspaceSettings } from '../../components/WorkspaceSettings/WorkspaceSettings'

import { useSelector} from 'react-redux'

const BoardsPage = () => {
  const activeWorkspaceId = useSelector(state => state.workspaces.workspaces.find(workspace => workspace.active));
  const settings = useSelector(state => state.workspaces.settingsOpened);
  
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


