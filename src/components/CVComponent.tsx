import React, { useEffect, useState } from 'react';
import { Descriptions, Image, Button, Select, Form, Input, Card, Progress, Space, Modal } from 'antd';
import {Intern} from "../models/Intern";
import {DownloadOutlined, DeleteOutlined, EditOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import AddInternPage from './AddInternPage';
import { Team } from '../models/Team';
import { useLocation, useNavigate } from 'react-router-dom';








const CVComponent = (props: {intern: Intern, teams: Team[], interns: Intern[]}) => {
    const intern = props.intern;


    const [form] = Form.useForm();
 
    const handleUpdateValue = () => {
        console.log("bura sıkıntı");
        form.setFieldsValue({
        weekSelect: "Select week",
        });
    };

    useEffect(() => {
        setIsHidden(true);
        handleUpdateValue();
        console.log("intern is changed");
    }, [intern]);

    

    const handleClick = () =>{
        openPdfInNewTab(intern.cvUrl);
    }

    const openPdfInNewTab = (pdfPath: string) => {
        fetch(pdfPath)
          .then((response) => response.blob())
          .then((blob) => {
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, '_blank');
          });
      };

      const [isModalOpen, setIsModalOpen] = useState(false)
      const [isModalOpen2, setIsModalOpen2] = useState(false)
      const [isHidden, setIsHidden] = useState<boolean>(true);
      const [currentWeeklyGrade, setCurrentWeeklyGrade] = useState(0);
      const [currentMission, setCurrentMission] = useState<string>("");
      const [form2] = Form.useForm()
      const [editForm] = Form.useForm();
      const [currentWeek, setCurrentWeek] = useState(0);
      const location = useLocation();
      const navigate = useNavigate();

      //

    
    if(intern === undefined){
        return (<></>);
    }

    



    const handleSelectWeek = (e: number) =>{
        setCurrentWeek(e);
        console.log("currentWeek: " + currentWeek);
   
        
        
        setIsHidden(false);
        setCurrentWeeklyGrade(intern.successGrades[e]);
        setCurrentMission(intern.team.curriculum[e].mission);
    }

 
    const completePercentage = Math.round(((Date.now() - intern.internshipStartingDate.getTime()) / 
    (intern.internshipEndingDate.getTime() - intern.internshipStartingDate.getTime())) * 100)
    
    
    const handleAddButton = ((e: any) => {
        
    })

    
    







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

        intern.successGrades[currentWeek] = Number(form2.getFieldValue("newGrade"));
        intern.computeOverallSuccess();

        
 
        setCurrentWeeklyGrade(Number(form2.getFieldValue("newGrade")));

        form2.resetFields();
        setIsModalOpen(false);

        
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    ;

    const onFinish = () => {
        form.resetFields();
        console.log("form is finished");
    }



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
        console.log("form is finished");
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


    const deleteIntern = () => {
        


        navigate(0);
        


        alert("Intern is deleted");
        
    }
   

    

   
    


    
    return (

        <>
        <Image width={150} height={200} style={{border: "2px solid black", borderRadius: "10px"}}
        src={intern.photoUrl}/>

        <Space wrap style={{float: 'right'}}>
            <Progress type="circle" percent={completePercentage} format={(percent) => `${percent}% Complete`} size={100}></Progress>  
            <Progress type="circle" percent={intern.overallSuccess} format={(percent) => `${percent}% Success`} size={100}></Progress>
        </Space>

        <br /><br />
    
        

        <Descriptions>
            <Descriptions.Item label="Name">{intern.fullName}</Descriptions.Item>
            <Descriptions.Item label="University">{intern.uni}</Descriptions.Item>
            <Descriptions.Item label="Major">{intern.major + " (GPA: " + intern.gpa + ")"}</Descriptions.Item>
            <Descriptions.Item label="Grade">{intern.grade + ". Grade"}</Descriptions.Item>
            <Descriptions.Item label="Team">{intern.team.name}</Descriptions.Item>
            <Descriptions.Item label="Internship Date">
            {intern.internshipStartingDate.toLocaleDateString() + " - " + intern.internshipEndingDate.toLocaleDateString() +
            " (" + intern.internshipPeriod + " Weeks)"}
            </Descriptions.Item>
            <Descriptions.Item label="E-mail">{intern.email}</Descriptions.Item>
        </Descriptions>

        <div className='Buttons' style={{display: 'flex'}}>
            <Button  href={intern.cvUrl} type="primary" shape="round" icon={<DownloadOutlined />} size={"large"}>Download CV</Button>
            <Button  onClick={showModal2} type="primary" shape="round" icon={<EditOutlined />} style={{marginLeft: 'auto', marginRight: 10}}>Edit Intern</Button>
            <Button  onClick={showDeleteConfirm} type="primary" shape="round" icon={<DeleteOutlined />} style={{float: 'right'}} danger>Delete Intern</Button>
        </div>

        <br /><br />

        <div className='internship-programme'>
            <h2>Internship Programme</h2>
            
            <Form layout="horizontal" form={form}>
                <Form.Item label="Week" name="weekSelect" style={{width: 200}}>
                    <Select onChange={handleSelectWeek}>
                        {intern.team.curriculum.map((program, index) => {
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


        {/*Modals Here**/}
        <div>
            <Modal title="Add/Change" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    layout="horizontal"
                    style={{ maxWidth: 400 }}
                    onFinish={onFinish}
                    form={form2}>
                    
                    <Form.Item label="Weekly Grade" name="newGrade">
                        <Input type='number'></Input>
                    </Form.Item>  
                </Form> 
            </Modal>

            <Modal title="Edit" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2}>
                <AddInternPage isEdit={true} intern={intern} teams={props.teams} interns={props.interns}></AddInternPage>
            </Modal>
        </div>
        


        </>
      );
}
 
export default CVComponent;