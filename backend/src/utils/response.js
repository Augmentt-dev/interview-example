const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*'
  }
  
  const lambdaResponse = ({ json, statusCode }) => {
    const response = {
      statusCode,
      body: JSON.stringify(json)
    }
  
    response.headers = HEADERS
  
    return response
  }
  
  const ResetContentResponse = (json) => {
    return lambdaResponse({
      json: json || { data: [] },
      statusCode: 200
    })
  }
  
  const SuccessResponse = (json) => {
    return lambdaResponse({
      json,
      statusCode: 200
    })
  }
  
  const CreatedResponse = (json) => {
    return lambdaResponse({
      json,
      statusCode: 201
    })
  }
  
  const ResourceNotFoundResponse = (json) => {
    return lambdaResponse({
      json,
      statusCode: 404
    })
  }
  
  /**
   *
   * @param {string} json - public an error message
   * @param {string} log - private an error message (optional)
   * @returns lambdaResponse
   */
  const InvalidResponse = (json, log) => {
    console.log('Invalid Response!', json)
    if (log) {
      console.log(log)
    }
    return lambdaResponse({
      json,
      statusCode: 400
    })
  }
  
  // use this object in place of copied string errors
  const ErrorMappings = {
    NOT_FOUND: 'Resource Not Found!',
    INVALID_PATH: 'The requested API endpoint is invalid. Please input the correct URL!',
    MALFORMED_PARAM: 'Parameters invalid!',
    MALFORMED_BODY: 'Body is invalid!',
    CANNOT_HANDLE: 'We can not handle your request!',
    EXISTS: 'Resource already exists',
    MISSING_AUTH: 'No authorization header found',
    UNAUTHORIZED: 'You are not authorized to access this resource!',
    UNKNOWN: 'Unknown Error',
  }
  
  const ErrorResponse = (err, log) => {
    let message = ''
    if (err.message) {
      message = err.message
    }
    if (err.original && err.original.message) {
      message = err.original.message
    }
    if (err.meta && err.meta.body && err.meta.body.error) {
      message = JSON.stringify(err.meta.body.error)
    }
    if (err.error) {
      err.name = 'generic'
      message = err.error
    }
    return InvalidResponse({
      error: err.name,
      message
    }, log)
  }
  
  const AuthDeniedResponse = (json) => {
    return lambdaResponse({
      json,
      statusCode: 403
    })
  }
  
  module.exports = {
    SuccessResponse,
    ResourceNotFoundResponse,
    InvalidResponse,
    ErrorResponse,
    AuthDeniedResponse,
    ResetContentResponse,
    CreatedResponse,
    ErrorMappings
  }
  