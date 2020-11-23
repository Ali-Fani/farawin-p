const status={
    0:"success",
    1:"failure",
}
module.exports = function (statusCode,message) { 
    if(!message)
    {
        return {status:status[statusCode]}
    }
    else
    {
        return {status:status[statusCode],message}
    }
};