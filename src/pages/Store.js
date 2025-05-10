import React, { useState, useEffect } from "react";
import AddStore from "../components/AddStore";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);
  const [added, setAdded] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [added === true]);

  useEffect(() => {
    if (!showModal)
      setAdded(false)
  }, [showModal]);

  // Fetching all stores data
  const fetchData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}store/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center ">
      <div className=" flex flex-col gap-5 w-11/12 border-2">
        <div className="flex justify-between">
          <span className="font-bold">Manage Store</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
            onClick={modalSetting}
          >
            Add Store
          </button>
        </div>
        {showModal && <AddStore setAdded={setAdded} />}
        {
          stores?.length === 0 && <div
            className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
          >
            <div className="flex flex-col gap-3 justify-between items-start">
              <span>No data found</span>
            </div>
          </div>
        }
        {stores.map((element, index) => {
          return (
            <div
              className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
              key={element._id}
            >
              <div>
                {
                  element?.image && <img
                    alt="store"
                    className="h-60 w-full object-cover"
                    src={element.image}
                  />
                }

              </div>
              <div className="flex flex-col gap-3 justify-between items-start">
                <span className="font-bold">{element.name}</span>
                <div className="flex">
                  <img
                    alt="location-icon"
                    className="h-6 w-6"
                    src={require("../assets/location-icon.png")}
                  />
                  <span>{element.address + ", " + element.city}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Store;
