/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://upscakhada.com', // apna domain
    generateRobotsTxt: true,           // robots.txt bhi banega
    sitemapSize: 7000,
    changefreq: 'daily',
    priority: 0.7,

    exclude: [
        '/api/*',
        '/admin/*',
        '/auth/*',
        '/dashboard/*',
    ],
};