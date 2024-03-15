const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div className="">
          <h1 className="text-3xl font-semibold text-center my-7">About Phoenix Blog</h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              Phoenix Blog is a full-stack web application built with the MERN stack. It has a React frontend, a Node.js/Express.js backend, and a MongoDB database. The application allows users to create, read, update, and delete blog posts. Users can also search for blog posts by category and sort the posts by date or title. The application is styled with Tailwind CSS and deployed to Heroku.
            </p>
            <p>
              The frontend is a single-page application that uses React Router to navigate between the home page, search page, and individual blog post pages. The backend is a RESTful API that uses Express.js to handle HTTP requests and responses. The database is a MongoDB Atlas cluster that stores the blog posts and user data. The application uses JSON Web Tokens (JWT) for authentication and authorization. The frontend and backend are hosted on Heroku, and the database is hosted on MongoDB Atlas.
            </p>
            <p>
              Phoenix Blog is a simple and easy-to-use blogging platform that allows users to create and share blog posts. It is a great tool for bloggers who want to share their thoughts and ideas with the world. The application is built with modern web technologies and follows best practices for web development. It is a great example of a full-stack web application that uses the MERN stack to create a fast, responsive, and scalable web application.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About