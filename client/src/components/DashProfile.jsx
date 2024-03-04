import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseApp } from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice.js';

const DashProfile = () => {

  const { currentUser } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const filePickedRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadError(null);
    setImageFileUploading(true);
    const storage = getStorage(firebaseApp);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image (File must be less than 2MB)");
        setImageFileUploadingProgress(null);
        setImageFileUrl(null);
        setImageFile(null);
        setImageFileUploading(false);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload before submitting form");
      return;
    }
    
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setUpdateUserError(data.message);
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User Profile Updated Successfully")
      }
    } catch (error) {
      setUpdateUserError(error.message);
      dispatch(updateFailure(error.message));
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickedRef} hidden />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickedRef.current.click()}>
          {imageFileUploadingProgress && (
            <CircularProgressbar value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: "absolute",
                  top: 0,
                  left: 0
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100})`,
                },
              }}
            />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt="User" className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`} />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">
            {imageFileUploadError}
          </Alert>
        )}

        <TextInput onChange={handleInputChange} type='text' id='userName' placeholder='Username' defaultValue={currentUser.userName} />
        <TextInput onChange={handleInputChange} type='email' id='email' placeholder='Email' defaultValue={currentUser.email} />
        <TextInput onChange={handleInputChange} type='password' id='password' placeholder='Enter new Password' />

        <Button type='submit' className='w-full' gradientDuoTone="purpleToBlue" outline>Update</Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>

      {updateUserSuccess && (
        <Alert color="success" className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}

      {updateUserError && (
        <Alert color="failure" className='mt-5'>
          {updateUserError}
        </Alert>
      )}
    </div>
  )
}

export default DashProfile