import { UserConfig } from 'vite'
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'

// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()
// 路径查找
function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

// https://vite.dev/config/
export default (): UserConfig => {
  return {
    plugins: [vue()],
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: pathResolve('src') + '/',
        },
      ],
    }
  }
}