import { FieldItem, FilterItem } from "../types/type";
import { OPERATION } from "./const";

export function filterData(list: FieldItem[], filters: FilterItem[]): FieldItem[] {

    if (!filters.length) {
        return list;
    }

    return list.filter(item => {
        // 所有过滤条件都必须满足
        return filters.every(filter => {
            // 检查是否是同一个字段


            const itemValue = item.value?.text || String(item.value);


            switch (filter.operator) {
                case OPERATION.Is:
                    return itemValue === filter.value;

                case OPERATION.ISNot:
                    return itemValue !== filter.value;

                case OPERATION.Contains:
                    return itemValue.toLowerCase()
                        .includes(filter.value.toLowerCase());

                case OPERATION.DoesNotContain:
                    return !itemValue.toLowerCase()
                        .includes(filter.value.toLowerCase());

                default:
                    return true;
            }
        });
    });
}