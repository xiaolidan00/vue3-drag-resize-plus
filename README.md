# vue3-drag-resize-plus

## install

```sh
npm install vue3-drag-resize-plus
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
import {DragResizePlus} from './components/index.ts';

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
const onAction = (op: any) => {
  console.log('🚀 ~ App.vue ~ onAction ~ op:', op);
};
const onClick = (id: string | number) => {
  state.activeId = id;
};
```
