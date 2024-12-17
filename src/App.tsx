import { useEffect } from 'react';
import { DashboardState, IConfig, IEventCbCtx, dashboard, } from "@lark-base-open/js-sdk";
import './App.css';
import { Config } from './components/Config';
import { GlobalContext } from './hooks/useGlobal';
import { useTableData } from './hooks/useTableData';
import { Grid } from './components/Grid';
import { Button } from 'antd';


export default function App() {
  const value = useTableData()
  const isView = dashboard.state === DashboardState.View

  const handleConfigChange = (v: IEventCbCtx<IConfig>['data']) => {
    const { customConfig } = v
    const { setFilters, setFieldData, setTableData } = value

    // @ts-expect-error
    setFieldData(customConfig.fieldData)
    // @ts-expect-error
    setFilters(customConfig.filters)
    // @ts-expect-error
    setTableData(customConfig.tableData)

  }

  useEffect(() => {
    return dashboard.onConfigChange((v) => {
      handleConfigChange(v.data)
    })
  }, []);


  useEffect(() => {
    // 初始化获取配置
    dashboard.getConfig().then(v => {
      handleConfigChange(v)
    });
  }, []);


  const handleConfirm = () => {
    const { tableData, fieldData, filters } = JSON.parse(JSON.stringify(value))
    dashboard.saveConfig({
      dataConditions: [],
      customConfig: {
        tableData,
        fieldData,
        filters,
      }
    })
  }

  return (
    <GlobalContext.Provider value={value}>
      <div className='w-full flex h-full'>
        <div className='flex-1'><Grid /></div>
        {
          !isView && <div className='flex flex-col h-full'>
            <div className='flex-1'><Config /></div>
            <Button type="primary" onClick={handleConfirm} className='m-[12px]'>Confirm</Button>

          </div>
        }
      </div>
    </GlobalContext.Provider>
  );
}