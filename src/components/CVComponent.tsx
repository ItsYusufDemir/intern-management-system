import React, { useEffect, useState } from 'react';
import { Descriptions, Image, Button, Select, Form, Input, Card, Progress, Space, Modal, Tabs, message, Calendar, ConfigProvider, Badge } from 'antd';
import {Intern} from "../models/Intern";
import {DownloadOutlined,
        DeleteOutlined,
        EditOutlined,
        ExclamationCircleFilled,
        CloseOutlined,
        PlusOutlined,
        MinusOutlined
    } from '@ant-design/icons';
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
import dayjs, { Dayjs } from 'dayjs';
import type { CellRenderInfo } from 'rc-picker/lib/interface';
import "dayjs/locale/tr";
import locale from "antd/locale/tr_TR";
import { Attendance } from '../models/Attendance';
import AttendanceService from '../services/AttendanceService';


// TODO: Handle Download Cv,

interface PropType {
    intern: Intern,
    setIntern: React.Dispatch<React.SetStateAction<Intern | undefined>>,
    teams: Team [],
    interns: Intern [],
    refetchData: () => void,
    getAssignments: () => void,
    assignments: Assignment [] | undefined;
    attendances: Attendance [] | undefined; 
    getAttendances: () => void,
}

const CVComponent: React.FC<PropType> = ({intern, teams, interns, refetchData, assignments, getAssignments, setIntern, attendances, getAttendances}) => {
    

    const [form] = Form.useForm();
    const { auth }: any = useAuth();
    const [isDone, setIsDone] = useState(false);
    const [doesPressed, setDoesPressed] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs>()
    const [isOpen, setIsOpen] = useState(false);

    dayjs.locale("tr");
 
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
      const [isModalOpen3, setIsModalOpen3] = useState(false)

      
      const [isHidden, setIsHidden] = useState<boolean>(true);
      const [form2] = Form.useForm()
      const [form3] = Form.useForm();
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


    const deleteIntern =  () =>  {
        const index = interns.indexOf(intern);
        if (index > -1) { // only splice array when item is found
            interns.splice(index, 1); // 2nd parameter means remove one item only
        };
        try {
            /*delete while deleting applications
            if(intern.cv_url !== null){
                await UploadService.deleteCv(axiosPrivate, intern.cv_url.split("/").pop()!, "cv");
             }
     
             if(intern.photo_url !== null) {
                 await UploadService.deletePhoto(axiosPrivate, intern.photo_url.split("/").pop()!, "photos");
             }
             */
            InternService.deleteIntern(axiosPrivate, intern);
     
            setIntern(undefined);
 
            giveMessage("success", "Intern deleted");
        } catch (error: any) {
            if (!error?.response) {
                giveMessage("error", "No server response");
              }  else {
                giveMessage("error", "Error while deleting intern");
              }
        }
        
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

    //Note modal
    const showModal3 = () => {
        setIsModalOpen3(true);
    };
    const handleOk3 = (e: any) => {
        form3.submit();
    };
    const handleCancel3 = () => {
        setIsModalOpen3(false);
    };

    const onFinish = () => {
        const formData = form3.getFieldsValue();
        handleAbsent(formData.note)
        form3.resetFields();
    }


    const giveMessage = (type: NoticeType, mssge: string) => {
        message.open({
          type: type,
          content: mssge,
        });
      }

    

    

    const dateCellRender = (value: Dayjs) => {

        if (selectedDate && value.isSame(selectedDate)) {
            return (
                <div>    
                <Button //cancel button
                    type="primary"
                    icon={<CloseOutlined />}
                    size='small'
                    style={{marginLeft: "70%"}}
                    onClick={() => {
                        setSelectedDate(undefined);
                        setIsOpen(false); 
                    }}
                    
                    danger
                    ghost
                />
                <br />           
                <Button //Present button
                    type="primary"
                    icon={<PlusOutlined />}
                    size='small'
                    onClick={handlePresent}
                    style={{marginTop: "5px"}}
                    ghost
                >Present</Button>
                <br />
                <Button //cancel button
                    type="primary"
                    icon={<MinusOutlined />}
                    size='small'
                    onClick={showModal3}
                    style={{marginTop: "5px"}}
                    danger
                    ghost
                >Absent</Button>
                </div>
            );
        } 
        
       if(value.day() === 6 || value.day() === 0 || value.unix() < intern.internship_starting_date ||
        value.isAfter(dayjs(intern.internship_ending_date * 1000)) || value.isAfter(dayjs())) { //if the day is weekend
            return;
       }
       const attendance = getListData(value);

       if(attendance?.status === "present") {
            return <Badge status='success' text="Present"></Badge>
       } else if(attendance?.status === "absent") {
            return <Badge status='error' text="Absent"></Badge>
       } else{
        return <Badge status="warning" text="Not Taken"></Badge>
       }
    };

    const cellRender = (current: Dayjs, info: CellRenderInfo<Dayjs>) => {
        if (info.type === 'date') return dateCellRender(current);
        return info.originNode;
    }

    

    const getListData = (value: Dayjs) => {
        value = value.set("hour", 0).set("minute", 0).set("second", 0);
        let listData;
        const attendance = attendances?.find(attendance => {
            return dayjs(attendance.attendance_date * 1000).isSame(value, 'day');
        });
            
        return attendance;
    }

    const handleSelectDate = (value: Dayjs) => {
        if(!value.isSame(selectedDate)) {
            setSelectedDate(value);
            setIsOpen(true); // Reset doesPressed to false when selecting a new date
        } else if (!isOpen && value.isSame(selectedDate)) {
            setSelectedDate(undefined);
        }
        else if(!isOpen) {
            setSelectedDate(undefined);
        }  
    };

    const handlePresent = async () => {
        try {
            //Mark Present
            const date = selectedDate!.set("hour", 0).set("minute", 0).set("second", 0);
            const newAttendance: Attendance = {
                intern_id: intern.intern_id!,
                attendance_date: date.unix(),
                status: "present"
            }

            await AttendanceService.addAttendance(axiosPrivate, newAttendance);

            setSelectedDate(undefined);
            setIsOpen(false);
            giveMessage("success", "Attendance taken");
        } catch (error: any) {
            if (!error?.response) {
                giveMessage("error", "No server response");
              }  else {
                giveMessage("error", "Error while taking attendance");
              }
        } finally {
            getAttendances();
        }
    }

    const handleAbsent = async (note: string) => {
        try {
            //Mark absent
            const date = selectedDate!.set("hour", 0).set("minute", 0).set("second", 0);
            const newAttendance: Attendance = {
                intern_id: intern.intern_id!,
                attendance_date: date.unix(),
                status: "absent",
                note: note
            }
            
            await AttendanceService.addAttendance(axiosPrivate, newAttendance);

            setSelectedDate(undefined);
            setIsOpen(false);
            giveMessage("success", "Attendance taken");
        } catch (error: any) {
            if (!error?.response) {
                giveMessage("error", "No server response");
              }  else {
                giveMessage("error", "Error while taking attendance");
              }
        } finally {
            setIsModalOpen3(false);
            getAttendances();
        }
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
            <Descriptions.Item label="Personal ID">{intern.id_no}</Descriptions.Item>
            <Descriptions.Item label="Tel">{intern.phone_number}</Descriptions.Item>
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

        <br /><br />
        <h2>Attendance</h2>
        {/*// Calendar için buton ekle burdan deva et
        value={(intern.internship_starting_date > dayjs().unix()) ? dayjs(intern.internship_starting_date * 1000) : dayjs()}
        */}
        
        <Calendar onSelect={handleSelectDate} disabledDate={(date) => {
            if(date.day() === 6 || date.day() === 0){ //Disable selecting weekends
                return true;
            }
            return false;
        }} style={{width: "50%", minWidth: "900px"}}  cellRender={cellRender} validRange={[dayjs(intern.internship_starting_date * 1000), dayjs(intern.internship_ending_date * 1000)]}/>
        

        {/*Modals Here*/}
        <div>
            <Modal title="Edit" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                 <InternAddingForm teams={teams} intern={intern} setIsDone={setIsDone} doesPressed={doesPressed} setDoesPressed={setDoesPressed} />
            </Modal>

            <Modal title="New Assignment" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} width={600}>
                 <AddAssignmentForm setDoesPressed={setDoesPressed} intern_id={intern.intern_id!} doesPressed={doesPressed} setIsDone={setIsDone}/>
                 {doesPressed && <LoadingContainer />}
            </Modal>

            <Modal title="Note" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3}>
                <Form
                style={{width: 400}}
                onFinish={onFinish}
                labelCol={{span: 6}}
                wrapperCol={{span: 14}}
                form={form3}
                >
                    <Form.Item label="Note" name="note">
                    <Input.TextArea showCount
                        maxLength={250}
                        style={{ height: 100, marginBottom: 10, width: 300}}/>
                    </Form.Item>
                </Form>
            </Modal>


        </div>



        


        </>
      );
}

 
export default CVComponent;