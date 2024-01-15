const UrlPattern = require('url-pattern')
const { SuccessResponse, ResourceNotFoundResponse, ErrorResponse, ErrorMappings } = require('../../../utils/response')

const ACTION = require('./constants')
const ROUTES = require('./routes')

const customerHandler = require('./handlers/customers').handler

const handler = async (event) => {
    try {
        const { path } = event

        const routes = Object.values(ROUTES)
        const patternIndex = routes.findIndex((route) => {
          const pattern = new UrlPattern(route, {
            segmentValueCharset: 'a-zA-Z0-9*'
          })
          const result = pattern.match(path)
          return result != null
        })
    
        if (patternIndex < 0) {
          return ResourceNotFoundResponse({
            message: ErrorMappings.INVALID_PATH,
            input: event?.path
          })
        }

        const actions = Object.keys(ROUTES)
        const eventAction = actions[patternIndex]
        const eventRoute = routes[patternIndex]

        switch (eventAction) {
            case ACTION.CUSTOMER:
              return customerHandler(event, eventRoute)
            default:
                return ResourceNotFoundResponse({
                    message: ErrorMappings.INVALID_PATH,
                    input: event?.path
                  })
          }

    } catch (error) {
        return ErrorResponse(error)
    }
}

module.exports = {
    handler
}