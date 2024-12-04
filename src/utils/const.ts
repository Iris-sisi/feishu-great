export const METRIC = {
    RATE: 'rate',
    Value: 'value',
}
export const metricList = [{
    value: METRIC.RATE,
    label: 'Rate',
}, {
    value: METRIC.Value,
    label: 'Value',
}]

export enum OPERATION {
    Equal = 'Equal',
    NoEqual = 'NoEqual',
    Contain = 'Contain'
}