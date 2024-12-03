import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GlobalContext } from '../hooks/useGlobal';
import { useRect } from '../hooks/useRect';
import { FieldItem } from '../hooks/useTableData';
import { useAsyncEffect } from 'ahooks';
import { METRIC } from '../utils/const';

interface State<T = FieldItem> {
  xList: T[];
  yList: T[];
  keyList: T[];
}

export const Grid = () => {
  const { fieldData, delimiter, getValueSetByField } = useContext(GlobalContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const {
    rect: { width },
    handleResize,
  } = useRect(ref);
  const [state, setState] = useState<State>({ xList: [], yList: [], keyList: [] });

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

  useAsyncEffect(async () => {
    const { key, x, y } = fieldData;
    if (!key || !x || !y) return;
    const [{ origin: xList }, { origin: yList }, { origin: keyList }] = await Promise.all([
      getValueSetByField(x),
      getValueSetByField(y),
      getValueSetByField(key),
    ]);
    setState({ xList, yList, keyList });
  }, [fieldData.key, fieldData.x, fieldData.y]);

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
      [METRIC.PERSON]: list.join(delimiter),
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

  return (
    <div className="w-full p-[16px]" style={{ paddingLeft: `${width}px` }}>
      <div
        className="relative grid"
        style={{ ...xStyle, background: `linear-gradient(90deg, #ffffff 0%, #f96b19 50%, #ffffff 100%)` }}
      >
        {yList.map((y, i) => (
          <Fragment key={i}>
            {xList.map((x, j) => {
              return (
                <div className="min-h-[100px] flex items-center justify-center" key={j}>
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
          <div className="py-[10px] flex items-center justify-center" key={i}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
