module.exports = {
    runtimeCompiler: true,
    publicPath: './',  //输出的根路径  默认是/ 如果你的网站是app.com/vue 这更改此配置项
    devServer: {
        //端口
        port: 8000,
        //代理
        proxy: {
            "API": {
                target: "http://localhost:8080",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "API": "/"
                }
            }
        }
    }
};
