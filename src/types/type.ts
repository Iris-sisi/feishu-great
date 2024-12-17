import { IField, ITable } from "@lark-base-open/js-sdk";
import { OPERATION } from "../utils/const";

export interface TableData {
    source: ITable[],
    render: { value: string, label: string }[]
    currentTableId?: string
}

export interface FieldItem { recordId: string; fieldId: string, value: any }

export interface FieldBase {
    x: string
    xValue: string
    y: string
    yValue: string
    key: string
    metric: string[]
}

export interface FieldData extends Partial<FieldBase> {
    tableId: string
    source: IField[],
    render: { value: string, label: string }[]
}

export interface FilterItem {
    fieldId: string
    operator: OPERATION
    value: string
}