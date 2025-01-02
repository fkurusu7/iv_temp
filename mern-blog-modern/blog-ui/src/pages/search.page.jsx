import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";

function SearchPost() {
  const { query } = useParams();
  const [posts, setPosts] = useState([]);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [errorPost, setErrorPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoadingPost(true);
        setErrorPost(null);
        const response = await fetch(`/api/posts/getPosts?searchTerm=${query}`);

        if (!response.ok && response.status !== 404) {
          throw new Error(`Error loading Posts related to: ${query}`);
        }
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPosts(jsonResponse.posts);
      } catch (error) {
        setErrorPost(error.message);
      } finally {
        setIsLoadingPost(false);
      }
    };

    fetchPosts();
  }, [query]);

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation routes={[`Search results for: ${query}`]}>
          {isLoadingPost ? (
            <div className="mt-32">
              <Loader />
            </div>
          ) : errorPost ? (
            <p>{errorPost}</p>
          ) : (
            <>
              {Array.isArray(posts) && posts.length > 0 ? (
                posts.map((post, index) => {
                  return (
                    <AnimationWrapper
                      key={post.slug + index}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <BlogPostCard post={post} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <p>No posts found</p>
              )}
            </>
          )}
        </InPageNavigation>
      </div>
    </section>
  );
}

export default SearchPost;
