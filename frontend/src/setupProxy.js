import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://hrms-management-system-2.onrender.com', // Change this to your backend URL
            changeOrigin: true,
        })
    );
};
