import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { deleteUserSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const DashSidebar = () => {

  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();
  const dispatch = useDispatch();

  const [tab, settab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');

    if (tabFromUrl) {
      settab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: 'POST',
      });

      if (!res.ok) {
        console.log("Could not sign out");
      } else {
        dispatch(deleteUserSuccess());
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {
            currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartPie} as='div' >Dashboard</Sidebar.Item>
            </Link>
          )}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div' >Profile </Sidebar.Item>
          </Link>
          {
            currentUser.isAdmin && (
              <>
                <Link to="/dashboard?tab=posts">
                  <Sidebar.Item active={tab === "posts"} icon={HiDocumentText} as="div">Posts</Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=users">
                  <Sidebar.Item active={tab === "users"} icon={HiOutlineUserGroup} as="div">Users</Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=comments">
                  <Sidebar.Item active={tab === "comments"} icon={HiAnnotation} as="div">Comments</Sidebar.Item>
                </Link>
              </>
            )
          }
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignOut}>Sign Out</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar