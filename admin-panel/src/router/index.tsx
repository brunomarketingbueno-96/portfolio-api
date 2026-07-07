import { createBrowserRouter, Navigate } from 'react-router-dom';

import Login from '@/pages/Login';
import Settings from '@/pages/Settings';

import ProtectedRoute from '@/components/ProtectedRoute';

import Panel from '@/pages/Panel';

import Educations from '@/pages/Educations';
import CreateEducation from '@/pages/Educations/CreateEducation';
import EditEducation from '@/pages/Educations/EditEducation';

import Projects from '@/pages/Projects';
import CreateProject from '@/pages/Projects/CreateProject';
import EditProject from '@/pages/Projects/EditProject';

import NotFound from '@/pages/NotFound';

import Services from '@/pages/Services';
import CreateService from '@/pages/Services/CreateService';
import EditService from '@/pages/Services/EditService';

import Profile from '@/pages/Profile';

import BlogPosts from '@/pages/BlogPosts';
import CreateBlogPost from '@/pages/BlogPosts/CreateBlogPost';
import EditBlogPost from '@/pages/BlogPosts/EditBlogPost';
import ViewBlogPost from '@/pages/BlogPosts/ViewBlogPost';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/panel',
        element: <Panel />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/projects',
        element: <Projects />,
      },
      {
        path: '/projects/create',
        element: <CreateProject />,
      },
      {
        path: '/projects/edit/:id',
        element: <EditProject />,
      },
      {
        path: '/educations',
        element: <Educations />,
      },
      {
        path: '/educations/create',
        element: <CreateEducation />,
      },
      {
        path: '/educations/edit/:id',
        element: <EditEducation />,
      },
      {
        path: '/services',
        element: <Services />,
      },
      {
        path: '/services/create',
        element: <CreateService />,
      },
      {
        path: '/services/edit/:id',
        element: <EditService />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/blog-posts',
        element: <BlogPosts />,
      },
      {
        path: 'blog-posts/create',
        element: <CreateBlogPost />,
      },
      {
        path: 'blog-posts/edit/:id',
        element: <EditBlogPost />,
      },
      {
        path: 'blog-posts/view/:id',
        element: <ViewBlogPost />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);
