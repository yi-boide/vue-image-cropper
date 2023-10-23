/*
 * @Author: Marvin 454846659@qq.com
 * @Date: 2023-10-17 17:26:47
 * @LastEditors: Marvin 454846659@qq.com
 * @LastEditTime: 2023-10-23 16:18:17
 * @FilePath: /vue-image-cropper/packages/ImageCropper/index.ts
 * @Description: ImageCropper
 * 
 * Copyright (c) 2023 by Marvin, All Rights Reserved. 
 */
import ImageCropper from './index.vue';
export type { ImageCropperProps } from './props';
import { App } from 'vue';

const version = '0.0.6'

// 定义 install 方法
const install = (app: App): void => {
  app.component(ImageCropper.name, ImageCropper)
}

export {
  ImageCropper,
  version
}

export default { install, version }