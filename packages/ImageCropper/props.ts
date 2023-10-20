/*
 * @Author: Marvin 454846659@qq.com
 * @Date: 2023-10-17 17:26:47
 * @LastEditors: Marvin 454846659@qq.com
 * @LastEditTime: 2023-10-20 17:50:47
 * @FilePath: /vue-image-cropper/packages/ImageCropper/props.ts
 * @Description: ImageCropper相关类型定义
 * 
 * Copyright (c) 2023 by Marvin, All Rights Reserved. 
 */
export type ImageCropperPropsInner = {
  crossOrigin: boolean;
  crossOriginHeader: string;
  label: string;
  isModal: boolean;
  lockScroll: boolean;
  showChooseBtn: boolean;
  boxWidth: number;
  boxHeight: number;
  cutWidth: number;
  cutHeight: number;
  rate?: string | null;
  tool: boolean;
  toolBg: string;
  imgMove: boolean;
  sizeChange: boolean;
  originalGraph: boolean;
  moveAble: boolean;
  previewMode: boolean;
  CuttingOriginal: boolean;
  WatermarkText: string;
  WatermarkTextFont: string;
  WatermarkTextColor: string;
  WatermarkTextX: number;
  WatermarkTextY: number;
  smallToUpload: boolean;
  saveCutPosition: boolean;
  scaleAble: boolean;
  fileType: string;
  toolBoxOverflow: boolean;
  DoNotDisplayCopyright: boolean;
  quality: number;
  isFinishClose: boolean;
};
// 将ImageCropperProps转换一份全为可选的类型
export type ImageCropperProps = {
  [P in keyof ImageCropperPropsInner]?: ImageCropperPropsInner[P];
};