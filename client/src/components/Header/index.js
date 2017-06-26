import React from 'react'
import { Link } from 'react-router-dom'
import AccountSelection from '../AccountSelection'

const Header = ({setAccount, fetchAccounts, accounts}) => {
  return (
    <header>
      <div className='ui fixed inverted menu'>
        <div className='ui container'>
          <a href='/' id='header-logo' className='header item'>IDChain</a>
          <div className='item'><Link to='/' className='item'>Home</Link></div>
          <div className='item'><Link to='/certificates' className='item'>Certificates</Link></div>
          <div className='right menu'>
            <div className='item'>
              <AccountSelection
                fetchAccounts={fetchAccounts}
                setAccount={setAccount}
                accounts={accounts.accounts} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
