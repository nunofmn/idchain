/* global fetch: false, Headers */

const API_ENDPOINT = process.env.REACT_APP_API_URL
console.log('ENDPOINT: ', API_ENDPOINT)

const FETCH_CERTIFICATES_ENTITY = 'idchain/certificates/FETCH_CERTIFICATES_ENTITY'
const FETCH_CERTIFICATES_ENTITY_SUCCESS = 'idchain/certificates/FETCH_CERTIFICATES_ENTITY_SUCCESS'
const FETCH_CERTIFICATES_ENTITY_FAILURE = 'idchain/certificates/FETCH_CERTIFICATES_ENTITY_FAILURE'

const CREATE_CERTIFICATE = 'idchain/certificates/CREATE_CERTIFICATE'
const CREATE_CERTIFICATE_SUCCESS = 'idchain/certificates/CREATE_CERTIFICATE_SUCCESS'
const CREATE_CERTIFICATE_FAILURE = 'idchain/certificates/CREATE_CERTIFICATE_FAILURE'

// Reducer
const initialState = {
  certificatesList: {
    certificates: [],
    error: null,
    isFetching: false
  },
  newCertificate: {
    certificate: null,
    error: null,
    isCreating: false
  }
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case FETCH_CERTIFICATES_ENTITY:
      return {
        ...state,
        certificatesList: {
          ...state.certificatesList,
          isFetching: true
        }
      }
    case FETCH_CERTIFICATES_ENTITY_SUCCESS:
      return {
        ...state,
        certificatesList: {
          ...state.certificatesList,
          certificates: action.response,
          isFetching: false
        }
      }
    case FETCH_CERTIFICATES_ENTITY_FAILURE:
      return {
        ...state,
        certificatesList: {
          ...state.certificatesList,
          error: action.error,
          isFetching: false
        }
      }
    case CREATE_CERTIFICATE:
      return {
        ...state,
        newCertificate: {
          ...state.newCertificate,
          isCreating: true
        }
      }
    case CREATE_CERTIFICATE_SUCCESS:
      return {
        ...state,
        newCertificate: {
          ...state.newCertificate,
          certificate: action.certificate,
          isCreating: false
        }
      }
    case CREATE_CERTIFICATE_FAILURE:
      return {
        ...state,
        newCertificate: {
          ...state.newCertificate,
          error: action.error,
          isCreating: false
        }
      }
    default:
      return state
  }
}

// Action Creators
export function fetchCertificatesByEntity (entity) {
  return (dispatch) => {
    dispatch({
      type: FETCH_CERTIFICATES_ENTITY
    })

    fetch(`${API_ENDPOINT}/entity/${entity}/certificates`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        dispatch({
          type: FETCH_CERTIFICATES_ENTITY_SUCCESS,
          response: json
        })
      })
      .catch(error => {
        dispatch({
          type: FETCH_CERTIFICATES_ENTITY_FAILURE,
          error
        })
      })
  }
}

export function createCertificate (certificate) {
  return (dispatch, getState) => {
    const state = getState()
    const currentAccount = state.accounts.account

    dispatch({
      type: CREATE_CERTIFICATE
    })

    const headers = new Headers()
    headers.append('eth-account', currentAccount)

    fetch(`${API_ENDPOINT}/certificate`, {
      headers,
      mode: 'cors',
      method: 'post',
      body: JSON.stringify(certificate)
    })
      .then(response => {
        if (response.ok) {
          dispatch({
            type: CREATE_CERTIFICATE_SUCCESS,
            certificate
          })
        } else {
          dispatch({
            type: CREATE_CERTIFICATE_FAILURE,
            error: 'Erro create certficate.'
          })
        }
      })
      .catch(error => {
        dispatch({
          type: CREATE_CERTIFICATE_FAILURE,
          error
        })
      })
  }
}
