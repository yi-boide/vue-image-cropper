<template>
  <div class="image-cropper">
    <div @click="open()" v-if="showChooseBtn && isModal">
      <slot name="open"></slot>
    </div>
    <button
      type="button"
      v-if="!$slots.openImgCutter && !$slots.open && isModal"
      class="btn btn-primary"
      @click="open()"
    >
      {{ label }}
    </button>
    <transition name="fade">
      <div v-if="visible" :class="isModal ? 'mask' : ''" ref="maskRef">
        <div :class="isModal ? 'dialog-box-modal' : 'dialog-box'" v-if="visible">
          <transition
            name="fade"
            enter-class="fade-in-enter"
            enter-active-class="fade-in-active"
            leave-class="fade-out-enter"
            leave-active-class="fade-out-active"
          >
            <div
              ref="dialogMainModalRef"
              :class="isModal ? 'dialog-main-modal' : 'dialog-main'"
              :style="'width:' + (isModal ? boxWidth + 32 : boxWidth) + 'px'"
            >
              <div class="tool-main">
                <div class="tool-title" v-if="isModal">
                  <solt name="title">
                    图片裁剪
                    <span class="close-icon" @click="close"></span>
                  </solt>
                </div>
                <div
                  ref="toolBoxRef"
                  :style="'height:' + boxHeight + 'px;width:' + boxWidth + 'px'"
                  @mousemove="controlBtnMouseMove"
                  @mouseup="controlBtnMouseUp"
                  @mouseleave="controlBtnMouseUp"
                  class="tool-box"
                >
                  <!--选取图片-->
                  <div class="tips" v-show="!drawImg.img && showChooseBtn">
                    <div class="btn btn-warning btn-xs" @click="chooseImage">
                      {{ label }}
                    </div>
                  </div>
                  <!--工具栏-->
                  <div
                    v-if="tool == true"
                    v-show="
                      drawImg.img && dropImg.active !== true && controlBox.disable == true && toolBox.disable == true
                    "
                    class="dock-main"
                    :style="'background:' + toolBg"
                    @mouseenter="dropImgOff"
                  >
                    <div class="dock-btn" v-if="rate">
                      <slot name="ratio"> Ratio: </slot>
                      {{ rate }}
                    </div>
                    <div class="dock-btn" @click="resetScale">
                      <slot name="scale"> Scale: </slot>
                      {{ drawImg.swidth > 0 ? (drawImg.width / drawImg.swidth).toFixed(2) : '-' }}
                    </div>
                    <div v-if="originalGraph === false" @click="rotate(-90)" class="dock-btn">
                      <slot name="rotateLeft"> ↳ </slot>
                    </div>
                    <div v-if="originalGraph === false" @click="rotate(90)" class="dock-btn">
                      <slot name="rotateRight"> ↲ </slot>
                    </div>
                    <div v-if="originalGraph === false" @click="resetRotate()" class="dock-btn">
                      <slot name="resetRotate"> ↻ </slot>
                    </div>
                    <div v-if="originalGraph === false" class="dock-btn-scroll-bar">
                      <div
                        ref="dockBtnScrollControlRef"
                        @mousemove="scrollBarControlMove"
                        @mousedown="scrollBarControlOn"
                        @mouseleave="scrollBarControlOff"
                        @mouseup="scrollBarControlOff"
                        :style="'left:' + rotateControl.position + 'px'"
                        class="scroll-bar-control"
                      ></div>
                      <div
                        v-if="rotateControl.active == true"
                        class="scroll-bar-text"
                        :style="'left:' + rotateControl.position + 'px'"
                      >
                        {{ rotateImg.angle.toFixed(0) + '°' }}
                      </div>
                    </div>
                    <div v-if="originalGraph === false" @click="flipDirection()" class="dock-btn">
                      <slot name="flipHorizontal"> ⇆ </slot>
                    </div>
                    <div v-if="originalGraph === false" @click="flipDirection('vertically')" class="dock-btn">
                      <slot name="flipVertically"> ⇅ </slot>
                    </div>
                  </div>
                  <!--裁剪区域-->
                  <div
                    v-show="drawImg.img"
                    ref="toolBoxControlRef"
                    @mousedown="toolBoxMouseDown"
                    @mouseup="toolBoxMouseUp"
                    @mousemove="toolBoxMouseMove"
                    @mouseleave="toolBoxMouseLeave"
                    class="tool-box-control"
                    :style="{
                      pointerEvents: moveAble ? 'auto' : 'none',
                    }"
                  >
                    <div class="tool-box-control-box">
                      <div class="control-box">
                        <!--蚂蚁线-->
                        <div class="control-box-inner-line control-box-inner-line-top"></div>
                        <div class="control-box-inner-line control-box-inner-line-bottom"></div>
                        <div class="control-box-inner-line control-box-inner-line-left"></div>
                        <div class="control-box-inner-line control-box-inner-line-right"></div>
                        <!--工具栏提示-->
                        <div class="select-area">
                          宽:{{ showToolBoxWidth }} 高:{{ showToolBoxHeight }} (x:{{ showToolBoxX }},y:{{
                            showToolBoxY
                          }})
                        </div>
                        <!--操作杆-->
                        <div
                          data-name="leftUp"
                          v-if="sizeChange"
                          @mousedown="controlBtnMouseDown($event, 'leftUp')"
                          class="left-up control-btn"
                        ></div>
                        <div
                          data-name="leftDown"
                          v-if="sizeChange"
                          @mousedown="controlBtnMouseDown($event, 'leftDown')"
                          class="left-down control-btn"
                        ></div>
                        <div
                          data-name="rightUp"
                          v-if="sizeChange"
                          @mousedown="controlBtnMouseDown($event, 'rightUp')"
                          class="right-up control-btn"
                        ></div>
                        <div
                          data-name="rightDown"
                          v-if="sizeChange"
                          @mousedown="controlBtnMouseDown($event, 'rightDown')"
                          class="right-down control-btn"
                        ></div>

                        <div
                          data-name="topCenter"
                          v-if="sizeChange && !rate && toolBox.width > 20"
                          @mousedown="controlBtnMouseDown($event, 'topCenter')"
                          class="top-center control-btn"
                        ></div>
                        <div
                          data-name="downCenter"
                          v-if="sizeChange && !rate && toolBox.width > 20"
                          @mousedown="controlBtnMouseDown($event, 'downCenter')"
                          class="down-center control-btn"
                        ></div>
                        <div
                          data-name="leftCenter"
                          v-if="sizeChange && !rate && toolBox.height > 20"
                          @mousedown="controlBtnMouseDown($event, 'leftCenter')"
                          class="left-center control-btn"
                        ></div>
                        <div
                          data-name="rightCenter"
                          v-if="sizeChange && !rate && toolBox.height > 20"
                          @mousedown="controlBtnMouseDown($event, 'rightCenter')"
                          class="right-center control-btn"
                        ></div>
                      </div>
                      <div class="tool-box-control-line"></div>
                      <div class="tool-box-control-line"></div>
                      <div class="tool-box-control-line"></div>
                      <div class="tool-box-control-line"></div>
                    </div>
                  </div>
                  <!--画布-->
                  <canvas
                    class="canvas-select-box"
                    ref="canvasSelectBoxRef"
                    :width="boxWidth"
                    @mousedown="dropImgOn"
                    @mouseup="dropImgOff"
                    @mousemove="dropImgMove"
                    :height="boxHeight"
                  ></canvas>
                  <canvas class="canvas" ref="canvasRef" :width="boxWidth" :height="boxHeight"></canvas>
                </div>
              </div>
              <slot name="footer">
                <div v-if="footer" class="i-dialog-footer">
                  <input class="file-input" @change="putImgToCanv" ref="inputFileRef" type="file" accept="image/*" />
                  <div class="choose" @click="chooseImage">
                    <slot name="choose">
                      <div class="btn btn-primary btn-primary-plain" v-if="showChooseBtn">
                        {{ label }}
                      </div>
                    </slot>
                  </div>
                  <div class="btn-group">
                    <div @click="close">
                      <slot name="cancel">
                        <button type="button" class="btn btn-default">取消</button>
                      </slot>
                    </div>
                    <div @click="cropImage(false)">
                      <slot name="confirm">
                        <button
                          type="button"
                          class="btn btn-primary"
                          style="margin-left: 15px"
                          :disabled="!drawImg.img"
                        >
                          确定
                        </button>
                      </slot>
                    </div>
                  </div>
                </div>
              </slot>
            </div>
          </transition>
          <div style="clear: both"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, toRefs, onMounted, nextTick } from 'vue'
