import InternAddingForm from "./InternAddingForm";
import {Intern} from "../models/Intern";
import { Team } from "../models/Team";
import { useDataContext } from "../App";

const AddInternPage = (props: {isEdit: boolean, intern?: Intern}) => {

    const {interns, teams} = useDataContext();


    return ( 
        <InternAddingForm isEdit={props.isEdit} teams={teams} interns={interns} intern={props.intern}/>
     );
}
 
export default AddInternPage;