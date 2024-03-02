import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { About, Dashboard, Home, Projects, SignIn, SignUp } from './pages'
import { FooterComp, Header, PrivateRoute } from './components/index.js'


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      <FooterComp />
    </Router>
  )
}

export default App