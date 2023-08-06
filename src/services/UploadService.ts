
const uploadPhoto = async (options: any): Promise<string | null> => {

    const { file, onSuccess, onError } = options; 

    try{

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/uploads/photos", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        // File uploaded successfully
        onSuccess();
        console.log('Photo uploaded successfully');

        const photo_url = await response.json();

        return photo_url.photo_url;
      } else {
        // File upload failed
        onError(new Error('Upload failed'));
        console.log('Failed to upload Photo');

        return null;
      }
  
    }
    catch (error) {
      console.log("Error: ", error);
      throw new Error("Error");
    }
  }

  
const uploadCv = async (options: any): Promise<string | null> => {

    const { file, onSuccess, onError } = options; 

    try{

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/uploads/cv", {
        method: "POST",
        body: formData,
      });

      
      if (response.ok) {
        // File uploaded successfully
        onSuccess();
        console.log('CV uploaded successfully');

        const cv_url = await response.json();

        return cv_url.cv_url;

      } else {
        // File upload failed
        onError(new Error('Upload failed'));
        console.log('Failed to upload CV');

        return null;
      }
  
    }
    catch (error) {
      console.log("Error: ", error);
      throw new Error("Error");
    }
  }


const deleteCv = async (uid: string) => {
  try{
    const response = await fetch(('/uploads/garbage/' + uid), {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if(response.ok){
      console.log("CV is deleted");
    }
    else{
      console.log("CV could NOT deleted!");
    }
  }
  catch (error) {
    console.log("Error: ", error);
    throw new Error("Error");
  }
}


const deletePhoto = async (uid: string) => {
  try{
    const response = await fetch(('/uploads/garbage/' + uid), {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if(response.ok){
      console.log("Photo is deleted");
    }
    else{
      console.log("Photo could NOT deleted!");
    }
  }
  catch (error) {
    console.log("Error: ", error);
    throw new Error("Error");
  }
}


  


  const UploadService = {
    uploadPhoto: uploadPhoto,
    uploadCv: uploadCv,
    deleteCv: deleteCv,
    deletePhoto: deletePhoto,
  }

  export default UploadService;