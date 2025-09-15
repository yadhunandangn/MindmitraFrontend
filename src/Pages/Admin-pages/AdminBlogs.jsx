import { useState, useEffect } from "react";
import authApi from "../../Api/RestAPI";

export const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await authApi.get("/admin/blogs");
        setBlogs(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Could not load blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Add or Update blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile); // file input
      }

      let response;
      if (editingBlog) {
        response = await authApi.put(
          `/admin/blogs/${editingBlog.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setBlogs((prev) =>
          prev.map((b) => (b.id === editingBlog.id ? response.data : b))
        );
      } else {
        response = await authApi.post("/admin/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setBlogs((prev) => [...prev, response.data]);
      }

      // Reset form
      setTitle("");
      setExcerpt("");
      setContent("");
      setImageFile(null);
      setEditingBlog(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save blog.");
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    try {
      await authApi.delete(`/admin/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete blog.");
    }
  };

  // Edit blog
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setImageFile(null); // we don’t pre-load image file
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black overflow-y-auto p-6">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Manage Blogs
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {loading && (
          <p className="text-gray-600 text-center">Loading blogs...</p>
        )}

        {/* Blog Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6" encType="multipart/form-data">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            required
          />
          <input
            type="text"
            placeholder="Blog Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            required
          />
          <textarea
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            rows="4"
            required
          ></textarea>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
          >
            {editingBlog ? "Update Blog" : "Add Blog"}
          </button>
        </form>

        {/* Blog List */}
        {blogs.length > 0 ? (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-4 border rounded-xl shadow-sm bg-gray-50"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <h2 className="text-xl font-bold">{blog.title}</h2>
                <p className="text-gray-600 italic mt-1">{blog.excerpt}</p>
                <p className="text-gray-700 mt-2">{blog.content}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-gray-500 text-center">No blogs available.</p>
          )
        )}
      </div>
    </div>
  );
};
