const createError = require("http-errors");
const middy = require('./middy');
const { deleteEvent, addUpdateEvent, getEvents, saveGoogleAuth } = require('../services/calendar');

exports.saveGoogleAuth = middy(async (req) => {
  try {
    return await saveGoogleAuth(req.body.code, req.user.sub);
  } catch (e) {
    throw new createError.InternalServerError(e.message);
  }
});

exports.addUpdateEvent = middy(async (req) => {
  try {
    return await addUpdateEvent(req.user.sub, req.body.sub, req.body);
  } catch (e) {
    throw new createError.InternalServerError(e.message);
  }
});

exports.getEvents = middy(async  (req) => {
  try {
    return await getEvents(req.query.sub);
  } catch (e) {
    throw new createError.InternalServerError(e.message);
  }
});

exports.deleteEvent = middy(async (req) => {
  try {
    return await deleteEvent(req.params.sub, req.params.eventId);
  } catch (e) {
    throw new createError.InternalServerError(e.message);
  }
});
