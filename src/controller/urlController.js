const {
  errorResponse,
  succesResponse,
} = require('../utils/response_formatter');
const { UrlService } = require('../services');
const { loggerConfig } = require('../config');
const { StatusCodes } = require('http-status-codes');

const createRestApi = (req, res) => {
  try {
    const {orginalUrl} = req.body
    if(!orginalUrl || typeof orginalUrl !== 'string'){
        return res.status(StatusCodes.BAD_REQUEST).json({
            error:"Valid Orginal Url required"
        });
    }
    const shortCode = await UrlService.UrlShortner.createShortUrl(orginalUrl)
    loggerConfig.info(`successfully send the the short ode to service layer`)
    return res.status(StatusCodes.ACCEPTED).json({...succesResponse,message:'sucessfully send the data',data:shortCode})
  } catch (error) {
    loggerConfig.error(`error occured while restAPI : ${error}`);
    return res.status(StatusCodes.BAD_REQUEST).json({
      ...errorResponse,
      message: error.message || 'something went wrong',
      error: {
        statusCode: StatusCodes.BAD_REQUEST,
        message: error.message || 'Something went wrong',
        info: error.info || error.message || '',
      },
    });
  }
};
module.exports = {
    createRestApi,
}