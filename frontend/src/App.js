import React, { useReducer } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { loginApi } from "./mocks";

/* reducer */
const ACTIONS = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  SUBMITTING: 'SUBMITTING',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMIT_ERROR: 'SUBMIT_ERROR',
  RESET: 'RESET',
}

const INITIAL_STATE = {
  values: {
    email: '',
    password: ''
  },
  submitting: false,
  error: null,
  token: null
}

function reducer(state, action) {
  if (action.type === ACTIONS.UPDATE_FIELD) {
    return {
      ...state,
      values: {
        ...state.values,
        [action.field]: action.value,
      }
    };
  } else if (action.type === ACTIONS.SUBMITTING) {
    return {
      ...state,
      submitting: true,
      token: null,
      error: null,
    }
  } else if (action.type === ACTIONS.SUBMIT_SUCCESS) {
    return {
      ...state,
      submitting: false,
      token: action.token,
      error: null
    }
  } else if (action.type === ACTIONS.SUBMIT_ERROR) {
    return {
      ...state,
      submitting: false,
      token: null,
      error: action.error
    }
  } else if (action.type === ACTIONS.RESET) {
    return {
      ...INITIAL_STATE
    }
  } else {
    throw Error('Unknown action.');
  }
}

/* hooks */
const useSubmit = ({ dispatch }) => {
  const submit = async (values = {}) => {
    dispatch({ type: ACTIONS.SUBMITTING })
    try {
      const result = await loginApi(values)
      dispatch({ type: ACTIONS.SUBMIT_SUCCESS, token: result?.token })
      setTimeout(() => dispatch({ type: ACTIONS.RESET }), 5000)
    } catch (err) {
      const error = err?.message ?? "Unknown error. Try again later"
      dispatch({ type: ACTIONS.SUBMIT_ERROR, error })
    }
  }

  return submit;
}

/* component */
function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const submit = useSubmit({ dispatch })
  const { error, submitting, token } = state;

  return (
    <>
      {token && (<Alert variant="success">Login successful! </Alert>)

      }
      <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
      >
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Welcome!</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {error && <Alert variant="danger" >{error}</Alert>}

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                disabled={submitting}
                value={state?.values?.email ?? ""}
                onChange={(event) => dispatch({
                  type: ACTIONS.UPDATE_FIELD,
                  field: "email",
                  value: event.target.value
                })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                disabled={submitting}
                value={state?.values?.password ?? ""}
                onChange={(event) => dispatch({
                  type: ACTIONS.UPDATE_FIELD,
                  field: "password",
                  value: event.target.value
                })}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="primary"
              disabled={submitting}
              onClick={() => submit(state?.values)}
            >
              Sign in
              {submitting && (
                <Spinner
                  style={{ marginLeft: '8px' }}
                  as="span"
                  animation="border"
                  size="sm"
                  variant="light"
                  role="status"
                  aria-hidden="true"
                />
              )}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    </>
  )
}

export default App