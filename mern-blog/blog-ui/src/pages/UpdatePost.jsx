import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function UpdatePost() {
  const [formData, setFormData] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleFormChange = (ev) => {
    setFormData({ ...formData, [ev.target.id]: ev.target.value });
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?postId=${postId}`);
        const jsonRes = await res.json();

        if (!res.ok) {
          console.log(jsonRes.message);
          setSubmitError(jsonRes.message);
          return;
        } else {
          setFormData(jsonRes.posts[0]);
          setSubmitError(null);
        }
      } catch (error) {
        console.log(error);
        setSubmitError(error.message);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    // console.log(formData);
    try {
      const res = await fetch(
        `/api/post/update/${formData._id}/${currentUser.user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const jsonRes = await res.json();
      console.log("RES: ", res);
      console.log("JSONRES: ", jsonRes);

      if (!res.ok) {
        setSubmitError(jsonRes.message);
      } else {
        setSubmitError(null);
        console.log("RESPONSEJSON", jsonRes);
        navigate(`/post/${jsonRes.slug}`);
      }
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={handleFormChange}
            value={formData.title}
          />
          <Select
            className="flex-2"
            id="category"
            onChange={handleFormChange}
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="react">React</option>
          </Select>
        </div>
        <div className="flex gap-4 justify-between items-center border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            Upload Image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write Content"
          className="h-72 mb-12"
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Post
        </Button>
        {submitError && (
          <Alert color="failure" className="mt-5">
            {submitError}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default UpdatePost;
