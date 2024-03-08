import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { About, CreatePost, Dashboard, Home, PostPage, Projects, SignIn, SignUp, UpdatePost } from './pages'
import { AdminPrivateRoute, FooterComp, Header, PrivateRoute, ScrollToTop } from './components/index.js'


const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      <FooterComp />
    </Router>
  )
}

export default App