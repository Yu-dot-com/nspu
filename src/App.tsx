import { HashRouter as Router, Routes, Route, createHashRouter, RouterProvider } from 'react-router-dom';
// import Home from './pages/Home';
import Main from './layout/main';
import File from './pages/Dashboard';
import Inbox from './pages/Inbox';
import OutBox from './pages/Outbox';
import Tags from './pages/Tags';
import Department from './pages/Department';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPw from './pages/ForgotPw';
import Setting from './settings/Setting';
import HiddenFile from './pages/HiddenFile';
import Profile from './settings/ChgPw';
import ManageCat from './settings/ManageCat';
import ManageDepartment from './settings/ManageDepartment';
import ManageUser from './settings/ManageUser';
import ProtectRoute from './utils/ProtectRoute';
import Detail from './pages/detail';
import School from './pages/School';
import ResetPassword from './pages/ResetPassword';
// import Noti from './pages/Noti';

const router = createHashRouter([
  {
      path: "/setting",
      element: (
        <ProtectRoute>
          <Setting/>
        </ProtectRoute>
      ),
      children: [
        {
          index: true,
          element:<Profile/>
        },
        {
          path: "manageCategory",
          element: <ManageCat/>
        },
        {
          path: "manageDepartment",
          element: <ManageDepartment/>
        },
        {
          path: "manageUser",
          element: <ManageUser/>
        }
      ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/signup",
    element: <SignUp/>
  },
  {
    path: "/forgotPw",
    element: <ForgotPw/>
  },
  {
    path: "/resetPassword",
    element: <ResetPassword/>
  },
  {
    path: "/",
    element: (
      <ProtectRoute>
        <Main/>
      </ProtectRoute>
    ),
    children: [
      {
        index: true,
        element: <Department/>
      },
      {
        path: "inbox",
        element: <Inbox/>
      },
      {
        path: "outbox",
        element: <OutBox/>
      },
      {
        path: "school",
        element: <School/>
      },
      {
        path: "tags",
        element: <Tags/>
      },
      {
        path: "department",
        element: <File/>
      },
      {
        path: "hidden",
        element: <HiddenFile/>
      },
      {
        path: "detail/:id",
        element: <Detail/>
      }
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} />;
}