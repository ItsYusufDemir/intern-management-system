import React, { useEffect, useState } from 'react';
import { Descriptions, Image, Button, Select, Form, Input, Card, Progress, Space, Modal, Tabs, message } from 'antd';
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
import LoadingContainer from './LoadingContainer';
import InternAddingForm from './forms/InternAddingForm';
import { NoticeType } from 'antd/es/message/interface';


// TODO: Handle Download Cv,

interface PropType {
    intern: Intern,
    setIntern: React.Dispatch<React.SetStateAction<Intern | undefined>>,
    teams: Team [],
    interns: Intern [],
    refetchData: () => void,
    getAssignments: () => void,
    assignments: Assignment [] | undefined; 
}

const CVComponent: React.FC<PropType> = ({intern, teams, interns, refetchData, assignments, getAssignments, setIntern}) => {
    

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
            setIsModalOpen(false);
            setIsModalOpen2(false);

            refetchData();
            getAssignments(); 
            
            setIsDone(false);
            setDoesPressed(false);
       }
    }, [isDone])
    
    
      
      const [isModalOpen, setIsModalOpen] = useState(false)
      const [isModalOpen2, setIsModalOpen2] = useState(false)

      
      const [isHidden, setIsHidden] = useState<boolean>(true);
      const [form2] = Form.useForm()
      const [editForm] = Form.useForm();
      const location = useLocation();
      const navigate = useNavigate();
      const axiosPrivate = useAxiosPrivate();
      


      
    if(intern === undefined){
       return (<></>);
    }


    const findTeam = (temp: Intern) => {
        const team = teams.filter(team => team.team_id === temp.team_id)[0];
        return team;
    }

    const findInternshipPeriod = (start: number, end: number) => {
        return Math.round(((end - start)/( 60 * 60 * 24 * 7)));
    }
    
    
    //Percentage of complete of internship
    const completePercentage = Math.round(((Date.now() - intern.internship_starting_date * 1000) / 
    (intern.internship_ending_date * 1000 - intern.internship_starting_date * 1000)) * 100);
    
    

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
           await UploadService.deleteCv(axiosPrivate, intern.cv_url.split("/").pop()!, "cv");
        }

        if(intern.photo_url !== null) {
            await UploadService.deletePhoto(axiosPrivate, intern.photo_url.split("/").pop()!, "photos");
        }

        await InternService.deleteIntern(axiosPrivate, intern);

        
        setIntern(undefined);
        giveMessage("success", "Intern deleted");
    };
   
    const downloadCv =  (event: any) => {
        if(intern.cv_url !== null){   
             window.open(addAccessToken(intern.cv_url), "_blank");
        } else{
            giveMessage("info", "Intern has not uploaded CV");
        }
    }   

    const addAccessToken = (url: string) => {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}access_token=${auth.accessToken}`;
    }


    const handleNewAssignment = () => {
        showModal2();
    }


    //Edit Intern Modal
    const showModal = () => {
        console.log(interns);
        setIsModalOpen(true);
    };
    const handleOk = (e: any) => {
        setDoesPressed(true); 
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    //Assignment modal
    const showModal2 = () => {
        setIsModalOpen2(true);
    };
    const handleOk2 = (e: any) => {
        setDoesPressed(true);
    };
    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };


    const giveMessage = (type: NoticeType, mssge: string) => {
        message.open({
          type: type,
          content: mssge,
        });
      }


    return (

        <>
        
        <Image width={150} height={180} style={{border: "2px solid black", borderRadius: "10px"}}
        src={intern.photo_url !== null ? addAccessToken(intern.photo_url) : addAccessToken("http://localhost:5000/uploads/photos/no-photo.png")}/>

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
            {new Date(intern.internship_starting_date * 1000).toLocaleDateString() + " - " + new Date(intern.internship_ending_date * 1000).toLocaleDateString() +
            " (" + findInternshipPeriod(intern.internship_starting_date, intern.internship_ending_date) + " Weeks)"}
            </Descriptions.Item>
            <Descriptions.Item label="E-mail">{intern.email}</Descriptions.Item>
        </Descriptions>

        <div className='Buttons' style={{display: 'flex'}}>
            <Button  onClick={downloadCv} type="primary" shape="round" icon={<DownloadOutlined />} size={"large"}>Download CV</Button>
            <Button  onClick={showModal} type="primary" shape="round" icon={<EditOutlined />} style={{marginLeft: 'auto', marginRight: 10}}>Edit Intern</Button>
            <Button  onClick={showDeleteConfirm} type="primary" shape="round" icon={<DeleteOutlined />} style={{float: 'right'}} danger>Delete Intern</Button>
        </div>

        <br /><br /><br />

        <h2>Assignments</h2>

        <div className='assignment-table'>
            <Tabs defaultActiveKey='1' size='middle' tabBarExtraContent={<Button type='primary' onClick={handleNewAssignment}>New Assignment</Button>}>
                <TabPane tab="Assignments" key="1">
                    {!assignments ? <Loading /> : <AssignmentTable getAssignments={getAssignments} refetchData={refetchData} assignments={assignments.filter(assignment => !assignment.complete)}/>}
                </TabPane>
                <TabPane tab="Done" key="2">
                    {!assignments ? <Loading /> : <AssignmentTable getAssignments={getAssignments} refetchData={refetchData} assignments={assignments.filter(assignment => assignment.complete)}/>}
                </TabPane>
            </Tabs>
        </div>


        {/*Modals Here*/}
        <div>
            <Modal title="Edit" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                 <InternAddingForm teams={teams} intern={intern} setIsDone={setIsDone} doesPressed={doesPressed} />
            </Modal>

            <Modal title="New Assignment" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} width={600}>
                 <AddAssignmentForm intern_id={intern.intern_id!} doesPressed={doesPressed} setIsDone={setIsDone}/>
                 {doesPressed && <LoadingContainer />}
            </Modal>


        </div>



        


        </>
      );
}

 
export default CVComponent;