/* global fetch: false */

const API_ENDPOINT = process.env.REACT_APP_API_URL

// Actions
const FETCH_ACCOUNTS = 'idchain/accounts/FETCH_ACCOUNTS'
const FETCH_ACCOUNTS_SUCCESS = 'idchain/accounts/FETCH_ACCOUNTS_SUCCESS'
const FETCH_ACCOUNTS_FAILURE = 'idchain/accounts/FETCH_ACCOUNTS_FAILURE'
const SET_ACCOUNT = 'idchain/accounts/SET_ACCOUNT'

// Reducer
export default function reducer (state = {
  account: null,
  accounts: [],
  error: null,
  isFetching: false
}, action = {}) {
  switch (action.type) {
    case FETCH_ACCOUNTS:
      return {
        ...state,
        isFetching: true
      }
    case FETCH_ACCOUNTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        accounts: action.response,
        account: action.response[0]
      }
    case FETCH_ACCOUNTS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      }
    case SET_ACCOUNT:
      return {
        ...state,
        account: action.account
      }
    default:
      return state
  }
}

// Action Creators
export function fetchAccounts () {
  return (dispatch) => {
    dispatch({
      type: FETCH_ACCOUNTS
    })

    fetch(`${API_ENDPOINT}/accounts`).then(
      response => { return response.json() }
    ).then(json => {
      dispatch({
        type: FETCH_ACCOUNTS_SUCCESS,
        response: json
      })
    }).catch(
      error => dispatch({
        type: FETCH_ACCOUNTS_FAILURE,
        error
      })
    )
  }
}

export function setAccount (account) {
  return (dispatch, getState) => {
    let state = getState()

    if (state.currentAccount === account) {
      return
    }

    dispatch({
      type: SET_ACCOUNT,
      account
    })
  }
}
