# ImageCropper 图片裁剪

image-cropper是一个基于vue3 typescript开发的图片裁剪组件，展示区域，裁剪大小可自由控制。

### 安装

```shell
# via npm
npm i image-cropper -D

# via yarn
yarn add @nutui/auto-import-resolver unplugin-vue-components -D

# via pnpm
pnpm add @nutui/auto-import-resolver unplugin-vue-components -D

# via Bun
bun add @nutui/auto-import-resolver unplugin-vue-components -D
```

## 使用


## API

### AvatarCropper Props
| 属性名 | 描述 | 类型 | 默认值 | 是否必需 |
|-------|-----|------|---------|---------|
| crossOrigin | 是否设置图片跨域 | Boolean | false | 否 |
| crossOriginHeader | 是否设置图片跨域 | String | '*' | 否 |
| label | 按钮文字 | String | '选择图片' | 否 |
| isModal | 是否已弹窗形式展示 | Boolean | true | 否 |
| lockScroll | 是否在弹窗出现时锁定body | Boolean | true | 否 |
| showChooseBtn | 是否显示选择图片按钮 | Boolean | true | 否 |
| boxWidth | 裁剪窗口高度 | Number | 800 | 否 |
| boxHeight | 裁剪窗口高度 | Number | 400 | 否 |
| cutWidth | 默认裁剪宽度 | Number | 200 | 否 |
| cutHeight | 默认裁剪高度 | Number | 200 | 否 |
| rate | 按比例裁剪，例(2:1) | String | null | 否 |
| tool | 是否显示工具栏 | Boolean | true | 否 |
| toolBgc | 工具栏背景色 | String | '#fff' | 否 |
| imgMove | 能否拖动图片 | Boolean | true | 否 |
| sizeChange | 能否调整裁剪尺寸 | Boolean | true | 否 |
| originalGraph | 是否为原图裁剪 | Boolean | false | 否 |
| moveAble | 能否调整裁剪区域位置 | Boolean | true | 否 |
| previewMode | 裁剪过程中是否返回裁剪结果 裁剪原图卡顿时将此项设置为false | Boolean | true | 否 |
| CuttingOriginal | 是否裁剪原图 | Boolean | false | 否 |
| WatermarkText | 水印文字 | String | '' | 否 |
| WatermarkTextFont | 水印文字样式 | String | '12px Sans-serif' | 否 |
| WatermarkTextColor | 水印文字颜色 | String | '#fff' | 否 |
| WatermarkTextX | 水印横向位置 | Number | 0.95 | 否 |
| WatermarkTextY | 水印纵向位置 | Number | 0.95 | 否 |
| smallToUpload | 选择的图片宽高均小于裁剪宽高度时候直接上传原图 | Boolean | false | 否 |
| saveCutPosition | 是否保存上一次裁剪位置 | Boolean | false | 否 |
| scaleAble | 是否允许缩放图片 | Boolean | true | 否 |
| fileType | 文件类型 | String | 'png' | 否 |
| toolBoxOverflow | 是否允许裁剪框超出图片 | Boolean | true | 否 |
| DoNotDisplayCopyright |  | Boolean | false | 否 |
| quality | 裁剪后的图片质量 | Number | 1 | 否 |
| isFinishClose | 是否在裁剪完成后关闭弹窗 | Boolean | true | 否 |
| customParams | 自定义参数 返回结果时会带入此值 |  | null | 否 |

### AvatarCropper Slots

| 名称    | 描述                                                        |
| ------- | ----------------------------------------------------------- |
| default | 默认插槽，可放置图片、图标、文本等元素                      |
| toolbar | 选择文件后裁剪弹窗底部元素可以自定义，通过ref调用组件的方法 |

### AvatarCropper Events

| 名称    | 描述               | 回调参数           |
| ------- | ------------------ | ------------------ |
| confirm | 裁剪后点击确认触发 | url:裁剪后的base64 |
| cancel  | 点击取消触发       | -                  |

### AvatarCropper Ref

| 事件名  | 说明      |
| ------- | --------- |
| cancel  | 取消裁剪  |
| reset   | 重置为0度 |
| rotate  | 旋转90度  |
| confirm | 确定裁剪  |
