import './WorkspaceSettings.css'

import { useState, useEffect, useRef } from 'react'

import { SettingsContent } from './SettingsContent/SettingsContent';

import { useDispatch } from 'react-redux';
import { closeSettings } from '../../redux/slices/workspacesSlice';

export const WorkspaceSettings = () => {
  const [currentSetting, setCurrentSetting] = useState('title');
  const dispatch = useDispatch();
  const settingsRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target) && event.target.textContent !== 'Settings') {
        dispatch(closeSettings())
        console.log('aaa');

      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dispatch]);
  return (
    <div ref={settingsRef} className="settings-container">
      <div className="settings-wrapper">
        <nav className="settings-nav">
          <ul className="settings-list">
            <li className={`settings-list__item ${currentSetting === 'title' ? 'active' : ''}`} onClick={() => setCurrentSetting('title')}>Title</li>
            <li className={`settings-list__item ${currentSetting === 'icon' ? 'active' : ''}`} onClick={() => setCurrentSetting('icon')}>Icon</li>
            <li className={`settings-list__item ${currentSetting === 'members' ? 'active' : ''}`} onClick={() => setCurrentSetting('members')}>Members</li>
            <li className={`settings-list__item ${currentSetting === 'status' ? 'active' : ''}`} onClick={() => setCurrentSetting('status')}>Status</li>
            <li className={`settings-list__item ${currentSetting === 'delete' ? 'active' : ''}`} onClick={() => setCurrentSetting('delete')}>Delete</li>
          </ul>
        </nav>
        <SettingsContent type={currentSetting} />
      </div>
    </div>
  )
}
