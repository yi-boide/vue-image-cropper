/*
 * @Author: Marvin 454846659@qq.com
 * @Date: 2023-10-17 17:26:47
 * @LastEditors: Marvin 454846659@qq.com
 * @LastEditTime: 2023-12-26 17:45:15
 * @FilePath: /vue-image-cropper/packages/ImageCropper/props.ts
 * @Description: ImageCropper相关类型定义
 *
 * Copyright (c) 2023 by Marvin, All Rights Reserved.
 */
import { ExtractPropTypes, PropType } from 'vue'
export type FileType = 'png' | 'jpg' | 'jpeg' | 'webp' | 'bmp'
export type FlipDirection = 'horizontal' | 'vertically'
export const imageCropperProps = {
  crossOrigin: {
    type: Boolean,
    default: false,
    required: false,
  },
  crossOriginHeader: {
    type: String,
    default: '*',
    required: false,
  },
  label: {
    type: String,
    default: '选择图片',
    required: false,
  },
  isModal: {
    type: Boolean,
    default: true,
    required: false,
  },
  lockScroll: {
    type: Boolean,
    default: true,
    required: false,
  },
  showChooseBtn: {
    type: Boolean,
    default: true,
    required: false,
  },
  boxWidth: {
    type: Number,
    default: 800,
    required: false,
  },
  boxHeight: {
    type: Number,
    default: 400,
    required: false,
  },
  cutWidth: {
    type: Number,
    default: 200,
    required: false,
  },
  cutHeight: {
    type: Number,
    default: 200,
    required: false,
  },
  rate: {
    type: String,
    default: null,
    required: false,
  },
  tool: {
    type: Boolean,
    default: true,
    required: false,
  },
  footer: {
    type: Boolean,
    default: true,
    required: false,
  },
  toolBg: {
    type: String,
    default: '#fff',
    required: false,
  },
  imgMove: {
    type: Boolean,
    default: true,
    required: false,
  },
  sizeChange: {
    type: Boolean,
    default: true,
    required: false,
  },
  originalGraph: {
    type: Boolean,
    default: false,
    required: false,
  },
  moveAble: {
    type: Boolean,
    default: true,
    required: false,
  },
  previewMode: {
    type: Boolean,
    default: true,
    required: false,
  },
  watermarkText: {
    type: String,
    default: '',
    required: false,
  },
  watermarkTextFont: {
    type: String,
    default: '12px Sans-serif',
    required: false,
  },
  watermarkTextColor: {
    type: String,
    default: '#fff',
    required: false,
  },
  watermarkTextX: {
    type: Number,
    default: 0.95,
    required: false,
  },
  watermarkTextY: {
    type: Number,
    default: 0.95,
    required: false,
  },
  smallToUpload: {
    type: Boolean,
    default: false,
    required: false,
  },
  saveCutPosition: {
    type: Boolean,
    default: false,
    required: false,
  },
  scaleAble: {
    type: Boolean,
    default: true,
    required: false,
  },
  fileType: {
    type: String as PropType<FileType>,
    default: 'png',
    required: false,
  },
  toolBoxOverflow: {
    type: Boolean,
    default: true,
    required: false,
  },
  quality: {
    type: Number,
    default: 1,
    required: false,
  },
  isFinishClose: {
    type: Boolean,
    default: true,
    required: false,
  },
}
export type ImageCropperProps = ExtractPropTypes<typeof imageCropperProps>
export type DataFile = {
  fileName: string
  blob?: Blob
  file: File
  dataURL: string
}