import { imageCropperProps } from './props'
import type { DataFile, FlipDirection } from './props'

type DrawImg = {
  // 规定要使用的图像、画布
  img?: HTMLImageElement
  // 开始剪切的 x 坐标位置
  sx: number
  // 开始剪切的 y 坐标位置
  sy: number
  // 被剪切图像的宽度
  swidth: number
  // 被剪切图像的高度
  sheight: number
  // 在画布上放置图像的 x 坐标位置
  x: number
  // 在画布上放置图像的 y 坐标位置
  y: number
  // 要使用的图像的宽度
  width: number
  // 要使用的图像的高度
  height: number
}

type ToolBoxPosition = {
  x: number
  y: number
}

type BoxMove = {
  start: ToolBoxPosition
  moveTo: ToolBoxPosition
}

type ToolBox = {
  disable: boolean
  width: number
  height: number
  boxMove: BoxMove
} & ToolBoxPosition

type DropImg = {
  active: boolean
  pageX: number
  pageY: number
  params: any
}

type RotateControl = {
  active: boolean
  start: {
    position: number | 0
  } & ToolBoxPosition
  position: number
}

type ControlBox = {
  disable: boolean
  btnName: string
  start: {
    width: number
    height: number
  } & ToolBoxPosition
}

type State = {
  visible: boolean
  fileName: string
  cutImageObj?: HTMLImageElement | null
  printImageTimmer: any
  toolBoxPosition: ToolBoxPosition
  toolBox: ToolBox
  drawImg: DrawImg
  dropImg: DropImg
  rotateImg: {
    angle: number
  }
  rotateControl: RotateControl
  scaleImg: {
    rate: number
    params: any
  }
  controlBox: ControlBox
  selectBox: boolean
  selectBoxColor: string
  isFlipHorizontal: boolean
  isFlipVertically: boolean
}
defineOptions({
  name: 'ImageCropper',
})

const props = defineProps(imageCropperProps)
const defDrawImg = {
  img: undefined,
  sx: 0,
  sy: 0,
  swidth: 0,
  sheight: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}
