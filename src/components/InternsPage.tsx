import {Form, Select, Row, Col} from "antd";
import {useEffect, useState} from "react";
import "../styles.css";
import {Intern} from "../models/Intern";
import {Program} from "../models/Program";
import {Team} from "../models/Team";
import CVComponent from "./CVComponent"


const InternsPage = (props: {teams: Team[], interns: Intern[] }) => {

  const teams = props.teams;
  const interns = props.interns;

  const [team, setTeam] = useState<any>(teams[0]);

  
  const handleTeamSelect = (e: any) => {
    setTeam(teams[e]);
    setSelectedIntern(undefined);
    handleUpdateValue();
    setSelectDisabled(false);
    
    counter = -1;
  }



  const [selectDisabled, setSelectDisabled] = useState<boolean>(true);
  const [selectedIntern, setSelectedIntern] = useState<any>();
  let counter = -1;

  
  const renderCv = (e: any) => {

    let teamInterns: Intern[] = []
    
    //Find the selected intern
    for(let i = 0; i < interns.length; i++){
      if(interns[i].team.name === team.name){
        teamInterns.push(interns[i]);
      }
    }

    setSelectedIntern(teamInterns[e]);
  }


  const [form] = Form.useForm();
 
  const handleUpdateValue = () => {
    form.setFieldsValue({
      internSelectItem: "Select an intern",
    });
  };


    return (
      <>


      <div className="intern-page-selections" style={{display: "flex"}}>
        <Form layout="vertical" form={form}>
          <Row gutter={100}>
            <Col span={12}>
              <Form.Item label="Team" name="teamSelectItem" style={{width: 350}}>
                <Select onChange={handleTeamSelect} >
                    {teams.map((team,index) => (
                      <Select.Option value={index}>{team.name}</Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Intern" name="internSelectItem" style={{width: 350, marginLeft: "auto"}}>
                
                <Select  disabled={selectDisabled} onChange={renderCv} className="internSelect">
                
                  {interns.map((intern, index) => {
                      if(intern.team.name === team.name){
                        counter++;
                        return (
                          <Select.Option value={counter}>{intern.fullName}</Select.Option>
                        )
                      }
                      
                    })}
                </Select>
              </Form.Item>
            </Col>

          </Row>
        </Form>
        
      </div>
      <br />
      
    
      <div className="cv-area">
        <CVComponent intern={selectedIntern} teams={props.teams} interns={props.interns} />
      </div>

      <br />
      

      </>  
      );
}
 
export default InternsPage;