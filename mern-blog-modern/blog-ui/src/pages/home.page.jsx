import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [errorPost, setErrorPost] = useState(null);

  const fetchLatestPosts = async () => {
    try {
      setErrorPost(null);
      setIsLoadingPost(true);
      const response = await fetch("/api/posts/getPosts?latest=true");
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }

      const data = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPosts(data.posts);
    } catch (error) {
      console.log("Error fetching posts: ", error);
      setErrorPost("Failed to load posts, Please try again later");
    } finally {
      setIsLoadingPost(false);
    }
  };

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest Blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
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
                        key={post.slug}
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
            <h1>Trending Blogs</h1>
          </InPageNavigation>
        </div>
        {/* Filter and trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <h1>Stories from all - TAGs??? probably???</h1>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
}

export default Home;
