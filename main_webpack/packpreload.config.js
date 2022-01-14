const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
function strIsInArr(str, arr) {
  for (let i = arr.length; i--; ) {
    if (str.indexOf(arr[i]) !== -1) {
      return true
    }
  }
  return false
}

const map = {}
const abr = [
  'superagent',
  'express',
  'types',
  'react',
  'antd',
  'electron',
  'webpack',
  'babel',
]

function getConfig({ dependencies = [], notDependencies = [], entry, output }) {
  return merge(
    {
      module: {
        rules: [
          // C++模块 .node文件处理
          {
            test: /\.node$/,
            exclude: /node_modules/,
            use: 'native-ext-loader', // node-loader处理.node文件，用于处理C++模块
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.node'],
        alias: {
          '~native': path.resolve(__dirname, 'native'), // 别名，方便import
          '~resources': path.resolve(__dirname, 'resources'), // 别名，方便import
        },
      },
      devtool: 'source-map',
      plugins: [],
    },
    {
      devtool: 'none',
      mode: 'production', // 开发模式
      target: 'node',
      entry,
      output,
      externals: [
        nodeExternals({
          // allowlist: dependencies,
          allowlist: [
            ...dependencies,
            function (express, a, b) {
              if (
                // map[express] ||
                strIsInArr(express, [...notDependencies, ...abr])
              ) {
                return false
              }
              map[express] = true
              console.log('express', express, a, b)
              return true
            },
          ],
        }),
      ], // 排除Node模块
      plugins: [
        new webpack.EnvironmentPlugin({
          NODE_ENV: 'production',
        }),
      ],
      node: {
        __dirname: false,
        __filename: false,
      },
    }
  )
}

function readAllFiles(pathName) {
  return new Promise((resolve, reject) => {
    fs.readdir(pathName, function (err, files = []) {
      var dirs = []
      ;(function iterator(i) {
        if (i == files.length) {
          resolve(dirs)
          return
        }
        fs.stat(path.join(pathName, files[i]), function (err, data) {
          if (data.isFile()) {
            dirs.push(files[i])
          }
          iterator(i + 1)
        })
      })(0)
    })
  })
}

function prload() {
  // const outerdir = path.resolve(__dirname, '../app')
  const preloadEntryPath = path.resolve(__dirname, '../src/main/preload/entry')
  return new Promise((resolve) => {
    readAllFiles(preloadEntryPath).then((filesNameArr) => {
      const map = {}
      filesNameArr.forEach((namep) => {
        const [name, type] = namep.split('.')
        map[name] = path.resolve(preloadEntryPath, namep)
      })

      console.log('map', map)

      const depc = []

      const preloadjs = getConfig({
        dependencies: depc,
        // dependencies: abtool.dependencies,
        entry: map,
        output: {
          path: path.resolve(__dirname, '../app/dist/main/preload/entry'),
          filename: '[name].js', // 开发模式文件名为main.dev.js
        },
      })
      // console.log(preloadjs)
      const compier = webpack(preloadjs)
      compier.run((err, stats) => {
        if (err) {
          console.log(err)
          return
        }
        console.log('ok11111')
        resolve()
      })
    })
  })
}
function copyDir(startFileDirectory, endFileDirectory, cb) {
  // 根目录

  // 移动目录
  // let startFileDirectory = 'D:\\project-compnay\\stage1.1\\新建文件夹'
  // 放置目录
  // let endFileDirectory = 'E:\\tt'

  // var startDate = new Date().getTime()

  // 删除复制执行
  rmDirFile(endFileDirectory, () => {
    console.log('全部删除完成，开始复制')
    copyDir(startFileDirectory, endFileDirectory, (res) => {
      console.log('全部复制完成')
      console.log('修改文件内容')
      cb()
      // replaceText(endFileDirectory)
    })
  })

  // 删除
  function rmDirFile(path, cb) {
    let files = []
    console.log('开始删除')
    if (fs.existsSync(path)) {
      var count = 0
      var checkEnd = function () {
        console.log('进度', count)
        ++count == files.length && cb && cb()
      }
      files = fs.readdirSync(path)
      files.forEach(function (file, index) {
        let curPath = path + '/' + file
        if (fs.statSync(curPath).isDirectory()) {
          console.log('遇到文件夹', curPath)
          rmDirFile(curPath, checkEnd)
        } else {
          fs.unlinkSync(curPath)
          console.log('删除文件完成', curPath)
          checkEnd()
        }
      })
      // 如果删除文件夹为放置文件夹根目录  不执行删除
      if (path == endFileDirectory) {
        console.log('删除文件夹完成', path)
      } else {
        fs.rmdirSync(path)
      }
      //为空时直接回调
      files.length === 0 && cb && cb()
    } else {
      cb && cb()
    }
  }

  // 复制文件
  function copyFile(srcPath, tarPath, cb) {
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function (err) {
      if (err) {
        console.log('read error', srcPath)
      }
      cb && cb(err)
    })

    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function (err) {
      if (err) {
        console.log('write error', tarPath)
      }
      cb && cb(err)
    })

    ws.on('close', function (ex) {
      cb && cb(ex)
    })

    rs.pipe(ws)
    console.log('复制文件完成', srcPath)
  }

  // 复制文件夹所有
  function copyDir(srcDir, tarDir, cb) {
    if (fs.existsSync(tarDir)) {
      fs.readdir(srcDir, function (err, files) {
        var count = 0
        var checkEnd = function () {
          console.log('进度', count)
          ++count == files.length && cb && cb()
        }

        if (err) {
          cb && cb()
          return
        }

        files.forEach(function (file) {
          var srcPath = path.join(srcDir, file)
          var tarPath = path.join(tarDir, file)

          fs.stat(srcPath, function (err, stats) {
            if (stats.isDirectory()) {
              fs.mkdir(tarPath, function (err) {
                if (err) {
                  console.log(err)
                  return
                }

                copyDir(srcPath, tarPath, checkEnd)
                console.log('复制文件完成', srcPath)
              })
            } else {
              copyFile(srcPath, tarPath, checkEnd)
              console.log('复制文件完成', srcPath)
            }
          })
        })

        //为空时直接回调
        files.length === 0 && cb && cb()
      })
    } else {
      fs.mkdir(tarDir, function (err) {
        if (err) {
          console.log(err)
          return
        }
        console.log('创建文件夹', tarDir)
        copyDir(srcDir, tarDir, cb)
      })
    }
  }
}
function staticPackage() {
  const preloadEntryPath = path.resolve(__dirname, '../src/main/server')

  const outputh = path.resolve(__dirname, '../app/dist/main/server')
  return new Promise((resolve) => {
    copyDir(preloadEntryPath, outputh, function () {
      resolve()
    })
  })
}

prload().then(() => {
  staticPackage()
})
