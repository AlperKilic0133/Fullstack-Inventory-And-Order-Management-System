import axios from "axios";
import React, { useState } from "react";
import { data } from "react-router-dom";

function Categories() {
  const [categoryname, setcategoryname] = useState("");
  const [categorydescription, setcategorydescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:5000/api/category/add",
      { categoryname, categorydescription },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      },
    );
    if (response.data.success) {
      alert("kayıt eklendi");
    } else {
      console.log("kayıt eklenemedi");
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <form className=" max-w-sm mx-auto space-y-4" onSubmit={handleSubmit}>
          <h2 className="ml-11">Kategori Ekle</h2>
          <div>
            <input
              type="text"
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs"
              placeholder="Kategori Adı:"
              required
              onChange={(e) => {
                setcategoryname(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              id="visitors"
              className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
              placeholder="Kategori Açıklaması:"
              required
              onChange={(e) => {
                setcategorydescription(e.target.value);
              }}
            />
          </div>
          <button
            type="submit"
            className="ml-17 cursor-pointer text-white bg-green-600 border-green-500 hover:bg-green-400 hover:border-green-800 focus:ring-4 focus:ring-green-300 shadow-md font-semibold rounded-xl text-sm px-5 py-3 transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none"
          >
            Ekle
          </button>
        </form>
      </div>
    </div>
  );
}

export default Categories;
