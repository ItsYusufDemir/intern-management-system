import React from 'react';
import { Descriptions, Image } from 'antd';
import {Intern} from "../models/Intern";







const CVComponent = (props: {intern: Intern}) => {
    const intern = props.intern;
    
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
            <Descriptions.Item label="Major">{intern.major + "(GPA: " + intern.gpa + ")"}</Descriptions.Item>
            <Descriptions.Item label="Team">{intern.team.name}</Descriptions.Item>
            <Descriptions.Item label="Internship Date">
            {intern.internshipStartingDate.toLocaleDateString() + " - " + intern.internshipEndingDate.toLocaleDateString()}
            </Descriptions.Item>
        </Descriptions>


        </>
      );
}
 
export default CVComponent;