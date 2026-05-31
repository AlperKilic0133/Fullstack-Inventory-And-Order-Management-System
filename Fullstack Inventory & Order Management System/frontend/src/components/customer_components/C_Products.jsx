import React, { useEffect, useState } from "react";
import axios from "axios";

function C_Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({}); // her ürün için adet takibi

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);

        // ürünler yüklenince varsayılan adetleri 1 yap
        const initialQuantities = {};
        response.data.forEach((p) => {
          initialQuantities[p.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error(err);
        setError("Ürünler yüklenemedi");
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: parseInt(value),
    }));
  };

  const handleBuy = async (product) => {
    const quantity = quantities[product.id];
    if (quantity > product.stock) {
      alert(`En fazla ${product.stock} adet alabilirsiniz!`);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders", {
        productId: product.id,
        quantity,
      });
      alert(`${quantity} adet ${product.name} satın alındı`);
    } catch (err) {
      console.error(err);
      alert("Satın alma başarısız");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">NAME</th>
            <th className="border px-4 py-2">PRICE</th>
            <th className="border px-4 py-2">STOCK</th>
            <th className="border px-4 py-2">COUNT</th>
            <th className="border px-4 py-2">PROCESS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-amber-100">
              <td className="border px-4 py-2">{product.id}</td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.price} ₺</td>
              <td className="border px-4 py-2">{product.stock}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantities[product.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product.id, e.target.value)
                  }
                  className="w-16 border rounded px-2 py-1"
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleBuy(product)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                >
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default C_Products;
