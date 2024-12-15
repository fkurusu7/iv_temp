import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signoutSuccess,
} from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [updatedUserSuccess, setUpdatedUserSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const { isLoading, error: errorMessage } = useSelector((state) => state.user);

  const handleImageChange = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (ev) => {
    setFormData({ ...formData, [ev.target.id]: ev.target.value });
  };

  const uploadImage = async () => {};

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());

      const res = await fetch(`/api/user/delete/${currentUser.user.id}`, {
        method: "DELETE",
      });
      const jsonRes = await res.json();

      if (!res.ok) {
        dispatch(deleteFailure(jsonRes.message));
      } else {
        dispatch(deleteSuccess(jsonRes));
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const jsonRes = await res.json();

      if (!res.ok) console.log(jsonRes.message);
      else dispatch(signoutSuccess());
    } catch (error) {
      console.log("ERROR", error.message);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (Object.keys(formData).length === 0) return;

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const jsonRes = await res.json();

      console.log(jsonRes);
      if (!res.ok) {
        dispatch(updateFailure(jsonRes.message));
      } else {
        dispatch(updateSuccess(jsonRes));
        setUpdatedUserSuccess("User updated successfully!");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    } finally {
      setUpdatedUserSuccess(null);
    }
  };

  console.log(currentUser);
  return (
    <div className="w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          name="picture"
          id="picture"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className="hidden"
        />
        <div
          className="w-24 h-24 self-center border-8 border-[lightgray] cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser.user.profilePicture}
            alt="profile picture"
            className="rounded-full w-full h-full object-cover"
          />
        </div>
        <TextInput
          type="text"
          id="name"
          placeholder="username"
          defaultValue={currentUser.user.name}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.user.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Update"}
        </Button>

        {currentUser.user.isAdmin && (
          <Link to={"/create-post"}>
            <Button type="button" gradientDuoTone="purpleToBlue" outline>
              Create Post
            </Button>
          </Link>
        )}
      </form>
      {errorMessage && <div>{errorMessage}</div>}
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign put
        </span>
      </div>
      {updatedUserSuccess && (
        <Alert color="success" className="mt-5">
          {updatedUserSuccess}
        </Alert>
      )}
      {errorMessage && (
        <Alert color="failure" className="mt-5">
          {errorMessage}
        </Alert>
      )}
      {/* MODAL DELETE */}
      {showModal && (
        <Modal
          popup
          size="md"
          show={showModal}
          onClose={() => setShowModal(false)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this account?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteUser}>
                  Yes, I&apos;m sure
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default DashProfile;
