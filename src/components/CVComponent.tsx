import React from 'react';
import { Descriptions, Image, Button } from 'antd';
import {Intern} from "../models/Intern";
import {DownloadOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';







const CVComponent = (props: {intern: Intern}) => {
    const intern = props.intern;


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

    
    if(intern === undefined){
        return (<></>);
    }

    


    return (

        <>
        <Image width={150} height={200}
        src={intern.photoUrl}/>
        <br /><br />
    
        

        <Descriptions>
            <Descriptions.Item label="Name">{intern.fullName}</Descriptions.Item>
            <Descriptions.Item label="University">{intern.uni}</Descriptions.Item>
            <Descriptions.Item label="Major">{intern.major + " (GPA: " + intern.gpa + ")"}</Descriptions.Item>
            <Descriptions.Item label="Grade">{intern.grade + ". Grade"}</Descriptions.Item>
            <Descriptions.Item label="Team">{intern.team.name}</Descriptions.Item>
            <Descriptions.Item label="Internship Date">
            {intern.internshipStartingDate.toLocaleDateString() + " - " + intern.internshipEndingDate.toLocaleDateString() +
            " (" + intern.stajSüresi + " Weeks)"}
            </Descriptions.Item>
            <Descriptions.Item label="E-mail">{intern.email}</Descriptions.Item>
        </Descriptions>

        <div className='Buttons' style={{display: 'flex'}}>
            <Button  href={intern.cvUrl} type="primary" shape="round" icon={<DownloadOutlined />} size={"large"}>Download CV</Button>
            <Button  href={intern.cvUrl} type="primary" shape="round" icon={<EditOutlined />} style={{marginLeft: 'auto', marginRight: 10}}>Edit Intern</Button>
            <Button  href={intern.cvUrl} type="primary" shape="round" icon={<DeleteOutlined />} style={{float: 'right'}} danger>Delete Intern</Button>
        </div>


        </>
      );
}
 
export default CVComponent;