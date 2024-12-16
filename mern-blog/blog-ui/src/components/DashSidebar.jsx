import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser.user.isAdmin ? "admin" : "user"}
            labelColor={"dark"}
            as="div"
          >
            <Link to={"/dashboard?tab=profile"}>User</Link>
          </Sidebar.Item>
          {currentUser.user.isAdmin && (
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              as="div"
            >
              <Link to={"/dashboard?tab=posts"}>Posts</Link>
            </Sidebar.Item>
          )}
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
