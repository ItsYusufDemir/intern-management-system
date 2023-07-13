import Form from "./InternAddingForm";
import {Intern} from "../models/Intern";

const AddInternPage = (props: {isEdit: boolean, intern?: Intern}) => {
    return ( 
        <Form isEdit={props.isEdit} intern={props.intern} />
     );
}
 
export default AddInternPage;