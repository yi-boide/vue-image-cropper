import type { App } from 'vue'
import { ImageCropper } from './ImageCropper'

const version = '0.0.3'

// 定义 install 方法
const install = (app: App): void => {
  app.component(ImageCropper.name as string, ImageCropper)
}

export {
  ImageCropper,
  version
}

export default { install, version }