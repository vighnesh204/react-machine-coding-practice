import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import PostList from "./pages/PostList";
import Home from "./pages/Home";
import PostComments from "./pages/PostComments";

const appRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
       {
        path: "/posts",
        element: <PostList />
      },
      {
        path: "/posts/:postId",
        element: <PostComments />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={appRouter}>

  </RouterProvider>;
}

export default App;