const toolBoxRef = ref()
const dialogMainModalRef = ref()
const maskRef = ref()
const canvasRef = ref()
const canvasSelectBoxRef = ref()
const toolBoxControlRef = ref()
const inputFileRef = ref()
const dockBtnScrollControlRef = ref()
const state = reactive<State>({
  visible: false,
  fileName: '',
  cutImageObj: null,
  printImageTimmer: null as any,
  toolBoxPosition: {
    x: 0,
    y: 0,
  },
  drawImg: { ...defDrawImg },
  toolBox: {
    disable: true,
    width: props.boxWidth / 2,
    height: props.boxHeight / 2,
    x: 0,
    y: 0,
    boxMove: {
      start: {
        x: 0,
        y: 0,
      },
      moveTo: {
        x: 0,
        y: 0,
      },
    },
  },
  dropImg: {
    active: false,
    pageX: 0,
    pageY: 0,
    params: {},
  },
  // 旋转
  rotateImg: {
    angle: 0,
  },
  rotateControl: {
    active: false,
    start: {
      position: 0,
      x: 0,
      y: 0,
    },
    position: 100,
  },
  // 缩放
  scaleImg: {
    rate: 0,
    params: {},
  },
  controlBox: {
    disable: true,
    btnName: '',
    start: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  },
  selectBox: false,
  selectBoxColor: 'rgba(0,0,0,0.6)',
  // 是否水平翻转
  isFlipHorizontal: false,
  // 是否垂直翻转
  isFlipVertically: false,
})
const fileName = computed(() => {
  const { fileName } = state
  const { fileType } = props
  const index = fileName.lastIndexOf('.')
  return fileName.substr(0, index + 1) + (fileType === 'jpeg' ? 'jpg' : fileType)
})

const showToolBoxWidth = computed(() => {
  let result: number
  if (!props.originalGraph) {
    result = state.toolBox.width
  } else {
    result = state.toolBox.width / (state.drawImg.width / state.drawImg.swidth)
  }
  return Number(result).toFixed(0)
})
const showToolBoxHeight = computed(() => {
  let result: number
  if (!props.originalGraph) {
    result = state.toolBox.height
  } else {
    result = state.toolBox.height / (state.drawImg.width / state.drawImg.swidth)
  }
  return Number(result).toFixed(0)
})
const showToolBoxX = computed(() => {
  let result: number | string
  result = state.toolBoxPosition.x
  return Number(result).toFixed(0)
})
const showToolBoxY = computed(() => {
  let result: number | string
  result = state.toolBoxPosition.y
  return Number(result).toFixed(0)
})
const ratio = computed(() => {
  let result = 1
  if (props.rate) {
    const rate = props.rate.split(':')
    result = Number(rate[0]) / Number(rate[1])
  }
  return result
})

const { visible, drawImg, toolBox, dropImg, rotateImg, rotateControl, controlBox } = toRefs(state)

const emit = defineEmits(['realTime', 'error', 'clearAll', 'confirm'])

