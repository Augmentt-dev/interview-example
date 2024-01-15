const UrlPattern = require('url-pattern')

const {
    SuccessResponse,
    ErrorResponse,
    ErrorMappings
  } = require('../../../../utils/response')

  const {
    getCustomerData
  } = require('../../../../utils/customer')

const handler = async (event, eventRoute) => {
    try {
        const { path, httpMethod } = event

        const pattern = new UrlPattern(eventRoute, {
            segmentValueCharset: '0-9*'
          })
          const endpointInfo = pattern.match(path)
          const { customerId } = endpointInfo

          const response = await getCustomerData(customerId)
          return SuccessResponse(response)
    } catch (error) {
        return ErrorResponse(error)
    }
}

module.exports = {
    handler
}