<template>
  <div
    :data-id="id"
    :class="[
      'drp-drag-card',
      isEdit ? 'is-edit' : '',
      isEdit && (isSelect || isActive) ? activeClazz : '',
      isAction && state.isDrag ? 'dragging' : ''
    ]"
    @mousedown.self="onMouseDown('drag', $event)"
    @click.self="onAction('click', $event)"
    @dblclick.self="onAction('dblclick', $event)"
    @contextmenu.self="onAction('contextmenu', $event)"
    :style="cardStyle"
    ref="cardRef"
  >
    <div class="drp-drag-card-content" v-if="isEdit">
      <slot></slot>
    </div>
    <template v-else>
      <slot></slot>
    </template>
    <div v-if="isAction" class="drp-drag-card-handles">
      <span v-for="a in posList" :class="['drp-drag-card-handle', a.value]" :key="a.value"
        ><i v-if="a.show" :data-action="a.value" @mousedown="onMouseDown(a.value, $event)"></i>
      </span>
    </div>
  </div>

  <div
    class="drp-guide-line-h"
    :style="{...item.style, borderColor: props.guideLineColor}"
    :key="'h' + idx"
    v-for="(item, idx) in state.guideLineH"
  >
    <span v-if="item.value" :style="guideStyle"> {{ Math.round(Math.abs(item.value)) }}px</span>
  </div>
  <div
    class="drp-guide-line-v"
    :style="{...item.style, borderColor: props.guideLineColor}"
    :key="'v' + idx"
    v-for="(item, idx) in state.guideLineV"
  >
    <span v-if="item.value" :style="guideStyle"> {{ Math.round(Math.abs(item.value)) }}px</span>
  </div>
</template>

