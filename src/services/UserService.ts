import { User } from "../models/User";

const addUser = async (user: User): Promise<boolean> => {

    try{
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify(user),
        });

        console.log(response);

        if(response.ok){
            console.log(response.ok);
            return true;
        }
        else{
            console.log(response.ok);
            return false;
        }
    
      }
      catch (error) {
        console.log("Error: ", error);
        throw new Error("Error");
      }


}


const login = async (user: User) => {

    const name = user.name;
    try{
        const response = await fetch("/login/" + name, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify(user),
        });

        console.log(response);

        if(response.ok){
            console.log(response.ok);
            return true;
        }
        else{
            console.log(response.ok);
            return false;
        }
    
      }
      catch (error) {
        console.log("Error: ", error);
        throw new Error("Error");
      }

}


const UserServie = {
    addUser: addUser,
}
export default UserServie;