import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../services/wishlistService";
import { toast } from "react-toastify";
import DeletePopup from "../Components/DeletePopup";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setItems(res.data.data);
    } catch (err) {
      toast.error("Failed to load wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // 👉 OPEN POPUP
  const handleRemoveClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  // 👉 CONFIRM DELETE
  const handleConfirm = async () => {
    if (!selectedItem) return;

    try {
      setLoadingId(selectedItem._id);

      const toastId = toast.loading("Removing item...");

      await removeFromWishlist(selectedItem._id);

      toast.update(toastId, {
        render: "Removed from wishlist ❤️",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setShowPopup(false);
      setSelectedItem(null);
      fetchWishlist();
    } catch (err) {
      toast.error("Failed to remove item");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">❤️ My Wishlist</h2>

      {items.length === 0 ? (
        <div className="text-center text-muted fs-5">
          No items in wishlist 😢
        </div>
      ) : (
        <div className="row g-4">
          {items.map((item) => (
            <div className="col-md-4 col-lg-3" key={item._id}>
              <div className="card shadow-sm border-0 h-100">

                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `http://${process.env.REACT_APP_API_URL}/${item.image}`
                  }
                  className="card-img-top"
                  alt={item.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <div className="card-body text-center">
                  <h6 className="fw-bold text-truncate">
                    {item.title}
                  </h6>

                  <button
                    onClick={() => handleRemoveClick(item)}
                    className="btn btn-danger btn-sm mt-2"
                    disabled={loadingId === item._id}
                  >
                    Remove ❌
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ DELETE POPUP */}
      {selectedItem && (
        <DeletePopup
          show={showPopup}
          handleClose={() => setShowPopup(false)}
          handleConfirm={handleConfirm}
          itemName={selectedItem.title}
        />
      )}
    </div>
  );
};

export default Wishlist;