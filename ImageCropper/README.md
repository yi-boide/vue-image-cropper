<!--
 * @Author: Marvin 454846659@qq.com
 * @Date: 2023-10-19 17:45:22
 * @LastEditors: Marvin 454846659@qq.com
 * @LastEditTime: 2023-12-26 19:07:50
 * @FilePath: /vue-image-cropper/README.md
 * @Description: 
 * 
 * Copyright (c) 2023 by Marvin, All Rights Reserved. 
-->
# ImageCropper 图片裁剪

image-cropper是一个基于vue3 typescript开发的图片裁剪组件，展示区域，裁剪大小可自由控制。

## 安装

```shell
# via npm
npm i image-cropper-next

# via yarn
yarn add image-cropper-next

# via pnpm
pnpm add image-cropper-next

# via Bun
bun add image-cropper-next
```

## 使用，全局导入(main.ts/main.js)

```ts
import { createApp } from 'vue'
import ImageCropper from 'image-cropper-next'
const app = createApp(App)
app.use(ImageCropper)
```

## 使用，用的地方导入

### 默认方式，弹窗模式，不穿入任何参数

> 点击按钮后会打开弹窗，需要在内部选择图片，然后进行裁剪

```html
<template>
  <image-cropper @confirm="confirm"></image-cropper>
  <img style="width: 200px;" :src="imgUrl" :alt="imgUrl">
</template>
<script setup>
import { ImageCropper } from 'image-cropper-next'
const imgUrl = ref('')
const imageCropperRef = ref()
const confirm = (data) => {
  imgUrl.value = data.dataURL
}
</script>
```

### 远端图片裁剪，弹窗模式，不穿入任何参数

> 自定义配置，通过ref触发open方法，需要传入图片地址，不传入则需要在内部选择图片进行裁剪
> 远端图片需要配置cross-origin为true，cross-origin-header为"anonymous"

```html
<template>
  <button @click="imageCropperRef.open(image)">打开裁剪框</button>
  <image-cropper ref="imageCropperRef" :cross-origin="true" cross-origin-header="anonymous" @confirm="confirm">
    <template #open></template>
  </image-cropper>
  <img style="width: 200px;" :src="imgUrl" :alt="imgUrl">
</template>
<script setup>
import { ImageCropper } from 'image-cropper-next'
const imgUrl = ref('')

const image = new Image()
image.name = 'test'
image.src = 'https://node.wisdoms.xin/static/img/20230627/zb0XVS9bimage.png'

const imageCropperRef = ref()
const confirm = (data) => {
  imgUrl.value = data.dataURL
}
</script>
```

### 直接在页面中显示模式

> 可通过onPrintImg方法实时获取裁剪后的图片信息

```html
<template>
  <image-cropper :isModal="false" @confirm="confirm" @onPrintImg="onPrintImg">
    <template #open></template>
  </image-cropper>
  <img style="width: 200px;" :src="imgUrl" :alt="imgUrl">
</template>

<script lang="ts" setup>
import { ImageCropper } from 'image-cropper-next'
import { ref } from 'vue';

const imgUrl = ref('')
const confirm = (data: any) => {
  console.log(data);
  imgUrl.value = data.dataURL
}
const onPrintImg = (data: any) => {
  console.log(data);
  imgUrl.value = data.dataURL
}
</script>
```

## API

### AvatarCropper Props

工具栏和底部操作栏均可以设置为不展示，通过ref进行自定义配置，也可通过slots进行自定义配置。

