/*
 * @Author: Marvin 454846659@qq.com
 * @Date: 2023-10-20 15:27:55
 * @LastEditors: Marvin 454846659@qq.com
 * @LastEditTime: 2023-10-20 15:33:03
 * @FilePath: /portal-vue3/packages/image-cropper/scripts/generate-types.cjs
 * @Description: 
 * 
 * Copyright (c) 2023 by Marvin, All Rights Reserved. 
 */
const path = require('path');
const fs = require('fs');

const sourceDir = path.resolve(__dirname, './../tsc/type/packages/ImageCropper'); // 拷贝的源文件夹

const toDir = path.resolve(__dirname, './../dist/types'); // ./../dist

fs.cp(sourceDir, toDir, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
    return;
  }
})