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
  UploadFile,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {Intern} from "../../models/Intern";
import { Team } from '../../models/Team';
import dayjs from 'dayjs';
import InternService from '../../services/InternService';
import UploadService from "../../services/UploadService";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../utils/useAxiosPrivate';
import { NoticeType } from 'antd/es/message/interface';
import useAuth from '../../utils/useAuth';


const { RangePicker } = DatePicker;


const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

let isFormUpdated = false;


interface PropType {
  intern?: Intern,
  teams: Team[],
  doesPressed?: boolean,
  setIsDone?: React.Dispatch<React.SetStateAction<boolean>>,
}


const InternAddingForm: React.FC<PropType> = ({intern, teams, doesPressed, setIsDone}) => {

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const axiosPrivate = useAxiosPrivate();
  const [photoList, setPhotoList] = useState<UploadFile []>([]);
  const [cvList, setCvList] = useState<UploadFile []>([]);
  const { auth }: any = useAuth();

  const [cv_url, setCv_url] = useState<string | null>();
  const [photo_url, setPhoto_url] = useState<string | null>();

  const onFinish = (e: any) => {

    const formValues = form.getFieldsValue();

    const newIntern: Intern = {
      intern_id: intern ? intern.intern_id : undefined,
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
      birthday: formValues.birthday ? formValues.birthday.unix() : undefined,
      internship_starting_date: formValues.internshipDate[0].unix(),
      internship_ending_date: formValues.internshipDate[1].unix(),
      cv_url: cv_url ? cv_url : (intern ? intern.cv_url : null),
      photo_url: photo_url ? photo_url : (intern ? intern.photo_url : null),
      overall_success: intern ? intern.overall_success : null,
    }

    if(intern){
      
      updateIntern(newIntern);
    }
    else{
      addIntern(newIntern);
    }
  
  };


  useEffect(() => {
    if(doesPressed) {
      form.submit();
    }
  }, [doesPressed])


  const addIntern = async (newIntern: Intern) => {
    try {
      await InternService.addIntern(axiosPrivate, newIntern);
      
      giveMessage("success", "Intern added");
      form.resetFields();
    } catch (error: any) {
      if (!error?.response) {
        giveMessage("error","No server response");
      } else if (error.response?.status === 409) {
        giveMessage("error", "Intern with given email is already exists");
      } else {
        giveMessage("error", "Error happened while adding intern");
      } 
    } finally {
        if(intern) {
          setIsDone!(true); 
        }
    }

  }

  const updateIntern = async (newIntern: Intern) => {
    try {
      await InternService.updateIntern(axiosPrivate, newIntern);

      giveMessage("success", "Intern updated");
    } catch (error: any) {
        if (!error?.response) {
          giveMessage("error","No server response");
        } else {
          giveMessage("error", "Error happened while adding intern");
        }
    } finally {
        if(intern) {
          setIsDone!(true); 
        }
    }
  }


  const addAccessToken = (url: string) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}access_token=${auth.accessToken}`;
}

  

  useEffect(() => {

    if (intern) {

      const birthday = dayjs(intern.birthday! * 1000);
      const internshipStartDate = dayjs(intern.internship_starting_date * 1000);
      const internshipEndDate = dayjs(intern.internship_ending_date * 1000);

      if(intern.photo_url) {
        const urlWithAccess = addAccessToken(intern.photo_url);
        setPhotoList([
          {
            uid: "-5",
            name: "photo",
            status: "done",
            url: urlWithAccess,
          },
        ])
      }

      if(intern.cv_url) {
        const urlWithAccess = addAccessToken(intern.cv_url);
        setCvList([
          {
            uid: "-5",
            name: "cv",
            status: "done",
            url: urlWithAccess,
          },
        ])
      }

      form.setFieldsValue({
        first_name: intern.first_name,
        last_name: intern.last_name,
        id_no: intern.id_no,
        email: intern.email,
        phone_number: intern.phone_number,
        uni: intern.uni ? intern.uni : undefined,
        major: intern.major ? intern.major : undefined,
        grade: intern.grade ? (intern.grade + "") : undefined,
        gpa: intern.gpa ? intern.gpa : undefined,
        team_id: intern.team_id,
        birthday: intern.birthday ? birthday : undefined,
        internshipDate: [internshipStartDate, internshipEndDate],
      });
      isFormUpdated = true;
     
    } 
  }, [intern]);

 

  const handlePhotoUpload = async (options: any) => {
    const url = await UploadService.uploadPhoto(axiosPrivate, options);
    setPhoto_url(url);
  }

  const handleCvUpload = async (options: any) => {
    const url = await UploadService.uploadCv(axiosPrivate, options);
    setCv_url(url);
  }

  const handleCancelCvUpload = async (file: any) => {
    if(intern) { //If we are in edit mode
      await UploadService.deleteCv(axiosPrivate, intern.cv_url!.split("/").pop()!, "cv");
      setCvList([]);
      intern.cv_url = null;
      await InternService.updateIntern(axiosPrivate, intern);
    }
    else{
      await UploadService.deleteCv(axiosPrivate, cv_url!.split("/").pop()!, "garbage");
    }
      
  }

  const handleCancelPhotoUpload = async (file: any) => {
    if(intern) { //If we are in edit mode
      UploadService.deletePhoto(axiosPrivate, intern.photo_url!.split("/").pop()!, "photos");
      setPhotoList([]);
      intern.photo_url = null;
      await InternService.updateIntern(axiosPrivate, intern);
    }
    else{
      UploadService.deletePhoto(axiosPrivate, photo_url!.split("/").pop()!, "garbage");
    }
    
  }

  const giveMessage = (type: NoticeType, mssge: string) => {
    message.open({
      type: type,
      content: mssge,
    });
  };

  
  return (

    <>
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
                {teams.map(team => {
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
        
        
        <Form.Item>
          <Upload customRequest={handleCvUpload} fileList={intern?.cv_url ? cvList : undefined}  listType="picture-card" accept='.pdf,.docx,doc'maxCount={1} onRemove={handleCancelCvUpload}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload CV</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Upload customRequest={handlePhotoUpload} fileList={intern?.photo_url ? photoList : undefined} listType="picture-card"  accept='.jpg,.png'maxCount={1} onRemove={handleCancelPhotoUpload}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload Photo</div>
            </div>
          </Upload>
        </Form.Item>
  
        {!intern && <Form.Item>
            <div><Button  htmlType='submit' type='primary' block>{intern ? (<>Edit Intern</>) : (<>Add Intern</>)}</Button></div>
        </Form.Item>}
      </Form>
    </>
  );
};

export default InternAddingForm;