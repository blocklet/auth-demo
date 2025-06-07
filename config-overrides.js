const path = require('path')
const webpack = require('webpack')

module.exports = {
  webpack: (config) => {
    if (!config.resolve) {
      config.resolve = {}
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {}
    }

    // 支持搜索 node_modules 目录
    if (!config.resolve.modules) {
      config.resolve.modules = ['node_modules']
    }

    // 添加对 @fontsource 的别名解析
    config.resolve.alias['@fontsource/lexend'] = path.resolve(__dirname, 'node_modules/@fontsource/lexend')

    // 添加 Node.js 核心模块的 polyfill
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      vm: require.resolve('vm-browserify'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      fs: false,
      net: false,
      tls: false,
    }

    // 添加 polyfill 插件
    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ]

    // 找到 Webpack 中的 oneOf 条件规则（CRA 的核心结构）
    const oneOfRule = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf

    // 修改 CRA 默认规则中的 .js/.mjs loader，关闭 fullySpecified
    oneOfRule.forEach((rule) => {
      if (rule.test && rule.test.toString().includes('mjs') && rule.resolve === undefined) {
        rule.resolve = {
          fullySpecified: false,
        }
      }
    })

    return config
  },
  jest: (config) => {
    const setupFile = path.join(__dirname, './tools/jest-setup.js')
    if (Array.isArray(config.setupFiles)) {
      config.setupFiles.push(setupFile)
    } else {
      config.setupFiles = [setupFile]
    }

    return config
  },
}
