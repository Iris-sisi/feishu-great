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
    Is = 'is',
    ISNot = 'is not',
    Contains = 'Contains',
    DoesNotContain = 'does not contain'
}