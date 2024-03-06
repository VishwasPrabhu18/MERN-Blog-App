import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="text" placeholder="Title" required id="title" className="flex-1" />
          <Select id="category">
            <option value="uncategorized">Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.Js</option>
            <option value="nextjs">Next.Js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput typeof="file" accept="image/*" required />
          <Button type="button" gradientDuoTone="purpleToBlue" size="sm" outline>Upload Image</Button>
        </div>
        <ReactQuill theme="snow" placeholder="Write Something..." required className="h-72 mb-12"/>
        <Button type="submit" gradientDuoTone="purpleToPink">Publish Post</Button>
      </form>
    </div>
  )
}

export default CreatePost