// 开启裁剪
const open = (img?: HTMLImageElement) => {
  const init = (callback?: () => void) => {
    if (toolBoxRef.value) {
      toolBoxRef.value.onmousewheel = scaleImgWheel
      toolBoxRef.value?.addEventListener('DOMMouseScroll', scaleImgWheel)
    }

    // 判断下窗口高度
    if (props.isModal) {
      if (props.lockScroll) {
        document.body.style.overflowY = 'hidden'
      }
      const dialogBoxHeight = dialogMainModalRef.value.offsetHeight + 200
      const windowHeight = window.innerHeight

      let mask = maskRef.value

      if (dialogBoxHeight > windowHeight) {
        mask.style.overflowY = 'scroll'
      } else {
        mask.style.overflowY = 'hidden'
      }
    }
    if (callback && typeof callback === 'function') {
      callback()
    }
  }

  // 如果传入了图片
  if (img && typeof img == 'object' && img.src) {
    let $image = new Image()

    if (props.crossOrigin) {
      $image.crossOrigin = props.crossOriginHeader
    }
    $image.name = img.name
    $image.setAttribute('name', img.name)
    // $image.width = img.width;
    // $image.height = img.height;
    // $image.style.width = '1px';
    // $image.style.height = '1px';
    $image.style.position = 'fixed'
    $image.style.top = -5000 + 'px'
    $image.style.opacity = '0'
    $image.onerror = (e) => {
      console.error('图片加载失败')
      emit('error', {
        event: e,
        msg: '图片加载失败',
      })
      clearCutImageObj()
    }
    $image.onload = () => {
      if ($image.complete) {
        state.visible = true
        nextTick(() => {
          init(() => {
            importImgToCanv($image)
          })
        })
      } else {
        throw new Error('图片加载失败')
        // this.handleClose();
      }
    }
    $image.src = img.src
    state.cutImageObj = $image
    document.body.appendChild($image)
  } else {
    state.visible = true
    nextTick(() => {
      init()
    })
  }
}
// 关闭裁剪
const close = () => {
  clearAll()
  if (props.isModal) {
    if (props.lockScroll) {
      document.body.style.overflowY = 'scroll'
    }
    nextTick(() => {
      state.visible = false
    })
  }
}
// 选择图片 e.stopPropagation();
const chooseImage = () => {
  inputFileRef.value?.click()
}
const importImgToCanv = (img: HTMLImageElement) => {
  const imgHeight = img.height
  const imgWidth = img.width
  const { boxWidth, boxHeight } = props
  let rate: number
  let drawImg = { ...state.drawImg }

  state.fileName = img.name
  drawImg.img = img
  state.scaleImg.rate = imgWidth / imgHeight // 缩放时用到此参数
  if (imgHeight < boxHeight && imgWidth < boxWidth) {
    rate = 1
    drawImg.x = (boxWidth - imgWidth) / 2
    drawImg.y = (boxHeight - imgHeight) / 2
  } else {
    if (imgWidth / imgHeight <= boxWidth / boxHeight) {
      // 计算宽高比
      rate = boxHeight / imgHeight
      drawImg.x = (boxWidth - imgWidth * rate) / 2
    } else {
      rate = boxWidth / imgWidth
      drawImg.y = (boxHeight - imgHeight * rate) / 2
    }
  }
  drawImg.swidth = imgWidth
  drawImg.sheight = imgHeight
  drawImg.width = imgWidth * rate
  drawImg.height = imgHeight * rate
  drawImg.x = (boxWidth - drawImg.width) / 2
  drawImg.y = (boxHeight - drawImg.height) / 2
  state.drawImg = drawImg
  printImg()
  putToolBox()
}
// 将选择的图片绘制到画布
const putImgToCanv = (e: Event) => {
  const fileInput = e.target as HTMLInputElement
  let file: File

  if (fileInput?.files) {
    file = fileInput.files[0] || null
  } else {
    // 如果是IE9及以下
    console.error('IE9及以下需要自己传入image对象')
    // this.$emit('importImage',e);
    return false
  }
  if (file) {
    state.fileName = file.name
    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = (result) => {
      // 图片base64化
      const newUrl = result.target?.result
      const img: HTMLImageElement = document.createElement('img')

      img.src = newUrl as string
      let timmer = setInterval(() => {
        if (reader.readyState === 2) {
          clearInterval(timmer)
          if (
            !props.sizeChange &&
            props.smallToUpload &&
            img.width <= props.cutWidth &&
            img.height <= props.cutHeight
          ) {
            props.isFinishClose && close()
            emit('confirm', {
              fileName: fileName.value,
              file,
            })
            return
          }
          const imgHeight = img.height
          const imgWidth = img.width
          const { boxWidth, boxHeight } = props
          let rate: number
          let drawImg = { ...state.drawImg }

          drawImg.img = img
          state.scaleImg.rate = imgWidth / imgHeight // 缩放时用到此参数
          if (imgHeight < boxHeight && imgWidth < boxWidth) {
            rate = 1
            drawImg.x = (boxWidth - imgWidth) / 2
            drawImg.y = (boxHeight - imgHeight) / 2
          } else {
            if (imgWidth / imgHeight <= boxWidth / boxHeight) {
              // 计算宽高比
              rate = boxHeight / imgHeight
              drawImg.x = (boxWidth - imgWidth * rate) / 2
            } else {
              rate = boxWidth / imgWidth
              drawImg.y = (boxHeight - imgHeight * rate) / 2
            }
          }
          drawImg.swidth = imgWidth
          drawImg.sheight = imgHeight
          drawImg.width = imgWidth * rate
          drawImg.height = imgHeight * rate
          drawImg.x = (boxWidth - drawImg.width) / 2
          drawImg.y = (boxHeight - drawImg.height) / 2
          state.drawImg = drawImg
          printImg()
          putToolBox()
        }
      }, 200)
    }
  }
}
const putToolBox = () => {
  if (
    state.toolBox.width === props.boxWidth / 2 ||
    state.toolBox.height === props.boxHeight / 2 ||
    props.saveCutPosition === false
  ) {
    state.toolBox.width = props.cutWidth > props.boxWidth ? props.boxWidth : props.cutWidth
    state.toolBox.height = props.cutHeight > props.boxHeight ? props.boxHeight : props.cutHeight
  }
  if ((state.toolBox.x === 0 && state.toolBox.y === 0) || props.saveCutPosition === false) {
    state.toolBox.x = props.boxWidth / 2 - state.toolBox.width / 2
    state.toolBox.y = props.boxHeight / 2 - state.toolBox.height / 2
  }
  checkToolBoxOverflow().then(() => {
    printImg()
  })

  drawControlBox(state.toolBox.width, state.toolBox.height, state.toolBox.x, state.toolBox.y)
}
const isSupportFileApi = () => {
  if (
    window.File &&
    window.FileList &&
    window.FileReader &&
    window.Blob &&
    navigator.userAgent.indexOf('Edge') === -1 &&
    navigator.userAgent.indexOf('MSIE') === -1 &&
    navigator.userAgent.indexOf('Trident') === -1
  ) {
    return true
  }
  return false
}

// 将daturl转换为file对象
const dataURLtoFile = (dataurl: string, fileName: string) => {
  //将图片转换为Base64
  let arr = dataurl.split(',') as any[],
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  if (isSupportFileApi()) {
    let file = new File([u8arr], fileName, { type: mime })
    return file
  }
  throw '不支持File对象'
}
// 清除canvas内容以及相关参数
const clearAll = () => {
  const c = canvasRef.value
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, c.width, c.height)

  const c1 = canvasSelectBoxRef.value
  const ctx1 = c1.getContext('2d')
  ctx1.clearRect(0, 0, c1.width, c1.height)

  const { sx, sy } = state.drawImg
  state.drawImg = { ...defDrawImg, sx, sy }
  state.isFlipHorizontal = false
  state.isFlipVertically = false
  inputFileRef.value.value = ''
  state.rotateImg.angle = 0
  resetRotate()
  clearCutImageObj()
  emit('clearAll')
}

// 删除创建的图片对象
const clearCutImageObj = () => {
  if (state.cutImageObj !== null && state.cutImageObj !== undefined) {
    if (typeof state.cutImageObj.remove === 'function') {
      state.cutImageObj.remove()
    }
  }
  state.cutImageObj = null
}

