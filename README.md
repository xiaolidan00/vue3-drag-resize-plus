# vue3-drag-resize-plus

- 拖拽移动
- 调整大小
- 距离提示
- 磁吸
- 缩放适配

![image](./demo.gif)

## install

```sh
npm install vue3-drag-resize-plus
# 或者
pnpm add vue3-drag-resize-plus
```

## usage

```html
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
```

```ts
import {computed, reactive} from 'vue';
import {DragResizePlus} from 'vue3-drag-resize-plus';
import 'vue3-drag-resize-plus/index.css';

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
    title: '卡片' + (i + 1)
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

  activeId: -1 as string | number,
  points: {
    'left-top': true,
    'center-top': true,
    'right-top': true,
    'left-middle': true,
    'right-middle': true,
    'left-bottom': true,
    'center-bottom': true,
    'right-bottom': true
  }
});
const unscale = computed(() => 1 / state.scale);
const onAction = (op: DragResizePlusEvent) => {
  console.log('🚀 ~ App.vue ~ onAction ~ op:', op);
};
const onClick = (id: string | number) => {
  state.activeId = id;
};
```

## attributes

| 属性名         | 说明                                       | 类型              |
| -------------- | ------------------------------------------ | ----------------- |
| id             | 【必填】 ID                                | `string` `number` |
| rect           | 【必填】 大小和位置                        | `CardRect`        |
| isEdit         | 是否可编辑 (可选中和可激活) 默认 true      | `boolean`         |
| isActive       | 边框高亮+操作点 =>拖拽和调整大小 默认 true | `boolean`         |
| isSelect       | 是否选中 边框高亮 默认 true                | `boolean`         |
| isDrag         | 是否可拖拽移动 默认 true                   | `boolean`         |
| isResize       | 是否可调整大小 默认 true                   | `boolean`         |
| activeClazz    | 激活 class 默认 active                     | `string`          |
| dragClazz      | 拖动 class 默认 dragging                   | `string`          |
| isGuideLine    | 是否显示距离提示线 默认 true               | `boolean`         |
| guideDistance  | 距离提示大小 默认 50                       | `number`          |
| parentWidth    | 父级容器宽度 开启距离提示时必填            | `number`          |
| parentHeight   | 父级容器高度 开启距离提示时必填            | `number`          |
| elmts          | 所有需要对比距离的组件 开启距离提示时必填  | `CardConfig`      |
| guideLineColor | 距离提示线颜色 默认 red                    | `string`          |
| guideTextColor | 距离提示文本颜色 默认 white                | `string`          |
| guideBgColor   | 距离提示文本背景颜色 默认#FF6347           | `string`          |
| isNear         | 是否可磁吸 前提是开启距离提示 默认 true    | `boolean`         |
| nearStep       | 磁吸距离 默认 5                            | `number`          |
| unscale        | 反缩放大小 1/scale 默认 1                  | `number`          |
| points         | 操作点是否显示 默认全 true                 | 请看下面          |

操作点配置

```ts
{
    'left-top': boolean;
    'center-top': boolean;
    'right-top': boolean;
    'left-middle': boolean;
    'right-middle': boolean;
    'left-bottom': boolean;
    'center-bottom': boolean;
    'right-bottom': boolean;
  }
```

大小和位置

```ts
export type CardRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};
```

对比距离的组件配置

```ts
export type CardConfig = {
  id: string;
  rect: CardRect;
};
```

## events

拖拽和移动抛出的事件类型

```ts
export type DragResizePlusEvent = {
  event: MouseEvent;
  target: HTMLDivElement;
  type: 'dragStart' | 'dragMove' | 'dragEnd' | 'resizeStart' | 'resizeMove' | 'resizeEnd';
  actionType: string;
  rect: CardRect;
};
```

| 事件名        | 说明               | 类型                    |
| ------------- | ------------------ | ----------------------- |
| 'update:rect' | 同步更新大小和位置 | rect: CardRect          |
| resizeStart   | 调整大小开始       | op: DragResizePlusEvent |
| resizeMove    | 调整大小进行中     | op: DragResizePlusEvent |
| resizeEnd     | 调整大小结束       | op: DragResizePlusEvent |
| dragStart     | 拖拽移动开始       | op: DragResizePlusEvent |
| dragMove      | 拖拽移动进行中     | op: DragResizePlusEvent |
| dragEnd       | 拖拽移动结束       | op: DragResizePlusEvent |
| click         | 点击               | ev: MouseEvent          |
| dblclick      | 双击               | ev: MouseEvent          |
| contextmenu   | 右击               | ev: MouseEvent          |
