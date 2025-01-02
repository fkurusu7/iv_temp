import { Link } from "react-router-dom";
import { formatShortDate } from "../utils/helpers";

function BlogPostCard({ post }) {
  /*
      {
        "userId": {
          "personal_info": {
            "fullname": "kurusu",
            "username": "kurusu",
            "profile_img": "https://api.dicebear.com/6.x/fun-emoji/svg?seed=Mia"
          },
          "_id": "67638ebeba6accb3c7e80ea5"
        },
        "title": "Another Logging metric",
        "banner": "https://fkblogtestbucket.s3.us-east-2.amazonaws.com/3HJwGHI2rSkS-yPoCFCA3-1735506675005.jpeg",
        "description": "Another Logging metric",
        "tags": [
          "6771bb1a5567b9b467357b61"
        ],
        "createdAt": "2024-12-29T21:11:54.218Z",
        "slug": "another-logging-metric"
      }
  */
  const {
    userId: {
      personal_info: { fullname, username, profile_img: profileImg },
    },
    title,
    banner,
    description,
    tags,
    createdAt,
    slug,
  } = post;

  return (
    <Link className="flex items-center justify-between mb-4 border-b border-grey">
      <div className="w-full mb-7">
        {/* USER info */}
        <div className="flex gap-2 items-center mb-2 ">
          <img
            src={profileImg}
            alt="User Image"
            className="w-6 h-6 rounded-full"
          />
          <p className="line-clamp-1 text-sm">
            {fullname} @{username}
          </p>
          <p className="min-w-fit text-sm">{formatShortDate(createdAt)}</p>
        </div>
        {/* POST info */}
        <h1 className="blog-title">{title}</h1>
        <p className="my-1 text-xl font-gelasio leading-7 line-clamp-1">
          {description}
        </p>
        <div className="flex flex-col">
          <div className="mt-3 flex gap-4">
            {tags.map((tag) => {
              // add Link to tag page
              return (
                <span key={tag.name} className="btn-light py-1 px-4 text-sm">
                  {tag.name}
                </span>
              );
            })}
          </div>
          <span className="mt-2 ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl"></i>4
          </span>
        </div>
      </div>
      <div className="h-28 bg-grey">
        <img
          src={banner}
          alt="post banner"
          className="w-full h-full object-cover aspect-square"
        />
      </div>
    </Link>
  );
}

export default BlogPostCard;