// 开始绘制图片
const drawControlBox = (width: number, height: number, x: number, y: number) => {
  const { boxWidth, boxHeight } = props
  const { width: drawImgWidth, height: drawImgHeight, x: drawImgX, y: drawImgY } = state.drawImg
  // 裁剪框是否能够超出图片
  if (!props.toolBoxOverflow) {
    // 如果不允许超出图片范围 则也不允许反选
    if (width < 1) {
      width = 1
    }
    if (height < 1) {
      height = 1
    }
    if (width > drawImgWidth) {
      width = drawImgWidth
    }
    if (height > drawImgHeight) {
      height = drawImgHeight
    }
    if (x < state.drawImg.x) {
      x = state.drawImg.x
    }
    if (y < drawImgY) {
      y = drawImgY
    }
    if (x > drawImgX + drawImgWidth - width) {
      x = drawImgX + drawImgWidth - width
    }
    if (y > drawImgY + drawImgHeight - height) {
      y = drawImgY + drawImgHeight - height
    }
  }
  // 阻止超出裁剪控件边界
  if (width > boxWidth) {
    width = boxWidth
  }
  if (height > boxHeight) {
    height = boxHeight
  }
  if (x < 0) {
    x = 0
  }
  if (y < 0) {
    y = 0
  }
  const $toolBoxControl = toolBoxControlRef.value
  const c = canvasSelectBoxRef.value
  const ctx = c.getContext('2d')

  ctx.fillStyle = state.selectBoxColor
  ctx.clearRect(0, 0, c.width, c.height)
  ctx.fillRect(0, 0, c.width, c.height)

  let toolBoxControlWidth: number, toolBoxControlHeight: number

  if (props.rate && props.rate !== '') {
    if (ratio.value >= 1) {
      toolBoxControlWidth = width
      toolBoxControlHeight = width / ratio.value
      if (toolBoxControlHeight + y > drawImgY + drawImgHeight) {
        toolBoxControlHeight = drawImgY + drawImgHeight - y
        toolBoxControlWidth = toolBoxControlHeight * ratio.value
      }
    } else {
      toolBoxControlWidth = height * ratio.value
      toolBoxControlHeight = height
    }
  } else {
    toolBoxControlWidth = width
    toolBoxControlHeight = height
  }
  state.toolBox.width = Math.abs(toolBoxControlWidth)
  state.toolBox.height = Math.abs(toolBoxControlHeight)

  $toolBoxControl.style.width = Math.abs(toolBoxControlWidth) + 'px'
  $toolBoxControl.style.height = Math.abs(toolBoxControlHeight) + 'px'

  state.toolBox.boxMove.moveTo.x = x
  state.toolBox.boxMove.moveTo.y = y
  if (toolBoxControlWidth < 0) {
    x = x + toolBoxControlWidth
  }
  if (toolBoxControlHeight < 0) {
    y = y + toolBoxControlHeight
  }

  if (x + state.toolBox.width > boxWidth) {
    x = boxWidth - state.toolBox.width
  }
  if (x < 0) {
    x = 0
  }
  if (y + state.toolBox.height > boxHeight) {
    y = boxHeight - state.toolBox.height
  }
  if (y < 0) {
    y = 0
  }

  state.toolBoxPosition.x = x
  state.toolBoxPosition.y = y

  $toolBoxControl.style.left = x + 'px'
  $toolBoxControl.style.top = y + 'px'

  ctx.clearRect(x, y, Math.abs(toolBoxControlWidth), Math.abs(toolBoxControlHeight))
  if (state.printImageTimmer) {
    clearTimeout(state.printImageTimmer)
  }
  state.printImageTimmer = setTimeout(() => {
    cropImage(true)
  }, 100)
}

// 判断裁剪框是否超出图片
const checkToolBoxOverflow = () => {
  return new Promise<void>((resolve) => {
    if (!props.toolBoxOverflow) {
      const { width, height, x, y } = state.toolBox
      const { width: drawImgWidth, height: drawImgHeight, x: drawImgX, y: drawImgY } = state.drawImg
      // 如果裁剪框不能超出图片 则先判断图片尺寸
      // 如果图片尺寸长宽都超过裁剪框 不做处理
      // 如果图片尺寸小于裁剪框 将图片缩放至合适尺寸
      if (drawImgWidth < width || drawImgHeight < height) {
        const p = drawImgWidth / drawImgHeight
        if (drawImgWidth < width) {
          state.drawImg.width = width
          state.drawImg.height = width / p
        }
        if (state.drawImg.height < height) {
          state.drawImg.height = height
          state.drawImg.width = drawImgHeight * p
        }
        // 根据图片缩放重新调整位置
        state.drawImg.x = (props.boxWidth - drawImgWidth) / 2
        state.drawImg.y = (props.boxHeight - drawImgHeight) / 2
      }
      // 检查图片坐标是否超出
      console.log('state.drawImg.y > state.toolBox.y', drawImgY + drawImgHeight, y + height)
      // 判断左右边界
      if (drawImgX > x) {
        state.drawImg.x = x
      }
      if (drawImgX + drawImgWidth < x + width) {
        state.drawImg.x = x + width - drawImgWidth
      }
      // 判断上下边界
      if (drawImgY > y) {
        state.drawImg.y = y
      }
      if (drawImgY + drawImgHeight < y + height) {
        state.drawImg.y = y + height - drawImgHeight
      }
    }
    resolve()
  })
}
const scaleImgWheel = (e: WheelEvent) => {
  if (state.drawImg.img && props.scaleAble) {
    let scale = 1
    // e是FF的事件。window.event是chrome/ie/opera的事件
    const ee = e || (window.event as WheelEvent)
    if (ee.deltaY) {
      //IE/Opera/Chrome
      scale = -(ee.deltaY / 40)
    } else if (ee.detail) {
      //Firefox
      scale = ee.detail
    }
    const { width, x, y } = state.drawImg
    let widthLimit = 50
    state.drawImg.x = state.drawImg.width - scale * 9 > widthLimit ? x + scale * 3 : x
    state.drawImg.y = state.drawImg.width - scale * 9 > widthLimit ? y + scale * 3 : y
    state.drawImg.width = state.drawImg.width - scale * 9 > widthLimit ? width - scale * 9 : widthLimit
    state.drawImg.height = width / state.scaleImg.rate

    checkToolBoxOverflow().then(() => {
      printImg()
      if (state.printImageTimmer) {
        clearTimeout(state.printImageTimmer)
      }
      state.printImageTimmer = setTimeout(() => {
        cropImage(true)
      }, 100)
    })
  }
  e.preventDefault()
  return false
}
const resetToolBox = () => {
  const { width, height, x, y } = state.toolBox
  if (width < 0) {
    state.toolBox.boxMove.moveTo.x = x - width
  }
  if (state.toolBox.height < 0) {
    state.toolBox.boxMove.moveTo.y = y - height
  }
  state.toolBox.width = Math.abs(width)
  state.toolBox.height = Math.abs(height)
}
// toolBoxMouseDown
const toolBoxMouseDown = (e: MouseEvent) => {
  const $toolBox = toolBoxControlRef.value
  state.toolBox.x = parseInt($toolBox.style.left.split('px')[0])
  state.toolBox.y = parseInt($toolBox.style.top.split('px')[0])
  state.toolBox.disable = false
  state.dropImg.active = false
  state.toolBox.boxMove.start = {
    x: e.pageX,
    y: e.pageY,
  }
}
const toolBoxMouseMove = (e: MouseEvent) => {
  if (state.dropImg.active) {
    dropImgMove(e)
  }
  if (!state.toolBox.disable && props.moveAble) {
    const offsetX = e.pageX - state.toolBox.boxMove.start.x
    const offsetY = e.pageY - state.toolBox.boxMove.start.y
    const x = state.toolBox.x + offsetX
    const y = state.toolBox.y + offsetY
    drawControlBox(state.toolBox.width, state.toolBox.height, x, y)
  }
}
const toolBoxMouseLeave = () => {
  state.toolBox.disable = true
  if (state.printImageTimmer) {
    clearTimeout(state.printImageTimmer)
  }
  state.printImageTimmer = setTimeout(() => {
    cropImage(true)
  }, 100)
  resetToolBox()
}
const toolBoxMouseUp = () => {
  const { x, y } = state.toolBoxPosition
  state.toolBox.x = x
  state.toolBox.y = y
  state.toolBox.disable = true
  state.dropImg.active = false
  resetToolBox()
}

