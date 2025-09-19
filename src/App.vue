<template>
    <div>
        <label>
            缩放比例
            <input v-model="state.scale" :step="0.1" type="range" :min="0.5" :max="3"></input>
        </label>
        <label>
            是否可编辑
            <input v-model="state.isEdit" type="checkbox"></input>
        </label>

        <label>
            是否可磁吸
            <input v-model="state.isNear" type="checkbox"></input>
        </label>
        <label v-show="state.isNear">
            磁吸距离
            <input v-model="state.scale" type="range" :min="5" :max="50"></input>
        </label>
        <label>
            距离提示线
            <input v-model="state.isGuideLine" type="checkbox"></input>
        </label>

        <label v-show="state.isGuideLine">
            距离提示大小
            <input v-model="state.guideDistance" type="number"></input>
        </label>
        <label>
            操作点
            <input v-model="state.points['left-top']" type="checkbox" />左上
            <input v-model="state.points['center-top']" type="checkbox" />中上
            <input v-model="state.points['right-top']" type="checkbox" />右上

            <input v-model="state.points['left-middle']" type="checkbox" />左中
            <input v-model="state.points['right-middle']" type="checkbox" />右中

            <input v-model="state.points['left-bottom']" type="checkbox" />左下
            <input v-model="state.points['center-bottom']" type="checkbox" />中下
            <input v-model="state.points['right-bottom']" type="checkbox" />右下
        </label>
    </div>
    <div class="demo-container" :style="{
        transform: `scale(${state.scale})`
    }">
       <DragResizePlus
  :key="item.id"
  :id="item.id"
  :is-active="state.activeId === item.id"
  :unscale="unscale"
  :parent-width="state.screenWidth"
  :parent-height="state.screenHeight"
  v-for="item in state.elmts"
  :elmts="state.elmts"
  v-model:rect="item.rect"
  :isEdit="state.isEdit"
  :isNear="state.isNear"
  :nearStep="state.nearStep"
  :isGuideLine="state.isGuideLine"
  :guideDistance="state.guideDistance"
  @dragStart="onAction"
  @dragMove="onAction"
  @dragEnd="onAction"
  @resizeStart="onAction"
  @resizeMove="onAction"
  @resizeEnd="onAction"
  @click="onClick(item.id)"
  :points="state.points"
  >{{ item.title }}
</DragResizePlus>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { DragResizePlus } from "vue3-drag-resize-plus";
import 'vue3-drag-resize-plus/index.css'
const mockList: any[] = [];

for (let i = 0; i < 5; i++) {
    mockList.push({
        rect: {
            left: i * 100,
            top: i * 100,
            width: i % 2 ? 200 : 100,
            height: 100
        },
        id: i + 1,
        title: "卡片" + (i + 1)
    });
}
const state = reactive({
    screenWidth: 1920,
    screenHeight: 1080,
    elmts: mockList,
    scale: 1,
    isEdit: true,
    isNear: true,
    nearStep: 5,
    isGuideLine: true,
    guideDistance: 100,
    activeId: -1 as (string | number),
    points: {
        "left-top": true,
        "center-top": true,
        "right-top": true,
        "left-middle": true,
        "right-middle": true,
        "left-bottom": true,
        "center-bottom": true,
        "right-bottom": true
    }
});
const unscale = computed(() => 1 / state.scale)
const onAction = (op:any) => {
// console.log('🚀 ~ App.vue ~ onAction ~ op:', op)

}
const onClick = (id: string | number) => {
    state.activeId = id
};
</script>

<style lang="scss">
.demo-container {
    position: absolute;
    width: 1920px;
    height: 1080px;
    transform-origin: left top;
    background-color: #505050;
}

.drp-drag-card {
    background-color: yellow;
}
</style>
