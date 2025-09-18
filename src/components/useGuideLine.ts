import type {CardConfig, CardRect, GuideLineType} from './index';

function getXDistance(props: CardRect, rect: CardRect): {s: number[]; n: number[]; minn: number; mins: number} {
  const a: number[] = [rect.left, rect.left + rect.width, rect.left + rect.width * 0.5];
  const b: number[] = [props.left, props.left + props.width, props.left + props.width * 0.5];
  const n: number[] = [];
  const s: number[] = [];
  let minn = Number.MAX_SAFE_INTEGER;
  let mins = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const v = a[i]! - b[j]!;
      const d = Math.min(a[i]!, b[j]!);
      n.push(v);
      s.push(d);
      if (Math.abs(v) < Math.abs(minn)) {
        minn = v;
        mins = d;
      }
    }
  }
  return {s, n, minn, mins};
}
function getYDistance(props: CardRect, rect: CardRect): {s: number[]; n: number[]; minn: number; mins: number} {
  const a: number[] = [rect.top, rect.top + rect.height, rect.top + rect.height * 0.5];
  const b: number[] = [props.top, props.top + props.height, props.top + props.height * 0.5];
  const n: number[] = [];
  const s: number[] = [];
  let minn = Number.MAX_SAFE_INTEGER;
  let mins = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const v = a[i]! - b[j]!;
      const d = Math.min(a[i]!, b[j]!);
      n.push(v);
      s.push(d);
      if (Math.abs(v) < Math.abs(minn)) {
        minn = v;
        mins = d;
      }
    }
  }
  return {s, n, minn, mins};
}

const TEXT_HEIGHT = 16;

/**
 *
 * @param {Object} activeElement 参考元素
 * @param {Array} elmts 元素list
 * @param {DOM} el 父元素id
 * @returns {Object} {h:横向辅助线，v:纵向辅助线}
 */
export function useGuideLine(
  ids: (string | number)[],
  activeRect: CardRect,
  elmts: CardConfig[],
  screenWidth: number,
  screenHeight: number,
  nearD: number = 100
) {
  const {left, top, width, height} = activeRect;

  const posH: GuideLineType[] = [
    //左距离
    {
      style: {
        left: 0,
        top: top + height * 0.5 - TEXT_HEIGHT + 'px',
        width: left + 'px'
      },
      value: left
    },
    //右距离
    {
      style: {
        right: 0,
        top: top + height * 0.5 - TEXT_HEIGHT + 'px',
        width: screenWidth - (left + width) + 'px'
      },
      value: screenWidth - (left + width)
    },
    //宽度
    {
      style: {
        left: left + 'px',
        top: top + height * 0.5 - TEXT_HEIGHT + 'px',
        width: width + 'px',
        justifyContent: 'flex-start',
        border: 'none',
        paddingLeft: '10px'
      },
      value: height
    },
    //上边界
    {
      style: {
        left: 0,
        top: top + 'px',
        width: '100%',
        borderBottom: 'dashed 1px'
      }
    },
    //下边界
    {
      style: {
        left: 0,
        top: top + height + 'px',
        width: '100%',
        borderBottom: 'dashed 1px'
      }
    }
  ];
  const posV: GuideLineType[] = [
    //上距离
    {
      style: {
        left: left + width * 0.5 + 'px',
        top: 0,
        height: top + 'px'
      },
      value: top
    },
    //下距离
    {
      style: {
        left: left + width * 0.5 + 'px',
        bottom: 0,
        height: screenHeight - (top + height) + 'px'
      },
      value: screenHeight - (top + height)
    },
    //高度
    {
      style: {
        left: left + width * 0.5 + 'px',
        top: top + 'px',
        height: height + 'px',
        alignItems: 'flex-start',
        border: 'none',

        paddingTop: '10px'
      },
      value: height
    },
    //左边界
    {
      style: {
        left: left + 'px',
        top: 0,
        height: '100%',
        borderLeft: 'dashed 1px'
      }
    },
    //右边界
    {
      style: {
        left: left + width + 'px',
        top: 0,
        height: '100%',
        borderLeft: 'dashed 1px'
      }
    }
  ];

  const nearLineH: GuideLineType[] = [];
  const nearLineV: GuideLineType[] = [];
  const idsMap: {[n: string]: boolean} = {};
  ids.forEach((a) => {
    idsMap[a] = true;
  });
  elmts.forEach((elmt) => {
    const {mins: xs, minn: xn} = getXDistance(elmt.rect, activeRect);
    const {mins: ys, minn: yn} = getYDistance(elmt.rect, activeRect);
    if (!idsMap[elmt.id]) {
      const dx = Math.round(Math.abs(xn));
      const dy = Math.round(Math.abs(yn));

      if (dx > 0 && dx <= nearD) {
        nearLineH.push({
          style: {
            left: xs + 'px',
            top: elmt.rect.top + elmt.rect.height * 0.5 - TEXT_HEIGHT + 'px',
            width: dx + 'px'
          },
          isElmt: true,
          value: Math.round(xn)
        });
      }
      if (dy > 0 && dy <= nearD) {
        nearLineV.push({
          style: {
            left: elmt.rect.left + elmt.rect.width * 0.5 + 'px',
            top: ys + 'px',
            height: dy + 'px'
          },
          isElmt: true,
          value: Math.round(yn)
        });
      }
    }
  });

  return {
    h: posH.concat(nearLineH),
    v: posV.concat(nearLineV)
  };
}
