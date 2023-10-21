/*
 * @Author: Marvin 454846659@qq.com
 * @Date: 2023-10-20 15:27:55
 * @LastEditors: Marvin 454846659@qq.com
 * @LastEditTime: 2023-10-21 14:10:16
 * @FilePath: /vue-image-cropper/scripts/generate-types.cjs
 * @Description: 
 * 
 * Copyright (c) 2023 by Marvin, All Rights Reserved. 
 */
const path = require('path');
const fs = require('fs');

const sourceDir = path.resolve(__dirname, './../tsc/type/packages/ImageCropper'); // 拷贝的源文件夹

const toDir = path.resolve(__dirname, './../dist/types'); // ./../dist

const indexDir = path.resolve(__dirname, './../dist/types/index.d.ts'); // ./../dist

const appendIndexContent = `\ndeclare module 'vue' {
  export interface GlobalComponents {
      ImageCropper: typeof import("./index.vue")["default"]
  }
}`

fs.cp(sourceDir, toDir, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('ts types copy success');
  fs.appendFile(indexDir, appendIndexContent, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('ts types append success');
  })
})