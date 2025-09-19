import Vue3DragResizePlus from './DragResizePlus.vue';
import {type App} from 'vue';
import {useGuideLine as guideLine} from './useGuideLine';
export const DragResizePlus = Vue3DragResizePlus;
export const useGuideLine = guideLine;
export default {
  install: (app: App) => {
    app.component('DragResizePlus', Vue3DragResizePlus);
    app.component('drag-resize-plus', Vue3DragResizePlus);
  }
};
/**大小和位置 */
export type CardRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};
/**对比距离的组件配置 */
export type CardConfig = {
  id: string;
  rect: CardRect;
};
export type GuideLineType = {
  value?: number;
  style: any;
  isElmt?: boolean;
};
export type DragResizePlusEvent = {
  event: MouseEvent;
  target: HTMLDivElement;
  type: 'dragStart' | 'dragMove' | 'dragEnd' | 'resizeStart' | 'resizeMove' | 'resizeEnd';
  actionType: string;
  rect: CardRect;
};
export type DragResizePlusProps = {
  /**ID */
  id: string | number;
  /**是否可编辑 (可选中和可激活) 默认true*/
  isEdit?: boolean;
  /**是否激活 边框高亮+操作点 =>拖拽和调整大小 默认true */
  isActive?: boolean;
  /**是否选中 边框高亮 默认true*/
  isSelect?: boolean;
  /**是否可拖拽移动 默认true*/
  isDrag?: boolean;
  /**是否可调整大小 默认true*/
  isResize?: boolean;
  /**激活class 默认active*/
  activeClazz?: string;
  /**拖动class 默认dragging*/
  dragClazz?: string;
  /**大小和位置*/
  rect: CardRect;
  /**是否显示距离提示线 默认true*/
  isGuideLine?: boolean;
  /**距离提示大小 默认50*/
  guideDistance?: number;
  /**是否可磁吸 默认true*/
  isNear?: boolean;
  /**磁吸距离 默认5*/
  nearStep?: number;
  /**父级容器宽度*/
  parentWidth?: number;
  /**父级容器高度*/
  parentHeight?: number;
  /**所有需要对比距离的组件*/
  elmts: CardConfig[];
  /**反缩放大小 1/scale 默认1*/
  unscale?: number;
  /**距离提示线颜色 默认red*/
  guideLineColor?: string;
  /**距离提示文本颜色 默认white*/
  guideTextColor?: string;
  /**距离提示文本背景颜色 默认#FF6347*/
  guideBgColor?: string;
  /**操作点是否显示 默认全true**/
  points?: {
    'left-top': boolean;
    'center-top': boolean;
    'right-top': boolean;
    'left-middle': boolean;
    'right-middle': boolean;
    'left-bottom': boolean;
    'center-bottom': boolean;
    'right-bottom': boolean;
  };
};
