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
import InternService from '../services/InternService';
import { useNavigate } from 'react-router-dom';


const { RangePicker } = DatePicker;


const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

let isFormUpdated = false;


function InternAddingForm(props: {isEdit: boolean, intern?: Intern, teams: Team[], interns: Intern[]}) {

  const [form] = Form.useForm();
  const intern = props.intern;
  const navigate = useNavigate();

  const onFinish = (e: any) => {

    if(props.isEdit){
      //Handle update
    }
    else{
      const formValues = form.getFieldsValue();

      
      
      const newIntern: Intern = {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        id_no: formValues.id_no,
        phone_number: formValues.phone_number,
        email: formValues.email,
        uni: formValues.uni,
        major: formValues.major,
        grade: formValues.grade,
        gpa: formValues.gpa,
        team_id: formValues.team_id,
        birthday: formValues.birthday ? formValues.birthday.toISOString() : undefined,
        internship_starting_date: formValues.internshipDate[0].toISOString(),
        internship_ending_date: formValues.internshipDate[1].toISOString(),
        cv_url: "",
        photo_url: "",
        overall_success: undefined,
        assignment_grades: [],
      }

      console.log(newIntern);
      InternService.addIntern(newIntern);
    }


    if(props.isEdit){
      alert("Intern is updated!");
    }
    else {
      alert("Intern is added!");
      form.resetFields();
   }

   navigate(0);
  
  };

;
  

  useEffect(() => {
    console.log("hey");

    if (props.isEdit && intern) {

      const birthday = dayjs(intern.birthday);
      const internshipStartDate = dayjs(intern.internship_starting_date);
      const internshipEndDate = dayjs(intern.internship_ending_date);

      form.setFieldsValue({
        first_name: intern.first_name,
        last_name: intern.last_name,
        id_no: intern.id_no,
        email: intern.email,
        phone_number: intern.phone_number,
        uni: intern.uni,
        major: intern.major,
        grade: (intern.grade + ""),
        gpa: intern.gpa,
        team: intern.team_id,
        birthday: birthday,
        internshipDate: [internshipStartDate, internshipEndDate],
      });
      isFormUpdated = true;
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
          
        
        <Form.Item label="Name" name="first_name" rules={[{ required: true }]}>
          <Input required/>
        </Form.Item>
        
        <Form.Item label="Last Name" name="last_name" rules={[{ required: true }]}>
          <Input required/>
        </Form.Item>
        <Form.Item label="Personal ID" name="id_no" rules={[{ required: true }]} >
          <Input />
        </Form.Item>
        <Form.Item label="E-mail" name="email" rules={[
          { type: 'email', message: 'Please enter a valid email address', required: true },
        ]} >
          <Input />
        </Form.Item>
        <Form.Item label="Tel" name="phone_number" rules={[{ required: true }]} >
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
        <Form.Item label="Team" name="team_id" required>
            <Select>
                {props.teams.map(team => {
                  return(
                    <Select.Option value={team.team_id}>{team.team_name}</Select.Option>
                  )
                })}
            </Select>
        </Form.Item>
        
        <Form.Item label="Birthday" name="birthday">
          <DatePicker format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item label="Internship Date" name="internshipDate" rules={[{ required: true }]}>
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