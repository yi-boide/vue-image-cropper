/*
 * @Author: Marvin
 * @Date: 2023-12-11 17:48:57
 * @LastEditors: Marvin 454846659@qq.com
 * @LastEditTime: 2023-12-26 11:00:45
 * @FilePath: /vue-image-cropper/packages/index.ts
 * @Description:
 * Copyright (c) 2023 by Marvin, All Rights Reserved.
 */
import config from '../package.json'
import type { App } from 'vue'
import { ImageCropper } from './ImageCropper'

const version = config.version

// 定义 install 方法
const install = (app: App): void => {
  app.component(ImageCropper.name as string, ImageCropper)
}

export { ImageCropper, version }

export default { install, version }
