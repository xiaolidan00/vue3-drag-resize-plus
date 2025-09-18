export type DragResizePlusProps = {
  id: string | number;
  isEdit?: boolean;
  isActive?: boolean;
  isSelect?: boolean;
  activeClazz?: string;
  dragClazz?: string;
  rect: CardRect;
  /**是否距离提示线 */
  isGuideLine?: boolean;
  /**距离提示大小 */
  guideDistance?: number;
  /**是否可磁吸 */
  isNear?: boolean;
  /**磁吸距离 */
  nearStep?: number;
  parentWidth: number;
  parentHeight: number;
  elmts: CardConfig[];
  unscale?: number;
  guideLineColor?: string;
  guideTextColor?: string;
  guideBgColor?: string;
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
export type CardRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};
export type CardConfig = {
  id: string;
  rect: CardRect;
};
export type GuideLineType = {
  value?: number;
  style: any;
  isElmt?: boolean;
};
