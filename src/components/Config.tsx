import { FC, useContext } from 'react';
import { Form, Input, Select } from 'antd';
import { GlobalContext } from '../hooks/useGlobal';
import { FieldBase } from '../hooks/useTableData';
import { metricList } from '../utils/const';

export interface FormParams extends FieldBase {
  tableId: string;
}

export const Config: FC<{}> = () => {
  const {
    tableData: { render: tableList, currentTableId },
    fieldData: { render: fieldList, x, y },
    setTableId,
    setField,
    getValueSetByField,
    delimiter,
  } = useContext(GlobalContext);

  const [form] = Form.useForm<Partial<FormParams>>();

  const resolveData = async (newVal: string) => {
    const { set } = await getValueSetByField(newVal);
    return { text: set.map((l) => l.value.text).join(delimiter) };
  };

  const handleValuesChange = async (newVal: Partial<FormParams>) => {
    if ('x' in newVal) {
      const { text } = await resolveData(newVal.x!);
      setField({ x: newVal.x, xValue: text });
      form.setFieldValue('xValue', text);
    } else if ('y' in newVal) {
      const { text } = await resolveData(newVal.y!);
      setField({ y: newVal.y, yValue: text });
      form.setFieldValue('yValue', text);
    } else if ('tableId' in newVal) {
      setTableId(newVal.tableId)
    } else {
      setField(newVal);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ tableId: currentTableId }}
      className="w-[300px] p-[16px]"
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="Select Table" name="tableId">
        <Select>
          {tableList.map((item) => (
            <Select.Option key={item.value}>{item.label}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Select X" name="x">
        <Select>
          {fieldList
            .filter((item) => item.value !== y)
            .map((item) => (
              <Select.Option key={item.value}>{item.label}</Select.Option>
            ))}
        </Select>
      </Form.Item>
      {x && (
        <Form.Item name="xValue">
          <Input.TextArea autoSize />
        </Form.Item>
      )}

      <Form.Item label="Select Y" name="y">
        <Select>
          {fieldList
            .filter((item) => item.value !== x)
            .map((item) => (
              <Select.Option key={item.value}>{item.label}</Select.Option>
            ))}
        </Select>
      </Form.Item>
      {y && (
        <Form.Item name="yValue">
          <Input.TextArea autoSize />
        </Form.Item>
      )}

      {x && y && (
        <>
          <Form.Item label="Select Key" name="key">
            <Select>
              {fieldList
                .filter((item) => ![x, y].includes(item.value))
                .map((item) => (
                  <Select.Option key={item.value}>{item.label}</Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="" name="metric">
            <Select mode="multiple">
              {metricList.map((item) => (
                <Select.Option key={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      )}
    </Form>
  );
};
