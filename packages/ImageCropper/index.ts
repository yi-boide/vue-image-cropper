/*
 * @Author: Marvin 454846659@qq.com
 * @Date: 2023-10-17 17:26:47
 * @LastEditors: Marvin 454846659@qq.com
 * @LastEditTime: 2023-12-26 18:08:02
 * @FilePath: /vue-image-cropper/packages/ImageCropper/index.ts
 * @Description: ImageCropper
 *
 * Copyright (c) 2023 by Marvin, All Rights Reserved.
 */
import config from '../../package.json'
import ImageCropper from './index.vue'
export * from './props'
import { App } from 'vue'

const version = config.version

// 定义 install 方法
const install = (app: App): void => {
  app.component(ImageCropper.name as string, ImageCropper)
}

export { ImageCropper, version }

export default { install, version }
