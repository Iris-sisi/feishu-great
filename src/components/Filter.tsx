import { Button, Form, Input, Modal, Select } from "antd"
import { Fragment, useContext, useState } from "react";
import { OPERATION } from "../utils/const";
import { GlobalContext } from "../hooks/useGlobal";
import { useWatch } from "antd/es/form/Form";



interface OptionItem {
    fieldId: string
    operator: OPERATION
    value: string
}



export const Filter = () => {
    const { fieldData: { render } } = useContext(GlobalContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [optionList, setOptionList] = useState<OptionItem[]>([])
    const [form] = Form.useForm();

    // form 里面有filter的具体规则，然后应用这些规则。在grid展示的时候，就好了

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }



    return <>
        <Button onClick={handleOpenModal}>Filter </Button>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleCloseModal} onCancel={handleCloseModal} onClose={handleCloseModal}>

            <Form form={form} initialValues={{ items: optionList }}
                onValuesChange={(v) => {
                    console.log(v)
                }}
            >
                <Form.List name="options">
                    {
                        (fields, { add, remove }) => {

                            return <Fragment>
                                <Button onClick={add}>Add</Button>
                                {/* <Button onClick={remove}>remove</Button> */}

                                {fields.map((item, index) => <div className="flex gap-[8px]" key={index}>
                                    <Form.Item name={[item.name, 'fieldId']}>
                                        <Select>
                                            {
                                                render.map(item => {
                                                    return <Select.Option key={item.value}>{item.label}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name={[item.name, 'operator']}>
                                        <Select >
                                            {
                                                Object.values(OPERATION).map(item => {
                                                    return <Select.Option key={item}>{OPERATION[item]}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name={[item.name, 'value']}>
                                        <Input />
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