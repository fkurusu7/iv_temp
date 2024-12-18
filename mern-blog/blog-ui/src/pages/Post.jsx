/* eslint-disable no-unused-vars */
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/post/getPosts?slug=${slug}`);
        const jsonRes = await res.json();

        if (!res.ok) {
          setError(jsonRes.message);
          setIsLoading(false);
          return;
        } else {
          setPost(jsonRes.posts[0]);
          setIsLoading(false);
          setError(null);
        }
      } catch (error) {
        setErrorMessage(error.message);
        setError(true);
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  console.log(post);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center uppercase font-semibold max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center"
      >
        <Button color="gray" pill size="xs" className="w-auto">
          {post && post.category}
        </Button>
      </Link>
      {/* <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      /> */}
      <div className="flex justify-between p-3 border-b border-slate-300 mx-auto max-w-2xl text-xs w-full">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
    </main>
  );
}

export default Post;