// 绘制图片
const printImg = () => {
  if (state.drawImg.img) {
    const canv: HTMLCanvasElement = canvasRef.value
    const ctx = canv.getContext('2d') as CanvasRenderingContext2D
    // 文字水印
    ctx.font = '18px bold 黑体'
    ctx.fillStyle = '#ff0'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.save()
    ctx.clearRect(0, 0, canv.width, canv.height)
    ctx.translate(state.drawImg.x + state.drawImg.width / 2, state.drawImg.y + state.drawImg.height / 2)
    ctx.rotate((state.rotateImg.angle * Math.PI) / 180)
    ctx.translate(-(state.drawImg.x + state.drawImg.width / 2), -(state.drawImg.y + state.drawImg.height / 2))
    ctx.translate(state.drawImg.x, state.drawImg.y)
    ctx.scale(state.isFlipHorizontal ? -1 : 1, state.isFlipVertically ? -1 : 1)
    ctx.drawImage(
      state.drawImg.img,
      state.drawImg.sx,
      state.drawImg.sy,
      state.drawImg.swidth,
      state.drawImg.sheight,
      state.isFlipHorizontal ? -state.drawImg.width : 0,
      state.isFlipVertically ? -state.drawImg.height : 0,
      state.drawImg.width,
      state.drawImg.height
    )
    ctx.translate(-state.drawImg.x, state.drawImg.y)

    ctx.restore()
    if (state.printImageTimmer) {
      clearTimeout(state.printImageTimmer)
    }
    state.printImageTimmer = setTimeout(() => {
      cropImage(true)
    }, 100)
  }
}
// 拖动图片
const dropImgOn = (e: MouseEvent) => {
  if (props.imgMove) {
    state.dropImg.active = true
    state.dropImg.params = { ...state.drawImg }
    state.dropImg.pageX = e.pageX
    state.dropImg.pageY = e.pageY
  }
}
const dropImgOff = () => {
  state.dropImg.active = false
  if (state.printImageTimmer) {
    clearTimeout(state.printImageTimmer)
  }
  state.printImageTimmer = setTimeout(() => {
    cropImage(true)
  }, 100)
}
const dropImgMove = (e: MouseEvent) => {
  if (state.dropImg.active && state.drawImg.img) {
    let drawImg = { ...state.drawImg }
    drawImg.x = state.dropImg.params.x - (state.dropImg.pageX - e.pageX)
    drawImg.y = state.dropImg.params.y - (state.dropImg.pageY - e.pageY)
    // 裁剪框是否能够超出图片
    if (!props.toolBoxOverflow) {
      if (drawImg.x > state.toolBox.x) {
        drawImg.x = state.toolBox.x
      }
      if (drawImg.x < state.toolBox.x + state.toolBox.width - drawImg.width) {
        drawImg.x = state.toolBox.x + state.toolBox.width - drawImg.width
      }

      if (drawImg.y > state.toolBox.y) {
        drawImg.y = state.toolBox.y
      }
      if (drawImg.y < state.toolBox.y + state.toolBox.height - drawImg.height) {
        drawImg.y = state.toolBox.y + state.toolBox.height - drawImg.height
      }
    }
    // this.$set(this, 'drawImg', drawImg);
    state.drawImg = drawImg
    printImg()
    e.stopPropagation()
  }
}
// 缩放
const resetScale = () => {
  state.drawImg.width = state.drawImg.swidth
  state.drawImg.height = state.drawImg.sheight
  printImg()
}

// 反向翻转
const flipDirection = (direction: FlipDirection = 'horizontal') => {
  if (!state.drawImg.img) return
  if (direction === 'horizontal') {
    state.isFlipHorizontal = !state.isFlipHorizontal
  } else {
    state.isFlipVertically = !state.isFlipVertically
  }
  printImg()
}

