import './Info.css'

import { Button } from '../Button/Button'

import { Link } from 'react-router-dom'


export const Info = () => {
  return (
    <div className='info'>
      <div className="container">
        <div className="info-wrapper">
          <div className="info-title">
            best task managment app
          </div>
          <p className='info-text'>AMMA-Track helps team move</p>
          <p className='info-text info-text--gradient'>work forward.</p>
          <p className='info-main'>
            Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique - accomplish it all with AMMA-Track!
          </p>
          <Button>
            <Link to='/sign-up'> Get AMMA-Track for free</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}