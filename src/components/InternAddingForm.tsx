import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {Intern} from "../models/Intern";
import moment from 'moment';
import { Team } from '../models/Team';


const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};



function InternAddingForm(props: {isEdit: boolean, intern?: Intern, teams: Team[], interns: Intern[], onSave: (intern: Intern | undefined) => void}) {

  const [form] = Form.useForm();
  const intern = props.intern;

  const onFinish = (e: any) => {
    

    props.onSave(intern);
  };


  useEffect(() => {
    if (intern) {
      form.setFieldsValue({
        name: intern.name,
        lastName: intern.lastName,
        tel: intern.tel,
        uni: intern.uni,
        major: intern.major,
        grade: intern.grade,
        gpa: intern.gpa,
        team: intern.team,
        //birthday: intern.birthday,
        //internshipDate: [moment(intern.internshipStartingDate), moment(intern.internshipEndingDate)],
        
      });
    } else {
      form.resetFields(); // Reset the form fields if not in edit mode
    }
  }, [intern, form]);


  




  return (

    <>
      {props.isEdit ? (
        <h2>Edit Intern</h2>
      ) : (
        <h2>Add Intern</h2>
      )}
      
      <Form
        layout="horizontal"
        style={{ maxWidth: 400 }}
        onFinish={onFinish}
        form={form}>
          
        
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input required/>
        </Form.Item>
        
        <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
          <Input required/>
        </Form.Item>
        <Form.Item label="Tel" name="tel" required>
          <Input />
        </Form.Item>
        <Form.Item label="University" name="uni">
          <Input />
        </Form.Item>
        <Form.Item label="Major" name="major">
          <Input/>
        </Form.Item>
        <Form.Item label="Grade" name="grade">
            <Select>
                <Select.Option value="1">1. Grade</Select.Option>
                <Select.Option value="2">2. Grade</Select.Option>
                <Select.Option value="3">3. Grade</Select.Option>
                <Select.Option value="4">4. Grade</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item label="GPA" name="gpa">
          <InputNumber/>
        </Form.Item>
        <Form.Item label="Team" name="team" required>
            <Select>
                <Select.Option value="1">Full Stack</Select.Option>
                <Select.Option value="2">Embedded</Select.Option>
            </Select>
        </Form.Item>
        
        <Form.Item label="Birthday" name="birthday">
          <DatePicker format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item label="Internship Date" name="internshipDate" required>
          <RangePicker format="DD-MM-YYYY" />
        </Form.Item>
        
        
        <Form.Item valuePropName="fileList" getValueFromEvent={normFile} name="cv">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload CV</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item valuePropName="fileList" getValueFromEvent={normFile} name="photo">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload Photo</div>
            </div>
          </Upload>
        </Form.Item>
  
        <Form.Item>
            <div><Button  htmlType='submit' type='primary' block>{props.isEdit ? (<>Edit Intern</>) : (<>Add Intern</>)}</Button></div>
        </Form.Item>
      </Form>
    </>
  );
};

export default InternAddingForm;