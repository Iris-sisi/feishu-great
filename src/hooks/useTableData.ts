import { bitable, IField, ITable } from "@lark-base-open/js-sdk";
import { useEffect, useState } from "react";
import { FieldBase, FieldData, FieldItem, FilterItem, TableData } from "../types/type";

export const useTableData = () => {
  const [tableData, setTableData] = useState<TableData>({ source: [], render: [] });
  const [fieldData, setFieldData] = useState<FieldData>({ source: [], render: [] })
  const [filters, setFilters] = useState<FilterItem[]>([])

  const getTableList = async () => {
    const res = await bitable.base.getTableList();
    setTableData({
      source: res,
      render: await Promise.all(res.map(async r => ({ value: r.id, label: await r.getName() }))),
      currentTableId: res[0]?.id
    })
    return res
  }

  const getFieldListByTable = async (table: ITable) => {
    return await table.getFieldList()
  }

  const getDataByTable = async (table: ITable) => {
    const fields = await getFieldListByTable(table)
    return await Promise.all(fields.map(async field => await field.getFieldValueList()))
  }

  const getValueListByField = async (fieldId: string) => {
    const field = fieldData.source.find(f => f.id === fieldId)!
    const fieldResult = await field.getFieldValueList()
    return fieldResult.reduce((prev, curr) => {
      const { record_id, value } = curr
      if (!value) return prev
      if (Array.isArray(value)) {
        return prev.concat(value.map(v => ({ recordId: record_id, fieldId, value: v })))
      }
      if (typeof value === 'object') {
        return prev.concat({ recordId: record_id, fieldId, value })
      }
      return prev.concat({ recordId: record_id, fieldId, value: { text: value } })
    }, [] as FieldItem[])
  }

  const getValueSetByField = async (fieldId: string) => {
    const list = await getValueListByField(fieldId)
    const set = new Set()
    const result: FieldItem[] = []
    list.forEach(l => {
      const { text } = l.value
      if (!set.has(text)) {
        set.add(text)
        result.push(l)
      }
    })
    return {
      origin: list,
      set: result
    }
  }

  const setTableId = async (tableId?: string) => {
    if (!tableId) {
      return
    }
    const table = await bitable.base.getTableById(tableId)
    const res = await getFieldListByTable(table)

    setFieldData({
      source: res,
      render: await Promise.all(res.map(async r => ({ value: r.id, label: await r.getName() })))
    })
  }

  const setField = async (newVal: Partial<FieldBase>) => {
    setFieldData((prevValue) => ({ ...prevValue, ...newVal }))
  }

  useEffect(() => {
    getTableList()
  }, [])

  useEffect(() => {
    setTableId(tableData.currentTableId)
  }, [tableData.currentTableId])

  return {
    tableData,
    fieldData,
    filters,
    setFilters,
    getTableList,
    getDataByTable,
    getFieldListByTable,
    setTableId,
    setField,
    getValueListByField,
    getValueSetByField,
    delimiter: ","
  }
}

