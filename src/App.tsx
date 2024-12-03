import { useEffect } from 'react';
import { DashboardState, dashboard, } from "@lark-base-open/js-sdk";
import './App.css';
import { Config } from './components/Config';
import { GlobalContext } from './hooks/useGlobal';
import { useTableData } from './hooks/useTableData';
import { Grid } from './components/Grid';


export default function App() {
  const value = useTableData()
  // 展示态
  useEffect(() => {
    if (dashboard.state === DashboardState.View) {
      dashboard.getData().then(data => {
        console.log('dashboard getData', DashboardState.View, data)
      });
      dashboard.onDataChange(async (res) => {
        console.log('dashboard onDataChange', DashboardState.View, res)
      })
    }
  }, [])

  return (
    <GlobalContext.Provider value={value}>
      <div className='w-full flex'>
        <div className='flex-1'><Grid /></div>
        <Config />
      </div>
    </GlobalContext.Provider>
  );
}