<script setup lang="ts">
  import {computed, onBeforeUnmount, reactive, ref, watch} from 'vue';
  import {type DragResizePlusProps, type CardRect, type GuideLineType} from './type';
  import {useGuideLine} from './useGuideLine';
  const cardRef = ref<HTMLDivElement>();
  const props = withDefaults(defineProps<DragResizePlusProps>(), {
    dragClazz: 'dragging',
    activeClazz: 'active',
    unscale: 1,
    isEdit: true,
    nearStep: 5,
    guideDistance: 50,
    isGuideLine: true,
    isNear: true,
    guideTextColor: 'white',
    guideBgColor: '#FF6347',
    guideLineColor: 'red',
    points: () => ({
      'left-top': true,
      'center-top': true,
      'right-top': true,
      'left-middle': true,
      'right-middle': true,
      'left-bottom': true,
      'center-bottom': true,
      'right-bottom': true
    })
  });
  const isAction = computed(() => props.isEdit && props.isActive);
  const emit = defineEmits([
    'click',
    'dblclick',
    'contextmenu',
    'update:rect',
    'resizeStart',
    'resizeMove',
    'resizeEnd',
    'dragStart',
    'dragMove',
    'dragEnd'
  ]);
  const guideStyle = computed(() => {
    return {
      background: props.guideBgColor,
      color: props.guideTextColor
    };
  });
  const onAction = (type: 'click' | 'dblclick' | 'contextmenu', event: MouseEvent) => {
    emit(type, event);
  };
  const state = reactive({
    guideLineH: [] as GuideLineType[],
    guideLineV: [] as GuideLineType[],
    isDrag: false
  });
  const cardStyle = computed(() => {
    return {
      left: props.rect.left + 'px',
      top: props.rect.top + 'px',
      width: props.rect.width + 'px',
      height: props.rect.height + 'px'
    };
  });
  const posList = computed(() =>
    props.isActive
      ? [
          {label: '左上', value: 'left-top', show: props.points['left-top']},
          {label: '中上', value: 'center-top', show: props.points['center-top']},
          {label: '右上', value: 'right-top', show: props.points['right-top']},
          {label: '左中', value: 'left-middle', show: props.points['left-middle']},
          {label: '右中', value: 'right-middle', show: props.points['right-middle']},
          {label: '左下', value: 'left-bottom', show: props.points['left-bottom']},
          {label: '中下', value: 'center-bottom', show: props.points['center-bottom']},
          {label: '右下', value: 'right-bottom', show: props.points['right-bottom']}
        ]
      : []
  );
  const pos = {
    x: 0,
    y: 0,
    offsetx: 0,
    offsety: 0,
    type: ''
  };
  const getGuideLines = (rect: CardRect, nearType?: 'resize' | 'drag') => {
    if (!props.isGuideLine) return;
    const {h, v} = useGuideLine(
      [props.id],
      rect,
      props.elmts,
      props.parentWidth,
      props.parentHeight,
      props.guideDistance
    );
    state.guideLineH = h;
    state.guideLineV = v;
    //磁吸
    if (props.isNear && nearType) {
      let minH = props.parentHeight;
      let minW = props.parentWidth;
      h.forEach((a) => {
        if (a.value && a.isElmt && Math.abs(a.value) <= props.nearStep && Math.abs(minW) > Math.abs(a.value)) {
          minW = a.value;
        }
      });
      v.forEach((a) => {
        if (a.value && a.isElmt && Math.abs(a.value) <= props.nearStep && Math.abs(minH) > Math.abs(a.value)) {
          minH = a.value;
        }
      });

      let top = 0,
        left = 0;
      let isMove = false;
      if (minH <= props.nearStep) {
        top -= minH;
        isMove = true;
      }
      if (minW <= props.nearStep) {
        left -= minW;
        isMove = true;
      }
      if (isMove) {
        if (nearType === 'drag') {
          const newRect = {
            left: rect.left + left,
            top: rect.top + top,
            width: rect.width,
            height: rect.height
          };
          getGuideLines(newRect);
          emit('update:rect', newRect);
        } else if (nearType === 'resize') {
          const str = pos.type.split('-');
          if (str[0] === 'left') {
            rect.left += left;
            rect.width -= left;
          } else if (str[0] === 'right') {
            rect.width += left;
          }
          if (str[1] === 'top') {
            rect.top += top;
            rect.height -= top;
          } else if (str[1] === 'bottom') {
            rect.height += top;
          }
          getGuideLines(rect);
          emit('update:rect', rect);
        }
      }
    }
  };

  const getRect = () => {
    const rect = {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };
    const str = pos.type.split('-');
    if (str[0] === 'left') {
      rect.left += pos.offsetx;
      rect.width -= pos.offsetx;
    } else if (str[0] === 'right') {
      rect.width += pos.offsetx;
    }
    if (str[1] === 'top') {
      rect.top += pos.offsety;
      rect.height -= pos.offsety;
    } else if (str[1] === 'bottom') {
      rect.height += pos.offsety;
    }
    return rect;
  };

  const onMouseMove = (ev: MouseEvent) => {
    if (!isAction.value) return false;
    pos.offsetx += ev.pageX - pos.x;
    pos.offsety += ev.pageY - pos.y;
    pos.x = ev.pageX;
    pos.y = ev.pageY;
    const target = cardRef.value!;
    if (pos.type === 'drag') {
      state.isDrag = true;
      const left = Math.round(pos.offsetx * props.unscale),
        top = Math.round(pos.offsety * props.unscale);
      target.style.transform = `translate(${left}px, ${top}px)`;
      const rect = props.rect;
      const newRect = {
        left: rect.left + left,
        top: rect.top + top,
        width: rect.width,
        height: rect.height
      };
      emit('dragMove', {
        event: ev,
        type: 'dragMove',
        target,
        actionType: pos.type,
        rect: newRect
      });

      getGuideLines(newRect);
    } else {
      const rect = getRect();

      const left = Math.round(rect.left * props.unscale),
        top = Math.round(rect.top * props.unscale);
      const width = Math.round(rect.width * props.unscale),
        height = Math.round(rect.height * props.unscale);
      target.style.width = width + props.rect.width + 'px';
      target.style.height = height + props.rect.height + 'px';

      target.style.transform = `translate(${left}px, ${top}px)`;
      const newRect = {
        left: left + props.rect.left,
        top: top + props.rect.top,
        width: width + props.rect.width,
        height: height + props.rect.height
      };
      emit('resizeMove', {
        event: ev,
        target,
        type: 'resizeMove',
        actionType: pos.type,
        rect: newRect
      });
      getGuideLines(newRect);
    }
  };
  const onMouseUp = (ev: MouseEvent) => {
    if (!isAction.value) return false;
    pos.offsetx += ev.pageX - pos.x;
    pos.offsety += ev.pageY - pos.y;
    pos.x = ev.pageX;
    pos.y = ev.pageY;
    document.onselectstart = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    const target = cardRef.value!;
    if (pos.type === 'drag') {
      state.isDrag = false;
      target.style.transform = '';
      const left = Math.round(pos.offsetx * props.unscale),
        top = Math.round(pos.offsety * props.unscale);
      const rect = props.rect;
      const newRect = {
        left: rect.left + left,
        top: rect.top + top,
        width: rect.width,
        height: rect.height
      };
      emit('update:rect', newRect);
      emit('dragEnd', {
        event: ev,
        type: 'dragEnd',
        target: cardRef.value,
        actionType: pos.type,
        rect: newRect
      });
      getGuideLines(newRect, 'drag');
    } else {
      const rect = getRect();
      const left = Math.round(rect.left * props.unscale),
        top = Math.round(rect.top * props.unscale);
      const width = Math.round(rect.width * props.unscale),
        height = Math.round(rect.height * props.unscale);
      const newRect = {
        left: left + props.rect.left,
        top: top + props.rect.top,
        width: width + props.rect.width,
        height: height + props.rect.height
      };
      target.style.transform = '';
      emit('update:rect', newRect);
      emit('resizeEnd', {
        event: ev,
        target: cardRef.value,
        type: 'resizeEnd',
        actionType: pos.type,
        rect: newRect
      });
      getGuideLines(newRect, 'resize');
    }
  };
  const onMouseDown = (type: string, ev: MouseEvent) => {
    if (!isAction.value) return false;

    pos.x = ev.pageX;
    pos.y = ev.pageY;
    pos.offsetx = 0;
    pos.offsety = 0;
    pos.type = type;
    getGuideLines(props.rect);
    if (type === 'drag') {
      state.isDrag = true;
      emit('dragStart', {
        event: ev,
        target: cardRef.value,
        type: 'dragStart',
        actionType: pos.type,
        rect: props.rect
      });
    } else {
      emit('resizeStart', {
        event: ev,
        target: cardRef.value,
        type: 'resizeStart',
        actionType: pos.type,
        rect: props.rect
      });
    }
    document.onselectstart = () => false;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  const onUnAction = () => {
    state.isDrag = false;
    state.guideLineH = [];
    state.guideLineV = [];
    document.onselectstart = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  watch(
    () => isAction.value,
    (v) => {
      if (!v) {
        onUnAction();
      } else {
        getGuideLines(props.rect);
      }
    }
  );
  onBeforeUnmount(() => {
    onUnAction();
  });
</script>

<style lang="scss">
  .drp-guide-line-h,
  .drp-guide-line-v {
    z-index: 9;
    pointer-events: none;
    display: inline-flex;
    position: absolute;
    align-items: center;
    justify-content: center;
  }
  .drp-guide-line-h > span,
  .drp-guide-line-v > span {
    display: inline-block;
    font-size: 14px;
    color: white;
    border-radius: 2px;
    padding: 0px 4px;
    line-height: 16px;
    user-select: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  .drp-guide-line-h > span {
    margin-bottom: 2px;
  }
  .drp-guide-line-v > span {
    margin-left: 2px;
  }
  .drp-guide-line-h {
    border-bottom: solid 1px;
  }
  .drp-guide-line-v {
    border-left: solid 1px;
  }
  .drp-drag-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: absolute;
    border: dashed 1px lightgray;
    &.is-edit {
      cursor: pointer;
      > * {
        pointer-events: none;
      }
    }
    &.draggging {
      cursor: move;
    }
    &.active {
      border: solid 1px dodgerblue;
    }
  }
  .drp-drag-card-content {
    flex: none;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .drp-drag-card-handles {
    flex: none;
    height: 100%;
    width: 100%;
    top: -100%;
    display: flex;
    position: relative;
    z-index: 2;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: hidden;
  }
  .drp-drag-card-handle {
    display: inline-flex;
    height: 33.33%;

    > i {
      height: 6px;
      width: 6px;
      position: relative;
      z-index: 3;
      pointer-events: auto;
      background-color: dodgerblue;
      user-select: none;
    }

    &.left-top {
      width: 33.33%;
      align-items: flex-start;
    }
    &.center-top {
      width: 33.33%;
      align-items: flex-start;
      justify-content: center;
    }
    &.right-top {
      width: 33.33%;
      align-items: flex-start;
      justify-content: flex-end;
    }
    &.left-middle {
      width: 50%;
      align-items: center;
    }

    &.right-middle {
      width: 50%;
      align-items: center;
      justify-content: flex-end;
    }

    &.left-bottom {
      width: 33.33%;
      align-items: flex-end;
    }
    &.center-bottom {
      width: 33.33%;
      bottom: 0px;
      justify-content: center;
      align-items: flex-end;
    }
    &.right-bottom {
      width: 33.33%;
      justify-content: flex-end;
      align-items: flex-end;
    }
    &.right-middle,
    &.left-middle {
      cursor: ew-resize;
    }
    &.center-bottom,
    &.center-top {
      cursor: ns-resize;
    }
    &.right-bottom,
    &.left-top {
      cursor: se-resize;
    }
    &.right-top,
    &.left-bottom {
      cursor: ne-resize;
    }
  }
</style>