// 旋转
const rotate = (angle: number) => {
  const startAngle = state.rotateImg.angle
  const turnAngle = startAngle + angle
  if (turnAngle >= -180 && turnAngle <= 180) {
    state.rotateImg.angle = turnAngle
    state.rotateControl.position = (turnAngle / 180) * 100 + 100
    printImg()
  }
}
const resetRotate = () => {
  state.rotateImg.angle = 0
  state.rotateControl.position = 100
  printImg()
}
// control box
const controlBtnMouseDown = (e: MouseEvent, btnName: string) => {
  state.controlBox.disable = false
  state.controlBox.btnName = btnName
  state.controlBox.start.x = e.clientX
  state.controlBox.start.y = e.clientY
  state.controlBox.start.width = state.toolBox.width
  state.controlBox.start.height = state.toolBox.height
  e.stopPropagation()
}
const controlBtnMouseUp = (e: MouseEvent) => {
  state.controlBox.disable = true
  dropImgOff()
  resetToolBox()
  toolBoxMouseUp()
  e.stopPropagation()
}

const controlBtnMouseMove = (e: MouseEvent) => {
  if (state.controlBox.disable === false) {
    const offsetX = e.clientX - state.controlBox.start.x
    const offsetY = e.clientY - state.controlBox.start.y
    let x = 0,
      y = 0

    if (state.controlBox.btnName == 'leftUp') {
      if (!props.rate) {
        x = state.toolBox.x + offsetX
        y = state.toolBox.y + offsetY
      } else {
        if (ratio.value >= 1) {
          x = state.toolBox.x + offsetX
          y = state.toolBox.y + offsetX / ratio.value
        } else {
          x = state.toolBox.x + offsetY * ratio.value
          y = state.toolBox.y + offsetY
        }
      }
      state.toolBox.width = state.controlBox.start.width - offsetX
      state.toolBox.height = state.controlBox.start.height - offsetY
    }
    if (state.controlBox.btnName == 'rightUp') {
      if (!props.rate) {
        x = state.toolBox.x
        y = state.toolBox.y + offsetY
      } else {
        if (ratio.value >= 1) {
          x = state.toolBox.x
          y = state.toolBox.y - offsetX / ratio.value
        } else {
          x = state.toolBox.x
          y = state.toolBox.y + offsetY
        }
      }
      state.toolBox.width = state.controlBox.start.width + offsetX
      state.toolBox.height = state.controlBox.start.height - offsetY
    }
    if (state.controlBox.btnName == 'rightDown') {
      x = state.toolBox.x
      y = state.toolBox.y
      state.toolBox.width = state.controlBox.start.width + offsetX
      state.toolBox.height = state.controlBox.start.height + offsetY
    }
    if (state.controlBox.btnName == 'leftDown') {
      if (!props.rate) {
        x = state.toolBox.x + offsetX
        y = state.toolBox.y
      } else {
        if (ratio.value >= 1) {
          x = state.toolBox.x + offsetX
          y = state.toolBox.y
        } else {
          x = state.toolBox.x + -offsetY * ratio.value
          y = state.toolBox.y
        }
      }
      state.toolBox.width = state.controlBox.start.width - offsetX
      state.toolBox.height = state.controlBox.start.height + offsetY
    }
    if (state.controlBox.btnName == 'topCenter') {
      x = state.toolBox.x
      y = state.toolBox.y + offsetY
      state.toolBox.width = state.controlBox.start.width
      state.toolBox.height = state.controlBox.start.height - offsetY
    }
    if (state.controlBox.btnName == 'downCenter') {
      x = state.toolBox.x
      y = state.toolBox.y
      state.toolBox.width = state.controlBox.start.width
      state.toolBox.height = state.controlBox.start.height + offsetY
    }
    if (state.controlBox.btnName == 'leftCenter') {
      x = state.toolBox.x + offsetX
      y = state.toolBox.y
      state.toolBox.width = state.controlBox.start.width - offsetX
      state.toolBox.height = state.controlBox.start.height
    }
    if (state.controlBox.btnName == 'rightCenter') {
      x = state.toolBox.x
      y = state.toolBox.y
      state.toolBox.width = state.controlBox.start.width + offsetX
      state.toolBox.height = state.controlBox.start.height
    }
    drawControlBox(state.toolBox.width, state.toolBox.height, x, y)
  }
  e.stopPropagation()
}

const canvasToDataUrl = (canvas: HTMLCanvasElement) => {
  return canvas.toDataURL(`image/${props.fileType}`, props.quality)
}

// 重新定义toBlob方法，做兼容处理
const resetToBlob = (canvas: HTMLCanvasElement) => {
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: (callback: any, type: string, quality: any) => {
        if ((window as any).atob) {
          setTimeout(() => {
            const binStr = atob(canvas.toDataURL(type, quality).split(',')[1])
            const len = binStr.length,
              arr = new Uint8Array(len)

            let NewBlob: Blob

            for (let i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i)
            }
            try {
              NewBlob = new Blob([arr], {
                type: `image/${props.fileType}`,
              })
              callback(NewBlob)
            } catch (e: any) {
              ;(window as any).BlobBuilder =
                (window as any).BlobBuilder ||
                (window as any).WebKitBlobBuilder ||
                (window as any).MozBlobBuilder ||
                (window as any).MSBlobBuilder
              if (e.name == 'TypeError' && (window as any).BlobBuilder) {
                const BlobBuilder = (window as any).BlobBuilder
                const bb = new BlobBuilder()
                bb.append(arr.buffer)
                NewBlob = bb.getBlob(`image/${props.fileType}`)
                callback(NewBlob)
              }
              if (e.name == 'InvalidStateError') {
                NewBlob = new Blob([arr.buffer], { type: `image/${props.fileType}` })
                callback(NewBlob)
              }
            }
          }, 200)
        } else {
          callback(false, {
            type: `image/${props.fileType}`,
          })
        }
      },
    })
  }
}

