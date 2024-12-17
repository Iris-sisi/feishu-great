import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GlobalContext } from '../hooks/useGlobal';
import { useRect } from '../hooks/useRect';
import { useAsyncEffect } from 'ahooks';
import { METRIC } from '../utils/const';
import { FieldItem } from '../types/type';
import { filterData } from '../utils/common';
import { filter } from 'lodash-es';

interface State<T = FieldItem> {
  xList: T[];
  yList: T[];
  keyList: T[];
}

export const Grid = () => {
  const { fieldData, filters, delimiter, getValueSetByField, getValueListByField } = useContext(GlobalContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const {
    rect: { width },
    handleResize,
  } = useRect(ref);
  const [state, setState] = useState<State>({ xList: [], yList: [], keyList: [] });

  // 坐标轴，数据
  const { xList, yList } = useMemo(() => {
    const { xValue, yValue } = fieldData;
    const resolveData = (s?: string) => {
      return s?.split(delimiter) || [];
    };
    return {
      xList: resolveData(xValue),
      yList: resolveData(yValue),
    };
  }, [fieldData]);


  // 渲染数据
  useAsyncEffect(async () => {
    const { key, x, y } = fieldData;
    const filtersOptions = filters || []
    if (!key || !x || !y) return;
    const [{ origin: xList }, { origin: yList }, { origin: originKeyList }, filterFieldList] = await Promise.all([
      getValueSetByField(x),
      getValueSetByField(y),
      getValueSetByField(key),
      (await Promise.all(filtersOptions.filter(f => f.fieldId).map(f => getValueListByField(f.fieldId)))).flat()
    ]);
    const keyList = originKeyList.filter(k => {
      const matchFilter = filterData(filterFieldList, filtersOptions)
      if (!matchFilter.length) return true
      return matchFilter.some(f => f.recordId === k.recordId)
    })
    setState({ xList, yList, keyList });
  }, [fieldData.key, fieldData.x, fieldData.y, filters]);

  const renderCell = (x?: string, y?: string) => {
    const { keyList, yList, xList } = state;
    const { metric } = fieldData;
    if (!keyList) return '';
    const matchX = xList?.filter((k) => k?.value.text === x);
    const matchY = yList?.filter((k) => k?.value.text === y);
    const matchKey = matchX?.filter((k) => matchY?.some((i) => i?.recordId === k?.recordId));

    const list = keyList
      .filter(({ recordId }) => matchKey?.some((v) => v?.recordId === recordId))
      .map((v) => v.value.text);

    const map = {
      [METRIC.Value]: list.join(delimiter),
      [METRIC.RATE]: `${((list.length / keyList.length) * 100).toFixed(1)}%`,
    };
    return metric
      ?.map((m) => map[m])
      .filter(Boolean)
      .join(delimiter);
  };

  useEffect(handleResize, [yList]);

  if (!xList.length || !yList.length) {
    return null;
  }

  const xStyle = {
    gridTemplateColumns: `repeat(${xList?.length},1fr)`,
  };
  const calculateColor = (index: number, total: number): string => {
    if (index === total - 1) {
      // 最右边的颜色固定为 #f96b19
      return '#f96b19';
    }
    // 起始颜色: 浅橙色 (#ffffff)
    const startColor = { r: 253, g: 242, b: 233 }; // 浅橙色
    // 结束颜色: 橙色 (#f96b19)
    const endColor = { r: 249, g: 107, b: 25 }; // 橙色
    // 当前列在总列中的比例
    const ratio = index / (total - 1);
    // 根据比例计算 RGB 值（线性插值）
    const r = Math.round(startColor.r + ratio * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + ratio * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + ratio * (endColor.b - startColor.b));
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="w-full h-full p-[16px] border border-gray-400 flex flex-col" style={{ paddingLeft: `${width}px` }}>
      <div
        className="relative flex-1 grid border-collapse"
        style={{ ...xStyle, background: `linear-gradient(90deg, #ffffff 0%, #f96b19 50%, #ffffff 100%)` }}
      >
        {yList.map((y, i) => (
          <Fragment key={i}>
            {xList.map((x, j) => {
              return (
                <div className="flex items-center justify-center border border-gray-200" key={j}
                  style={{ backgroundColor: calculateColor(j, xList.length) }}>
                  {renderCell(x, y)}
                </div>
              );
            })}
          </Fragment>
        ))}

        {/* y 轴的标记 */}
        <div className="flex absolute flex-col h-full translate-x-[-100%]" ref={ref}>
          {yList.map((item, i) => (
            <div className="px-[10px] flex-1 flex items-center justify-center" key={i}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* x 轴的标记 */}
      <div className="grid" style={xStyle}>
        {xList.map((item, i) => (
          <div className="py-[10px] flex items-center justify-center text-center" key={i}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};