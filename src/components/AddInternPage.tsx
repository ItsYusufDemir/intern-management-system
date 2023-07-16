import Form from "./InternAddingForm";
import {Intern} from "../models/Intern";
import { Team } from "../models/Team";

const AddInternPage = (props: {isEdit: boolean, teams: Team[], interns: Intern[], intern?: Intern}) => {

    const onSave = (intern: Intern | undefined) => {

        if(props.isEdit)
            alert("Intern is updated!");
        else
            alert("Intern is added!");
        
    }



    return ( 
        <Form isEdit={props.isEdit} teams={props.teams} interns={props.interns} intern={props.intern} onSave={onSave} />
     );
}
 
export default AddInternPage;