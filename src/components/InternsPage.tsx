import {Form, Select, Row, Col} from "antd";
import {useEffect, useState} from "react";
import "../styles.css";
import {Intern} from "../models/Intern";
import {Program} from "../models/Program";
import {Team} from "../models/Team";
import CVComponent from "./CVComponent"



/******************Database************************/
var teams: Team[] = [];
var interns: Intern[] = [];


let fullStackCurriculum: Program[] = []
let newMission = new Program(1, "Javasciprt Öğren");
let newMission2 = new Program(2, "React Öğren");
fullStackCurriculum.push(newMission);
fullStackCurriculum.push(newMission2);

let embeddedCurriculum: Program[] = []
let newMission3 = new Program(1, "Eve git");
let newMission4 = new Program(2, "Uyu");
embeddedCurriculum.push(newMission3);
embeddedCurriculum.push(newMission4);


let fullStackTeam = new Team("Full Stack", fullStackCurriculum);
let embeddedTeam = new Team("Embedded", embeddedCurriculum);

teams.push(fullStackTeam);
teams.push(embeddedTeam);


let date = new Date(2023, 6, 1);
let date1 = new Date(2023, 7,15);

let newIntern = new Intern("../assets/jamesbond.jpg", "James", "Bond", "11111111111", "5555555555", "Oxford",
 "Computer Engineering", 3,3.52, teams[0], date, date1, "../documents/cv.pdf", "example@gmail.com");
let newIntern2 = new Intern("../assets/adele.jpg", "Adele", "Adkins", "", "", "", "", 3,3, teams[0], date, date1, "../documents/cv.pdf", "example@gmail.com");
let newIntern3 = new Intern("../assets/bradpitt.jpg", "Brad", "Pitt", "", "", "", "", 3,3, teams[1], date, date1, "../documents/cv.pdf", "example@gmail.com");

newIntern.başarıPuanı.push(90);

interns.push(newIntern);
interns.push(newIntern2);
interns.push(newIntern3);

/*******************Database***********************/



const InternsPage = () => {


  const [team, setTeam] = useState<any>(teams[0]);

  

  const handleTeamSelect = (e: any) => {

    setTeam(teams[e]);
    
    setSelectedIntern(undefined);
    handleUpdateValue();
    setSelectDisabled(false);
    
    counter = -1;
  }


  useEffect(() => {
    
  }, [team]);
  


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
        <CVComponent intern={selectedIntern}/>
      </div>

      <br />
      <div className="internship-area">
        <h2>Staj Programı</h2>
      </div>



      
      
      </>  
      );
}
 
export default InternsPage;