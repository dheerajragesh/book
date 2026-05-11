import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });

  const [preview, setPreview] = useState("");

  // 🔥 GET BOOK
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/books/${id}`);
        const book = res.data.data;

        setFormData({
          title: book.title || book.name || "",
          description: book.description || book.details || "",
          price: book.price,
          image: null,
        });

        setPreview(`http://${process.env.REACT_APP_API_URL}/${book.image}`);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBook();
  }, [id]);

  // 🔥 UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const form = new FormData();
      form.append("title", formData.title);
      form.append("name", formData.title);
      form.append("description", formData.description);
      form.append("details", formData.description);
      form.append("price", formData.price);

      if (formData.image) {
        form.append("image", formData.image);
      }

      await api.put(`/api/books/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Updated successfully");
      navigate("/display");

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // 🔥 DELETE
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/api/books/{id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Deleted successfully");
      navigate("/display");

    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3>Edit Book</h3>

      <form onSubmit={handleUpdate}>
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />

        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Price"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
        />

        {/* IMAGE */}
        {preview && (
          <img src={preview} alt="" className="mb-2" width="100%" />
        )}

        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
        />

        <button className="btn btn-success w-100 mb-2">
          Update
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="btn btn-danger w-100"
        >
          Delete
        </button>
      </form>
    </div>
  );
}

export default EditPage;
