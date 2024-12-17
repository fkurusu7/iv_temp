import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      console.log("GET POSTS");
      try {
        const res = await fetch(
          `/api/post/getPosts?userId=${currentUser.user.id}`
        );
        const jsonRes = await res.json();

        if (!res.ok) {
          console.log("dsds");
        } else {
          if (jsonRes.length < 9) {
            setShowMore(false);
          }
          setUserPosts(jsonRes.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.user.isAdmin) getPosts();
  }, [currentUser.user.id, currentUser.user.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getPosts?userId=${currentUser.user.id}&startIndex=${startIndex}`
      );
      const jsonRes = await res.json();

      if (!res.ok) {
        console.log("error");
      } else {
        setUserPosts((prevPosts) => [...prevPosts, ...jsonRes.posts]);
        if (jsonRes.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    console.log("Post id: ", postIdToDelete);
    setShowModal(false);
    setPostIdToDelete(null);

    try {
      const res = await fetch(
        `/api/post/delete/${postIdToDelete}/${currentUser.user.id}`,
        { method: "DELETE" }
      );
      const jsonRes = await res.json();

      if (!res.ok) {
        console.log(jsonRes.message);
      } else {
        setUserPosts((posts) =>
          posts.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.user.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="text-gray-900 font-medium dark:text-teal-400 hover:underline">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category ? post.category : "⁇"}</Table.Cell>
                  <Table.Cell className="text-red-500">
                    <span
                      className="font-medium hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                    >
                      delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-teal-500 no-underline"
                    >
                      <span className="font-medium hover:underline cursor-pointer">
                        edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <Button
              gradientDuoTone="purpleToBlue"
              type="button"
              outline
              className="w-full text-gray-500 text-sm py-1 mt-2 hover:text-gray-900"
              onClick={handleShowMore}
            >
              Show more
            </Button>
          )}
        </>
      ) : (
        <p>You have n posts yet</p>
      )}

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
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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
    </div>
  );
}

export default DashPosts;
