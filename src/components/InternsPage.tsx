import {Form, Select, Row, Col} from "antd";
import {useEffect, useState, createContext} from "react";
import "../styles.css";
import {Intern} from "../models/Intern";
import {Team} from "../models/Team";
import CVComponent from "./CVComponent"
import InternService from "../services/InternService";
import TeamService from "../services/TeamService";
import { useDataContext } from "../App";


const InternsPage = () => {


const {interns, teams, isLoading} = useDataContext();
const [team, setTeam] = useState<Team>();
const [shouldRender, setShouldRender] = useState<boolean>(false);


useEffect(() => {
  if (teams) {
    setTeam(teams[0]);
  }
},[teams])


useEffect(() => {
  if(team){
    setShouldRender(true);
  }
},[team])


  

  
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
      if(teams.filter(team => team.team_id === interns[i].team_id)[0].team_name === team!.team_name){
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
      {shouldRender && <Form layout="vertical" form={form}>
          <Row gutter={100}>
            <Col span={12}>
              <Form.Item label="Team" name="teamSelectItem" style={{width: 350}}>
                <Select onChange={handleTeamSelect} >
                    {teams.map((team,index) => (
                      <Select.Option key={index} value={index}>{team.team_name}</Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Intern" name="internSelectItem" style={{width: 350, marginLeft: "auto"}}>
                
                <Select  disabled={selectDisabled} onChange={renderCv} className="internSelect">
                
                  {interns.map((intern, index) => {
                      if(teams.filter(team => team.team_id === intern.team_id)[0].team_name === team!.team_name){
                        counter++;
                        return (
                          <Select.Option key={index} value={counter}>{intern.first_name + " " + intern.last_name}</Select.Option>
                        )
                      }
                      
                    })}
                </Select>
              </Form.Item>
            </Col>

          </Row>
        </Form>
        }
      </div>
      <br />
      
    
     {shouldRender && <div className="cv-area">
        <CVComponent intern={selectedIntern} teams={teams} interns={interns} />
      </div>
}
      <br />

      {!shouldRender && <div><h1>Loading...</h1></div>}
      

      </>  
      );
}
 
export default InternsPage;