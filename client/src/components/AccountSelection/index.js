import React, { Component } from 'react'

import AccountItem from '../AccountItem'

class AccountSelection extends Component {
  componentDidMount () {
    this.props.fetchAccounts()
  }

  handleAccountChange (event) {
    this.props.setAccount(event.target.value)
  }

  render () {
    return (
      <select className='ui selection dropdown' onChange={this.handleAccountChange.bind(this)}>
        {this.props.accounts.map((account, index) => {
          return <AccountItem key={index} account={account} />
        })}
      </select>
    )
  }
}

export default AccountSelection
