
const uploadPhoto = async (axiosInstance: any, options: any): Promise<string | null> => {

    const { file, onSuccess, onError } = options; 

    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await axiosInstance.post("/uploads/photos", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 200) {
        // File uploaded successfully
        onSuccess();
        console.log('Photo uploaded successfully');
  
        const photo_url = response.data.photo_url;
  
        return photo_url;
      } else {
        // File upload failed
        onError(new Error('Upload failed'));
        console.log('Failed to upload Photo');
  
        return null;
      }
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  }

  
const uploadCv = async (axiosInstance: any, options: any): Promise<string | null> => {

    const { file, onSuccess, onError } = options; 

    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await axiosInstance.post("/uploads/cv", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 200) {
        // File uploaded successfully
        onSuccess();
        console.log('CV uploaded successfully');
  
        const cv_url = response.data.cv_url;
  
        return cv_url;
      } else {
        // File upload failed
        onError(new Error('Upload failed'));
        console.log('Failed to upload CV');
  
        return null;
      }
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  }


const deleteCv = async (axiosInstance: any, uid: string) => {
  try {
    const response = await axiosInstance.delete(`/uploads/garbage/${uid}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (response.status === 200) {
      console.log("CV is deleted");
    } else {
      console.log("CV could NOT be deleted!");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}


const deletePhoto = async (axiosInstance: any, uid: string) => {
  try {
    const response = await axiosInstance.delete(`/uploads/garbage/${uid}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (response.status === 200) {
      console.log("Photo is deleted");
    } else {
      console.log("Photo could NOT be deleted!");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}


  


  const UploadService = {
    uploadPhoto: uploadPhoto,
    uploadCv: uploadCv,
    deleteCv: deleteCv,
    deletePhoto: deletePhoto,
  }

  export default UploadService;