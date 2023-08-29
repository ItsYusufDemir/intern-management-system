
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

const uploadDocument = async (axiosInstance: any, options: any, intern_id: string, document_name: string) => {

  const { file, onSuccess, onError } = options; 
  const document_info = {
    intern_id: intern_id,
    document_name: document_name
  }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("document_info", JSON.stringify(document_info))
  
      const response = await axiosInstance.post(`/uploads/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 200) {
        onSuccess();
        console.log('Document uploaded successfully');

        return response.data.document_url;
      } else {
        onError(new Error('Upload failed'));
        console.log('Failed to upload document');
      }
    } catch (error) {
      throw error;
    }
  
}

const deleteDocument = async (axiosInstance: any, fileName: string) => {
  try {
    await axiosInstance.delete(`/uploads/documents/${fileName}`);

    
  } catch (error) {
    throw error;
  }
}


const deleteCv = async (axiosInstance: any, uid: string, from: "garbage" | "cv") => {
  try {
    const response = await axiosInstance.delete(`/uploads/${from}/${uid}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    
  } catch (error) {
    throw error;
  }
}


const deletePhoto = async (axiosInstance: any, uid: string, from: "garbage" | "photos") => {
  try {
    const response = await axiosInstance.delete(`/uploads/${from}/${uid}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}


  


  const UploadService = {
    uploadPhoto: uploadPhoto,
    uploadCv: uploadCv,
    deleteCv: deleteCv,
    deletePhoto: deletePhoto,
    uploadDocument: uploadDocument,
    deleteDocument: deleteDocument,
  }

  export default UploadService;