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
