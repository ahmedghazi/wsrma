var RequestController = function(err, req, res, next)
{
    //code here some middle ware to modify the requ or response
    return next();
};

module.exports = RequestController;