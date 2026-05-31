import React, { useState, useEffect } from "react";

function Products() {
  const [openModel, setopenModel] = useState(false);
  const [product, setProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [products, setProducts] = useState([]);

  // Ürünleri backend'den çek get isteği atar
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("GET /api/products çalışmıyor");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Ürünleri çekerken hata:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Kaydet veya Güncelle
  const handleSave = async () => {
    if (Number(product.stock) < 0) {
      alert("Stok miktarı 0'dan küçük olamaz!");
      return;
    }

    try {
      const method = product.id ? "PUT" : "POST";
      const url = product.id
        ? `http://localhost:5000/api/products/${product.id}`
        : "http://localhost:5000/api/products";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        await response.json();
        console.log("Ürün kaydedildi/güncellendi");
        setopenModel(false);
        setProduct({
          id: null,
          name: "",
          description: "",
          price: "",
          stock: "",
        });
        fetchProducts();
      } else {
        console.error("Kaydetme hatası:", response.statusText);
      }
    } catch (error) {
      console.error("Sunucuya bağlanırken hata:", error);
    }
  };

  // Silme
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Ürün silindi");
        fetchProducts();
      }
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  // Düzenleme
  const handleEdit = (prod) => {
    setProduct(prod);
    setopenModel(true);
  };

  return (
    <div>
      <div>
        {/* Add Item butonu */}
        <button
          onClick={() => setopenModel(true)}
          type="button"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold cursor-pointer px-3 py-1 rounded-lg shadow-md transition-all duration-300 ml-300 mt-7"
        >
          Add Item
        </button>
      </div>

      {/* Modal */}
      {openModel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              {product.id ? "Edit Item" : "Add Item"}
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded text-gray-800 placeholder-gray-500"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded text-gray-800 placeholder-gray-500"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded text-gray-800 placeholder-gray-500"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={product.stock}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded text-gray-800 placeholder-gray-500"
              min={0}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setopenModel(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ürün Tablosu */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">LIST OF PRODUCTS</h2>
        <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">NAME</th>
              <th className="border p-3 text-left">EXPLANATION</th>
              <th className="border p-3 text-left">PRICE</th>
              <th className="border p-3 text-left">STOCK</th>
              <th className="border p-3 text-left">MOVEMENTS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-red-400">
                <td className="border p-2">{p.id}</td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.description}</td>
                <td className="border p-2">{p.price}</td>
                <td className="border p-2">{p.stock}</td>
                <td className="border p-2">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg font-semibold transition duration-300 hover:scale-105 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-semibold transition duration-300 hover:scale-105 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
