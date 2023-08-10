import React, { useEffect, useState } from 'react';
import { Descriptions, Image, Button, Select, Form, Input, Card, Progress, Space, Modal, Tabs } from 'antd';
import {Intern} from "../models/Intern";
import {DownloadOutlined, DeleteOutlined, EditOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import AddInternPage from './AddInternPage';
import { Team } from '../models/Team';
import { useLocation, useNavigate } from 'react-router-dom';
import PDFViewer from './PDFViewer';
import InternService from '../services/InternService';
import UploadService from '../services/UploadService';
import useAuth from '../utils/useAuth';
import useRefreshToken from '../utils/useRefreshToken';
import useAxiosPrivate from '../utils/useAxiosPrivate';
import TabPane from 'antd/es/tabs/TabPane';
import UserTable from './tables/UserTable';
import Loading from './Loading';
import AssignmentTable from './tables/AssignmentTable';
import { Assignment } from '../models/Assignment';
import AddAssignmentForm from './forms/AddAssignmentForm';


// TODO: Handle Download Cv,

interface PropType {
    intern: Intern,
    teams: Team [],
    interns: Intern [],
    getData: () => void,
}

const CVComponent: React.FC<PropType> = ({intern, teams, interns, getData}) => {
    

    const [form] = Form.useForm();
    const { auth }: any = useAuth();
    const [isDone, setIsDone] = useState(false);
    const [doesPressed, setDoesPressed] = useState(false);
 
    const handleUpdateValue = () => {
        form.setFieldsValue({
        weekSelect: "Select week",
        });
    };

    useEffect(() => {
        setIsHidden(true);
        handleUpdateValue();
    }, [intern]);

    useEffect(()=> {
       if(isDone) {
            setIsModalOpen3(false);
            getData();
            setIsDone(false);
       }
    }, [isDone])



    

      const [isModalOpen, setIsModalOpen] = useState(false)
      const [isModalOpen2, setIsModalOpen2] = useState(false)
      const [isModalOpen3, setIsModalOpen3] = useState(false)
      
      const [isHidden, setIsHidden] = useState<boolean>(true);
      const [currentWeeklyGrade, setCurrentWeeklyGrade] = useState<Number | undefined>(undefined);
      const [currentMission, setCurrentMission] = useState<string>("");
      const [form2] = Form.useForm()
      const [editForm] = Form.useForm();
      const [currentWeek, setCurrentWeek] = useState(0);
      const location = useLocation();
      const navigate = useNavigate();
      const axiosPrivate = useAxiosPrivate();
      ;

      
    if(intern === undefined){
       return (<></>);
    }


    const findTeam = (temp: Intern) => {
        const team = teams.filter(team => team.team_id === temp.team_id)[0];
        return team;
    }

    const findInternshipPeriod = (start: Date, end: Date) => {
        return Math.round(((end.getTime() - start.getTime())/(1000 * 60 * 60 * 24 * 7)));
    }

    const computeOverallSuccess = () => {
        let totalPoint = 0;

        let counter = 0;
        intern.assignment_grades.forEach(assignment_grade => {
          if(assignment_grade !== null){
            totalPoint += assignment_grade;
            counter++;
          }
        })
       
        intern.overall_success = totalPoint / counter;
        InternService.updateIntern(axiosPrivate, intern); //Update the intern in database
    }
    
    

    //Percentage of complete of internship
    const completePercentage = Math.round(((Date.now() - intern.internship_starting_date.getTime()) / 
    (intern.internship_ending_date.getTime() - intern.internship_starting_date.getTime())) * 100);
    
    
    //Add/Change weekly grade Modal
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = (e: any) => {
        form2.submit();

        if(form2.getFieldValue("newGrade") === undefined){
            setIsModalOpen(false);
            return;
        }

        intern.assignment_grades[currentWeek] = Number(form2.getFieldValue("newGrade"));
        computeOverallSuccess(); //Update the intern's overall success
        InternService.updateIntern(axiosPrivate, intern);

        setCurrentWeeklyGrade(Number(form2.getFieldValue("newGrade")));

        form2.resetFields();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    

    //Edit Intern Modal
    const showModal2 = () => {
        setIsModalOpen2(true);
    };
    
   

    const handleOk2 = (e: any) => {
        editForm.resetFields();
        setIsModalOpen2(false); 
    };

    

    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };

    

    



    //Delete Modal
    const {confirm} = Modal;

    const showDeleteConfirm = () => {
        confirm({
          title: 'Warning!',
          icon: <ExclamationCircleFilled />,
          content: 'Are you sure to delete this intern?',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            deleteIntern();
          },
          onCancel() {
            
          },
        });
    };


    const deleteIntern = async () =>  {

        const index = interns.indexOf(intern);
        if (index > -1) { // only splice array when item is found
            interns.splice(index, 1); // 2nd parameter means remove one item only
        };

        if(intern.cv_url !== null){
            console.log("tam burası", intern.cv_url);
           await UploadService.deleteCv(axiosPrivate, intern.cv_url.split("/").pop()!);
        }

        if(intern.photo_url !== null) {
            await UploadService.deletePhoto(axiosPrivate, intern.photo_url.split("/").pop()!);
        }

        await InternService.deleteIntern(axiosPrivate, intern);

        navigate(0); //Refresh the page  
    };
   
    const downloadCv =  (event: any) => {
        if(intern.cv_url !== null){   
             window.open(addAccessToken(intern.cv_url), "_blank");
        }    
    }   

    const addAccessToken = (url: string) => {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}access_token=${auth.accessToken}`;
    }

    const assignments: Assignment [] = [];

    const handleNewAssignment = () => {
        showModal3();
    }

    const showModal3 = () => {
        setIsModalOpen3(true);
    };
    
   

    const handleOk3 = (e: any) => {
        setDoesPressed(true);
    };

    


    const handleCancel3 = () => {
        setIsModalOpen3(false);
    };

    
    
    return (

        <>
        
        <Image width={150} height={200} style={{border: "2px solid black", borderRadius: "10px"}}
        src={intern.photo_url !== null ? addAccessToken(intern.photo_url) : addAccessToken("http://localhost:5000/uploads/photos/no-photo.jpg")}/>

        <Space wrap style={{float: 'right'}}>
            <Progress type="circle" percent={completePercentage} format={(percent) => `${percent}% Complete`} size={100}></Progress>  
            <Progress type="circle" percent={intern.overall_success ? intern.overall_success : 0} format={(percent) => `${percent}% Success`} size={100}></Progress>
        </Space>

        <br /><br />
    
        

        <Descriptions>
            <Descriptions.Item label="Name">{intern.first_name + " " + intern.last_name}</Descriptions.Item>
            <Descriptions.Item label="University">{intern.uni}</Descriptions.Item>
            <Descriptions.Item label="Major">{intern.major + " (GPA: " + intern.gpa + ")"}</Descriptions.Item>
            <Descriptions.Item label="Grade">{intern.grade + ". Grade"}</Descriptions.Item>
            <Descriptions.Item label="Team">{findTeam(intern).team_name}</Descriptions.Item>
            <Descriptions.Item label="Internship Date">
            {intern.internship_starting_date.toLocaleDateString() + " - " + intern.internship_ending_date.toLocaleDateString() +
            " (" + findInternshipPeriod(intern.internship_starting_date, intern.internship_ending_date) + " Weeks)"}
            </Descriptions.Item>
            <Descriptions.Item label="E-mail">{intern.email}</Descriptions.Item>
        </Descriptions>

        <div className='Buttons' style={{display: 'flex'}}>
            <Button  onClick={downloadCv} type="primary" shape="round" icon={<DownloadOutlined />} size={"large"}>Download CV</Button>
            <Button  onClick={showModal2} type="primary" shape="round" icon={<EditOutlined />} style={{marginLeft: 'auto', marginRight: 10}}>Edit Intern</Button>
            <Button  onClick={showDeleteConfirm} type="primary" shape="round" icon={<DeleteOutlined />} style={{float: 'right'}} danger>Delete Intern</Button>
        </div>

        <br /><br />

        <h2>Assignments</h2>

        <div className='assignment-table'>
            <Tabs defaultActiveKey='1' size='middle' tabBarExtraContent={<Button type='primary' onClick={handleNewAssignment}>New Assignment</Button>}>
                <TabPane tab="Assignments" key="1">
                    <AssignmentTable getData={getData} assignments={assignments}/>
                </TabPane>
                <TabPane tab="Done" key="2">
                    <AssignmentTable getData={getData} assignments={assignments}/>
                </TabPane>
            </Tabs>
        </div>


        {/*Modals Here*/}
        <div>
            <Modal title="Add/Change" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    layout="horizontal"
                    style={{ maxWidth: 400 }}
                    form={form2}>
                    
                    <Form.Item label="Weekly Grade" name="newGrade">
                        <Input type='number'></Input>
                    </Form.Item>  
                </Form> 
            </Modal>

            <Modal title="Edit" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2}>
                 <AddInternPage isEdit={true} intern={intern} ></AddInternPage>
            </Modal>

            <Modal title="New Assignment" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3} width={600}>
                 <AddAssignmentForm doesPressed={doesPressed} setDoesPressed={setDoesPressed} isDone={isDone} setIsDone={setIsDone}/>
                 
            </Modal>


        </div>



        


        </>
      );
}

 
export default CVComponent;