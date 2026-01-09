const { createProxyMiddleware } = require('http-proxy-middleware');

const createServiceProxy = (serviceName, target) => {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: (path) => path,
        onError(err, req, res) {
            console.error(`[${serviceName}] Proxy error:`, err.message);
            res.status(503).json({
                success: false,
                message: `${serviceName} service unavailable`,
            });
        },
    });
};

module.exports = { createServiceProxy };
