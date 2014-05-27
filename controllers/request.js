var RequestController = function(err, req, res, next)
{
    //define template vars for local in request
    /*res.locals.isGranted = req.isAuthenticated();
    res.locals.appUser = req.user;*/
    return next();
};

module.exports = RequestController;