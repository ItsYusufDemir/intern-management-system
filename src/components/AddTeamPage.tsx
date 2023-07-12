import {Form, Input, Select, Button} from "antd";
import {useState} from "react";

const AddTeamPage = () => {



    const onFinish = (e: any) =>{
      console.log(e);
    }


    const [textDisabled, setTextDisabled] = useState(true);

    const handleSelectWeek = (e: any) => {
      setTextDisabled(false);
      //Save the input in selected week
    }



    return (
      <>
        <h2>Add Team</h2>

        <Form
        style={{maxWidth: 400}}
        onFinish={onFinish}
        >

        <Form.Item label="Team Name" name="teamName">
          <Input required/>
        </Form.Item>

        <h2>Curriculum</h2>
        <Form.Item label="Week" name="grade">
            <Select onChange={handleSelectWeek}>
                <Select.Option value="1">1. Week</Select.Option>
                <Select.Option value="2">2. Week</Select.Option>
                <Select.Option value="3">3. Week</Select.Option>
                <Select.Option value="4">4. Week</Select.Option>
            </Select>
        </Form.Item>

        <Form.Item label="To-Do" name="toDo" style={{width: 800}}>
          <Input.TextArea rows={4} disabled={textDisabled} required/>
        </Form.Item>


        <br /><br />
        <Form.Item>
            <Button  htmlType='submit' type='primary' block>Add Team</Button>
        </Form.Item>
        </Form>


      

      </>
      );
}
 
export default AddTeamPage;