// 裁剪图片
const cropImage = (doNotReset: boolean, callback?: (dataFile: DataFile) => void) => {
  if (state.drawImg.img) {
    // get img
    const canvas: HTMLCanvasElement = canvasRef.value
    // 文字水印
    if (props.watermarkText && !doNotReset) {
      const ctx2 = canvas.getContext('2d') as CanvasRenderingContext2D

      ctx2.font = props.watermarkTextFont
      ctx2.fillStyle = props.watermarkTextColor
      ctx2.textAlign = 'right'
      ctx2.textBaseline = 'bottom'
      ctx2.fillText(
        props.watermarkText,
        state.toolBox.x + state.toolBox.width * props.watermarkTextX,
        state.toolBox.y + state.toolBox.height * props.watermarkTextY
      )
    }

    const tempImg = new Image()
    if (props.crossOrigin) {
      tempImg.crossOrigin = props.crossOriginHeader
    }
    tempImg.src = canvas.toDataURL(`image/${props.fileType}`, props.quality)
    resetToBlob(canvas)
    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = () => {
          const timmer = setInterval(() => {
            if (reader.readyState == 2) {
              clearInterval(timmer)
              const newCanv: HTMLCanvasElement = document.createElement('canvas')
              const ctx = newCanv.getContext('2d') as CanvasRenderingContext2D

              // 原图裁剪 originalGraph
              if (props.originalGraph == true) {
                const scale = state.drawImg.width / state.drawImg.swidth
                // 计算实际图像大小
                const transWidth = state.toolBox.width / scale
                const transHeight = state.toolBox.height / scale
                newCanv.width = transWidth
                newCanv.height = transHeight
                // 重新计算裁剪坐标
                const sx = (state.toolBox.x - state.drawImg.x) / scale
                const sy = (state.toolBox.y - state.drawImg.y) / scale
                const swidth = state.drawImg.swidth
                const sheight = state.drawImg.sheight
                ctx.translate(-sx, -sy)
                ctx.drawImage(state.drawImg.img as CanvasImageSource, 0, 0, swidth, sheight)
              } else {
                newCanv.width = state.toolBox.width
                newCanv.height = state.toolBox.height
                const params = state.toolBox
                const [w = 1, h = 1] = props.rate?.split(':') || []
                ctx.drawImage(
                  tempImg,
                  params.x,
                  params.y,
                  params.width,
                  w >= h ? params.width * ratio.value : params.width / ratio.value,
                  0,
                  0,
                  params.width,
                  w >= h ? params.width * ratio.value : params.width / ratio.value
                )
              }
              newCanv.toBlob(
                (newBlob) => {
                  const dataURL = canvasToDataUrl(newCanv)
                  const data: DataFile = {
                    fileName: fileName.value,
                    blob: newBlob as Blob,
                    file: dataURLtoFile(dataURL, fileName.value),
                    dataURL,
                  }
                  if (!doNotReset) {
                    props.isFinishClose && close()
                    emit('confirm', data)
                    callback && callback(data)
                  } else {
                    if (props.previewMode) {
                      emit('realTime', data)
                      callback && callback(data)
                    }
                  }
                },
                `image/${props.fileType}`,
                props.quality
              )
            }
          }, 200)
        }
      } else {
        // IE9及以下
        const newCanv = document.createElement('canvas')
        newCanv.width = state.toolBox.width
        newCanv.height = state.toolBox.height
        const ctx = newCanv.getContext('2d') as CanvasRenderingContext2D
        const params = state.toolBox
        ctx.drawImage(
          tempImg,
          params.x,
          params.y,
          params.width,
          params.width * ratio.value,
          0,
          0,
          params.width,
          params.width * ratio.value
        )
        const dataURL = canvasToDataUrl(newCanv)
        const data: DataFile = {
          fileName: fileName.value,
          file: dataURLtoFile(dataURL, fileName.value),
          dataURL,
        }
        if (!doNotReset) {
          props.isFinishClose && close()
          emit('confirm', data)
          callback && callback(data)
        } else {
          emit('realTime', data)
          callback && callback(data)
        }
      }
    })
  } else {
    if (!doNotReset) {
      console.warn('No picture selected')
      emit('error', {
        err: 1,
        msg: '没有选中图片',
      })
    }
  }
}
const scrollBarControlMove = (e: MouseEvent) => {
  if (state.rotateControl.active) {
    const offsetX = e.pageX - state.rotateControl.start.x
    let position = state.rotateControl.start.position + offsetX
    if (position <= 0) {
      position = 0
    }
    if (position >= 200) {
      position = 200
    }
    state.rotateControl.position = position
    state.rotateImg.angle = ((position - 100) / 100) * 180
    printImg()
  }
}
const scrollBarControlOn = (e: MouseEvent) => {
  state.rotateControl.active = true
  state.rotateControl.start.x = e.pageX
  state.rotateControl.start.y = e.pageY
  state.rotateControl.start.position = state.rotateControl.position
}
const scrollBarControlOff = () => {
  state.rotateControl.active = false
}

onMounted(() => {
  // 是否为弹窗模式
  if (props.isModal === false) {
    state.visible = true
    nextTick(() => {
      if (toolBoxRef.value) {
        toolBoxRef.value.onmousewheel = scaleImgWheel
        toolBoxRef.value?.addEventListener('DOMMouseScroll', scaleImgWheel)
      }
    })
  }
})

defineExpose({
  open,
  close,
  chooseImage,
  flipDirection,
  resetScale,
  rotate,
  resetRotate,
  cropImage,
})
</script>

<style lang="scss" scoped>
@import './animation.scss';
@import './index.scss';
</style>