| 属性名 | 描述 | 类型 | 默认值 | 是否必需 |
|-------|-----|------|---------|---------|
| cross-origin | 是否设置图片跨域 | Boolean | false | 否 |
| cross-origin-header | 是否设置图片跨域 | String | '*' | 否 |
| label | 按钮文字 | String | '选择图片' | 否 |
| is-modal | 是否已弹窗形式展示 | Boolean | true | 否 |
| lock-scroll | 是否在弹窗出现时锁定body | Boolean | true | 否 |
| show-choose-btn | 是否显示选择图片按钮 | Boolean | true | 否 |
| box-width | 裁剪窗口高度 | Number | 800 | 否 |
| box-height | 裁剪窗口高度 | Number | 400 | 否 |
| cut-width | 默认裁剪宽度 | Number | 200 | 否 |
| cut-height | 默认裁剪高度 | Number | 200 | 否 |
| rate | 按比例裁剪，例(2:1) | String | null | 否 |
| tool | 是否显示工具栏 | Boolean | true | 否 |
| tool-bg | 工具栏背景色 | String | '#fff' | 否 |
| img-move | 能否拖动图片 | Boolean | true | 否 |
| size-change | 能否调整裁剪尺寸 | Boolean | true | 否 |
| original-graph | 是否为原图裁剪 | Boolean | false | 否 |
| move-able | 能否调整裁剪区域位置 | Boolean | true | 否 |
| preview-mode | 裁剪过程中是否返回裁剪结果 裁剪原图卡顿时将此项设置为false | Boolean | true | 否 |
| watermark-text | 水印文字 | String | '' | 否 |
| watermark-text-font | 水印文字样式 | String | '12px Sans-serif' | 否 |
| watermark-text-color | 水印文字颜色 | String | '#fff' | 否 |
| watermark-text-x | 水印横向位置 | Number | 0.95 | 否 |
| watermark-text-y | 水印纵向位置 | Number | 0.95 | 否 |
| small-to-upload | 选择的图片宽高均小于裁剪宽高度时候直接上传原图 | Boolean | false | 否 |
| save-cut-position | 是否保存上一次裁剪位置 | Boolean | false | 否 |
| scale-able | 是否允许缩放图片 | Boolean | true | 否 |
| file-type | 文件类型 | String | 'png' | 否 |
| tool-box-overflow | 是否允许裁剪框超出图片 | Boolean | true | 否 |
| quality | 裁剪后的图片质量 | Number | 1 | 否 |
| is-finish-close | 是否在裁剪完成后关闭弹窗 | Boolean | true | 否 |
| footer | 是否显示底部操作栏 | Boolean | true | 否 |

### AvatarCropper Slots

| 名称    | 描述                                                        |
| ------- | ----------------------------------------------------------- |
| open | 弹窗模式，初始状态下显示的内容，设置后label文字按钮将不再显示（showChooseBtn为true时生效） |
| title | 自定义title内容      |
| ratio | 控制该（Ratio: ）内容 |
| scale | 控制该（Scale: ）内容 |
| rotateLeft | 控制该（↳）内容 |
| rotateRight | 控制该（↲）内容 |
| resetRotate | 控制该（↻）内容 |
| flipHorizontal | 控制该（⇆）内容 |
| flipVertically | 控制该（⇅）内容 |
| choose | 左下角显示的选择文件按钮（showChooseBtn为true时生效） |
| cancel | 取消按钮（清除画布/关闭弹窗） |
| confirm | 确认按钮（确认裁剪） |
| footer  | 底部操作栏  |

### AvatarCropper Events

| 名称    | 描述               | 回调参数           |
| ------- | ------------------ | ------------------ |
| confirm | 点击确认后触发 | (dataFile: DataFile) |
| realTime | 实现渲染触发，每次更改裁剪内容都会触发 | (dataFile: DataFile) |
| error  | 错误时触发       | 错误信息                 |
| clearAll  | 清除所有内容       | -                  |

### AvatarCropper Ref

| 事件名  | 说明      | 参数 |
| ------- | --------- | ----- |
| close  | 取消  | - |
| open | 打开裁剪框  |  image图片,必须要有src属性（new Image()）  |
| chooseImage | 选择图片  | - |
| flipDirection | 反向翻转，默认值：`horizontal`,可选值：`vertically`  | (direction: FlipDirection) |
| resetScale | 重置缩放  | - |
| resetRotate | 重置旋转  | - |
| rotate | 旋转角度  | (angle: number) |
| cropImage | 裁剪图片, doNotReset:是否实时返回截取结果, callback: 返回对象回调  | (doNotReset: boolean, callback: (dataFile: DataFile) => void) |

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式。

| 名称               | 默认值 | 描述     |
| ------------------ | ------ | -------- |
| \--image-cropper-primary-color | `#409eff`  | 主题颜色 |
| \--image-cropper-primary-color-hover | `#66b1ff`  | 主题颜色hover |
| \--image-cropper-primary-color-light | `#c6e2ff`  | 主题颜色次色 |
| \--image-cropper-warning-color | `#e6a23c`  | warning色调 |
| \--image-cropper-warning-color-hover | `#ebb563`  | warning色调hover |
