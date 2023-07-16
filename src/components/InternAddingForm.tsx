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
import moment, { Moment } from 'moment';
import { Team } from '../models/Team';
import dayjs from 'dayjs';


const { RangePicker } = DatePicker;


const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

let isFormUpdated = false;


function InternAddingForm(props: {isEdit: boolean, intern?: Intern, teams: Team[], interns: Intern[], onSave: (intern: Intern | undefined) => void}) {

  const [form] = Form.useForm();
  const intern = props.intern;

  const onFinish = (e: any) => {
    

    props.onSave(intern);
  };

;
  

  useEffect(() => {

    if (intern && !isFormUpdated) {

      const birthday = dayjs(intern.birthday);
      const internshipStartDate = dayjs(intern.internshipStartingDate);
      const internshipEndDate = dayjs(intern.internshipEndingDate);

      form.setFieldsValue({
        name: intern.name,
        lastName: intern.lastName,
        id: intern.id,
        email: intern.email,
        tel: intern.tel,
        uni: intern.uni,
        major: intern.major,
        grade: (intern.grade + ""),
        gpa: intern.gpa,
        team: intern.team.name,
        birthday: birthday,
        internshipDate: [internshipStartDate, internshipEndDate],
      });
      isFormUpdated = true;
    } else {
      form.resetFields(); // Reset the form fields if not in edit mode
    }
  }, [intern]);


  




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
        <Form.Item label="Personal ID" name="id" >
          <Input />
        </Form.Item>
        <Form.Item label="E-mail" name="email" rules={[
          { type: 'email', message: 'Please enter a valid email address' },
        ]} >
          <Input />
        </Form.Item>
        <Form.Item label="Tel" name="tel" >
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
                {props.teams.map(team => {
                  return(
                    <Select.Option value={team.name}>{team.name}</Select.Option>
                  )
                })}
            </Select>
        </Form.Item>
        
        <Form.Item label="Birthday" name="birthday">
          <DatePicker format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item label="Internship Date" name="internshipDate">
          <RangePicker format="DD-MM-YYYY"/>
        </Form.Item>
        
        
        <Form.Item valuePropName="fileList" getValueFromEvent={normFile} name="cv">
          <Upload action="/upload.do" listType="picture-card" accept='.pdf,.docx,doc'maxCount={1}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload CV</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item valuePropName="fileList" getValueFromEvent={normFile} name="photo">
          <Upload action="/upload.do" listType="picture-card"  accept='.jpg,.png'maxCount={1}>
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