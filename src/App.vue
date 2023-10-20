<!--
 * @Author: Marvin 454846659@qq.com
 * @Date: 2023-10-19 17:42:53
 * @LastEditors: Marvin 454846659@qq.com
 * @LastEditTime: 2023-10-21 00:57:47
 * @FilePath: /vue-image-cropper/src/App.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by Marvin, All Rights Reserved. 
-->
<template>
  <image-cropper @cutDown="cutDown" @onPrintImg="onPrintImg">
    <!-- <template #open></template> -->
  </image-cropper>
  <img style="width: 200px;" :src="imgUrl" :alt="imgUrl">
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const imgUrl = ref('')
const cutDown = (data: any) => {
  imgUrl.value = data.dataURL
}
const onPrintImg = (data: any) => {
  imgUrl.value = data.dataURL
}
</script>