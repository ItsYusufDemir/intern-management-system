import { Button, Form, Input, Modal, message } from "antd";
import { Team } from "../../models/Team";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import TeamService from "../../services/TeamService";
import form from "antd/es/form";
import { NoticeType } from "antd/es/message/interface";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";



interface Prop {
    team?: Team
    getData: () => void;
}   

const AddTeamForm: React.FC<Prop> = ({team, getData}) => {

    const [form] = Form.useForm();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

const onFinish = () => {
    if(team){
        team.team_name = form.getFieldsValue().team_name;
        updateTeam(team);
    }
    else{
        addTeam();
    }

    
}

useEffect(() => {
    if(team) {
        form.setFieldsValue(
            {team_name: team.team_name}
        )
    }
}, [team])

const updateTeam = async (team: Team) => {
    try {
        const response = await TeamService.updateTeam(axiosPrivate, team);

        giveMessage("success", "Team updated");
        
        getData();
      } catch (error: any) {
        if (!error?.response) {
          giveMessage("error", "No server response");
        } else {
          giveMessage("error", "Login failed!");
        }
      }
  }

const addTeam = async () => {
    try {
        const formData = form.getFieldsValue();

        const newTeam: Team = {
            team_name: formData.team_name
        }

       await TeamService.addTeam(axiosPrivate, newTeam);

       form.resetFields();
       giveMessage("success", "Team added");
       getData();
       
    } catch (error: any) {
        if (!error?.response) {
            giveMessage("error", "No server response");
          } else if (error.response?.status === 409) {
            giveMessage("error", "Team already exists");
          } else {
            giveMessage("error", "Error while adding team");
          }
    } 
}



const giveMessage = (type: NoticeType, mssge: string) => {
    message.open({
      type: type,
      content: mssge,
    });
};


    return (
        <>
        <div >
            <Form
            style={{width: 400}}
            onFinish={onFinish}
            labelCol={{span: 10}}
            wrapperCol={{span: 14}}
            form={form}
            >
                <Form.Item label="Team Name" name="team_name" rules={[{required: true, message: "Role is required!"}]}>
                <Input />
                </Form.Item>

                <Form.Item wrapperCol={{span: 24}}>
                    <Button  htmlType='submit' type='primary' block>{team ? <>Update Team</> : <>Add Team</>}</Button>
                </Form.Item>
            </Form>
            </div>

            
        </>


      );
}
 
export default AddTeamForm;