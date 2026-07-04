const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    // Mongoose Validation Error check
    if (err.name === 'ValidationError' || err.message.includes('validation failed')) {
        // Fallback array if err.errors doesn't exist out of the box
        const messages = err.errors 
            ? Object.values(err.errors).map(val => val.message)
            : [err.message];

        return res.status(400).json({
            success: false,
            error: messages
        });
    }

    // Mongoose bad ObjectId format error
    if (err.name === 'CastError') {
        return res.status(404).json({ success: false, error: `Resource not found` });
    }

    // Fallback Server Error
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
};

module.exports = errorHandler;