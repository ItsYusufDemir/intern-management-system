import React, { useEffect, useState } from 'react';
import { Descriptions, Image, Button, Select, Form, Input, Card, Progress, Space, Modal } from 'antd';
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


// TODO: Handle Download Cv,

const CVComponent = (props: {intern: Intern, teams: Team[], interns: Intern[]}) => {
    
    const intern = props.intern;
    const teams = props.teams;
    const interns = props.interns;

    const [form] = Form.useForm();
    const { auth }: any = useAuth();
 
    const handleUpdateValue = () => {
        form.setFieldsValue({
        weekSelect: "Select week",
        });
    };

    useEffect(() => {
        setIsHidden(true);
        handleUpdateValue();
    }, [intern]);

    

      const [isModalOpen, setIsModalOpen] = useState(false)
      const [isModalOpen2, setIsModalOpen2] = useState(false)
      const [isHidden, setIsHidden] = useState<boolean>(true);
      const [currentWeeklyGrade, setCurrentWeeklyGrade] = useState<Number | undefined>(undefined);
      const [currentMission, setCurrentMission] = useState<string>("");
      const [form2] = Form.useForm()
      const [editForm] = Form.useForm();
      const [currentWeek, setCurrentWeek] = useState(0);
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
    
    
    const handleSelectWeek = (e: number) =>{
        setCurrentWeek(e);

        setIsHidden(false);

        if(intern.assignment_grades !== undefined) {
            if(intern.assignment_grades[e] !== undefined){
                setCurrentWeeklyGrade(intern.assignment_grades[e]);
                setCurrentMission(findTeam(intern).assignments[e]);
            }
            else{
                setCurrentWeeklyGrade(undefined);
                setCurrentMission(findTeam(intern).assignments[e]);
            }
        }
        else{
            setCurrentWeeklyGrade(undefined);
            setCurrentMission(findTeam(intern).assignments[e]);
        }

        
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

    ;

    const onFinish2 = () => {
        form.resetFields();
    }



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
           await UploadService.deleteCv(intern.cv_url.split("/").pop()!);
        }

        if(intern.photo_url !== null) {
            await UploadService.deletePhoto(intern.photo_url.split("/").pop()!);
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
    
    return (

        <>
        
        <Image width={150} height={200} style={{border: "2px solid black", borderRadius: "10px"}}
        src={intern.photo_url ? addAccessToken(intern.photo_url) : undefined}/>

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

        <div className='internship-programme'>
            <h2>Internship Programme</h2>
            
            <Form layout="horizontal" form={form}>
                <Form.Item label="Week" name="weekSelect" style={{width: 200}}>
                    <Select onChange={handleSelectWeek}>
                        {findTeam(intern).assignments.map((assignment, index) => {
                            return(
                            <Select.Option value={index}>{(index + 1) + ". week"}</Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>


                
            </Form>

            <Card title={ "Grade: " + currentWeeklyGrade} style={{width: 800, height: 100}} hidden={isHidden}>{currentMission}
                <Button style={{position: "absolute", left:'85%', top: "10px"}} onClick={showModal}>Add/Change</Button>
            </Card>


            

            
            



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
        </div>
        


        </>
      );
}

 
export default CVComponent;