import {Form, Select, Row, Col} from "antd";
import {useEffect, useState} from "react";
import "../styles.css";
import {Intern} from "../models/Intern";
import {Program} from "../models/Program";
import {Team} from "../models/Team";



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

let newIntern = new Intern("../img/wp-person-placeholder.png", "Yusuf", "Demir", "", "", "", "", 3,3, teams[0], date, date, "../documents/cv.pdf");
let newIntern2 = new Intern("../img/wp-person-placeholder.png", "Tarık", "Akdemir", "", "", "", "", 3,3, teams[0], date, date, "../documents/cv.pdf");
let newIntern3 = new Intern("../img/wp-person-placeholder.png", "John", "Bond", "", "", "", "", 3,3, teams[1], date, date, "../documents/cv.pdf");

newIntern.başarıPuanı.push(90);

interns.push(newIntern);
interns.push(newIntern2);
interns.push(newIntern3);

/*******************Database***********************/



const InternsPage = () => {


  const [team, setTeam] = useState<any>(teams[0]);


  const handleTeamSelect = (e: any) => {

    console.log(e);
    setTeam(teams[e]);

    setSelectDisabled(false);
  }

  useEffect(() => {
    
  }, [team]);

  



  const [selectDisabled, setSelectDisabled] = useState<boolean>(false);


  

  let selectedIntern: Intern;

  const renderCv = (e: any) => {

    let teamInterns: Intern[] = []
    
    //Find the selected intern
    for(let i = 0; i < interns.length; i++){
      if(interns[i].team.name === team.name){
        teamInterns.push(interns[i]);
      }
    }
    selectedIntern = teamInterns[e];




  }



    return (
      <>


      <div className="intern-page-selections" style={{display: "flex"}}>
        <Form layout="vertical">
          <Row gutter={100}>
            <Col span={12}>
              <Form.Item label="Team" name="teamSelectItem" style={{width: 350}}>
                <Select onChange={handleTeamSelect} defaultValue={0}>
                    {teams.map((team,index) => (
                      <Select.Option value={index}>{team.name}</Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Week" name="internSelectItem" style={{width: 350, marginLeft: "auto"} }>
                <Select disabled={selectDisabled} onChange={renderCv} className="internSelect">
                  {interns.map((intern, index) => {
                      if(intern.team.name === team.name){
                        return (
                          <Select.Option value={index}>{intern.fullName}</Select.Option>
                        )
                      }
                      
                    })}
                </Select>
              </Form.Item>
            </Col>

          </Row>
        </Form>
      </div>
      <br /><br />

      
      
      
      
      
      </>  
      );
}
 
export default InternsPage;