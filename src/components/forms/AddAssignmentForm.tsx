import { DatePicker, Form, Input, InputNumber } from "antd";
import { useForm } from "antd/es/form/Form";
import { Assignment } from "../../models/Assignment";
import { useEffect } from "react";

interface PropType {
    assignment?: Assignment,
    isDone?: boolean,
    setIsDone: React.Dispatch<React.SetStateAction<boolean>>
    doesPressed: boolean
    setDoesPressed: React.Dispatch<React.SetStateAction<boolean>>
}

const AddAssignmentForm: React.FC<PropType> = ({assignment, isDone, setIsDone, doesPressed, setDoesPressed}) => {


    const [form] = useForm();

    const onFinish = () => {
        console.log("finished");
        if(assignment) { //Do the update

        }
        else{
            const formValues = form.getFieldsValue();

            const newAssignemnt: Assignment = {
                description: formValues.description,
                deadline: formValues.deadline,
                weight: formValues.weight,
                complete: false,
            }

            addAssignment(newAssignemnt);
            form.resetFields();
        }
    }

    const addAssignment = (newAssignemnt: Assignment) => {
        try {
            //add assignemnt
        } catch (error) {
            
        }
        finally {
            setIsDone(true);
            setDoesPressed(false);
        }
    }

    useEffect(() => {
        if(doesPressed) {
            form.submit();
        }
    }, [doesPressed])

    return (
        <>
        <Form
            style={{width: 400}}
            onFinish={onFinish}
            labelCol={{span: 5}}
            wrapperCol={{span: 14}}
            form={form}>

            <Form.Item label="Description" name="description" rules={[{required: true, message: "Describe the assignment!"}]}>
                <Input.TextArea showCount
                    maxLength={250}
                    style={{ height: 200, marginBottom: 10, width: 400}}/>
            </Form.Item>

            <Form.Item label="Deadline" name="Deadline">
                <DatePicker format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item label="Weight" name="weight">
                <InputNumber/>
            </Form.Item>



        </Form>
        
        </>
      );
}
 
export default AddAssignmentForm;