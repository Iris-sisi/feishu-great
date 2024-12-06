import { Button, Form, Input, Modal, Select } from "antd"
import { Fragment, useContext, useEffect, useState } from "react";
import { OPERATION } from "../utils/const";
import { GlobalContext } from "../hooks/useGlobal";
import { useWatch } from "antd/es/form/Form";
import { result } from "lodash-es";
import { FieldItem } from "../hooks/useTableData";



interface OptionItem {
    fieldId: string
    operator: OPERATION
    value: string
}



export const Filter = () => {
    const { fieldData: { render }, getValueSetByField } = useContext(GlobalContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [optionList, setOptionList] = useState<OptionItem[]>([])
    const [form] = Form.useForm();
    // 添加这个新的状态
    const [fieldOptions, setFieldOptions] = useState<Record<string, FieldItem[]>>({});

    // 添加这个新的effect
    const handleValuesChange = async (changedValues: any, allValues: any) => {
        if (changedValues.options) {
            const changedOption = changedValues.options;
            Object.keys(changedOption).forEach(async (key) => {
                const fieldId = changedOption[key].fieldId;
                if (fieldId) {
                    const result = await getValueSetByField(fieldId);
                    setFieldOptions(prev => ({
                        ...prev,
                        [fieldId]: result.set
                    }));
                }
            });
        }
    };

    // form 里面有filter的具体规则，然后应用这些规则。在grid展示的时候，就好了

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }



    return <>
        <div className="mb-[16px]">
          <Button onClick={handleOpenModal}>Filter</Button>
       </div>
        <Modal title="Custom Filter" open={isModalOpen} onOk={handleCloseModal} onCancel={handleCloseModal} onClose={handleCloseModal} width={800}>

            <Form form={form} initialValues={{ items: optionList }}
                onValuesChange={handleValuesChange}
                className="px-[16px]"
            >
                <Form.List name="options">
                    {
                        (fields, { add, remove }) => {

                            return <Fragment>
                                <div className="mb-[24px]">
                                    <Button onClick={add}>Add</Button>
                                </div>
                                {/* <Button onClick={remove}>remove</Button> */}

                                {fields.map((item, index) => <div className="flex gap-[24px] mb-[16px]" key={index}>
                                    <Form.Item name={[item.name, 'fieldId']}
                                    style={{minWidth: '200px'}}>
                                        <Select>
                                            {
                                                render.map(item => {
                                                    return <Select.Option key={item.value}>{item.label}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name={[item.name, 'operator']}
                                    style={{minWidth: '150px'}}>
                                        <Select >
                                            {
                                                Object.values(OPERATION).map(item => {
                                                    return <Select.Option key={item}>{item}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name={[item.name, 'value']}
                                    style={{minWidth: '200px'}}>
                                     <Select>
                                        {fieldOptions[form.getFieldValue(['options', item.name, 'fieldId'])]?.map(option => (
                                            <Select.Option key={option.recordId} value={option.value.text}>
                                                 {option.value.text}
                                            </Select.Option>
                                        ))}
                                     </Select>
                                    </Form.Item>
                                </div>)
                                }
                            </Fragment>
                        }
                    }
                </Form.List>
            </Form>
        </Modal>

    </>
}