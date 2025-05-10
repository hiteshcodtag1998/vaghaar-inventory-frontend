import React, { useState, useEffect, useContext } from "react";
import axios from 'axios'
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";
import { toastMessage } from "../utils/handler";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import { FaDownload } from "react-icons/fa6";
import { CircularProgress, Tooltip } from "@mui/material";
import UpdateSale from "../components/UpdateSale";
import { MdDeleteForever, MdEdit } from "react-icons/md";
// import moment from "moment";
import moment from 'moment-timezone';
import ConfirmationDialog from "../components/ConfirmationDialog";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [brands, setAllBrands] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [warehouses, setAllWarehouses] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [pdfBtnLoaderIndexes, setPdfBtnLoaderIndexes] = useState([]);
  const [showUpdateSaleModal, setUpdateSaleModal] = useState(false);
  const [updateSale, setUpdateSale] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState();
  const myLoginUser = JSON.parse(localStorage.getItem("user"));

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
    fetchBrandData();
    fetchWarehouseData();
  }, [updatePage]);

  // Fetching Data of All Sales
  const fetchSalesData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}sales/get`, {
      headers: { role: myLoginUser?.roleID?.name, requestBy: myLoginUser?._id, }
    })
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
      })
      .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}product/get`, {
      headers: { role: myLoginUser?.roleID?.name }
    })
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
  };

  // Fetching Data of All Brrand items
  const fetchBrandData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}brand/get`, {
      headers: { role: myLoginUser?.roleID?.name }
    })
      .then((response) => response.json())
      .then((data) => {
        setAllBrands(data);
      })
      .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
  };

  // Fetching Data of All Stores
  const fetchStoresData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}store/get`, {
      headers: { role: myLoginUser?.roleID?.name }
    })
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  // Fetching Data of All Warehouse items
  const fetchWarehouseData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}warehouse/get`, {
      headers: { role: myLoginUser?.roleID?.name }
    })
      .then((response) => response.json())
      .then((data) => {
        setAllWarehouses(data);
      })
      .catch((err) => toastMessage(err?.message || "Something goes wrong", TOAST_TYPE.TYPE_ERROR));
  };

  const handleDownload = async (data, index) => {
    try {
      // Set the loader to true for the specific index
      setPdfBtnLoaderIndexes(prevIndexes => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = true;
        return newIndexes;
      });

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}sales/sale-pdf-download`, data, {
        responseType: 'arraybuffer',
      });
      console.log('response', response)
      // Assuming the server returns the PDF content as a blob
      // setPdfData(new Blob([response.data], { type: 'application/pdf' }));

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.open(url, '_blank');
      setPdfBtnLoaderIndexes(prevIndexes => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = false;
        return newIndexes;
      });
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      setPdfBtnLoaderIndexes(prevIndexes => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] = false;
        return newIndexes;
      });
      console.log('Error', error)
    }
  }

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Modal for Sale Update
  const updateSaleModalSetting = (selectedSaleData) => {
    setUpdateSale(selectedSaleData);
    setUpdateSaleModal(!showUpdateSaleModal);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Delete item
  const deleteItem = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}sales/delete/${updateSale?._id}`,
      { method: 'delete', headers: { role: myLoginUser?.roleID?.name }, })
      .then((response) => response.json())
      .then(() => {
        setUpdateSale()
        setUpdatePage(!updatePage);
        handleClose()
      }).catch(() => {
        setUpdateSale()
        handleClose()
      });
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            brands={brands}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
            warehouses={warehouses}
          />
        )}
        {showUpdateSaleModal && (
          <UpdateSale
            brands={brands}
            products={products}
            authContext={authContext}
            updateSaleData={updateSale}
            updateModalSetting={updateSaleModalSetting}
            fetchSalesData={fetchSalesData}
            warehouses={warehouses}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Sales</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addSaleModalSetting}
              >
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add Sales
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product Name
                </th>
                {/* <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Store Name
                </th> */}
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Brand Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock Sold
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Customer Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Warehouse Name
                </th>
                {
                  myLoginUser?.roleID?.name === ROLES.HIDE_MASTER_SUPER_ADMIN && <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Status
                  </th>
                }
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Sales Date
                </th>
                <th className="whitespace-nowrap text-left font-medium text-gray-900">
                  Action
                </th>
                {/* <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total Sale Amount
                </th> */}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {
                sales?.length === 0 && <div
                  className="bg-white w-50 h-fit flex flex-col gap-4 p-4 "
                >
                  <div className="flex flex-col gap-3 justify-between items-start">
                    <span>No data found</span>
                  </div>
                </div>
              }
              {sales.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.ProductID?.name}
                    </td>
                    {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.StoreID?.name}
                    </td> */}
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.BrandID?.name || ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.StockSold}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.SupplierName || ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element?.warehouseID?.name || ""}
                    </td>
                    {
                      myLoginUser?.roleID?.name === ROLES.HIDE_MASTER_SUPER_ADMIN && <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                        {element?.isActive ? "Availble" : "Deleted"}
                      </td>
                    }
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {new Date(element.SaleDate).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                        ? "Today"
                        : element?.SaleDate
                          ? moment.tz(element.SaleDate, moment.tz.guess()).format('DD-MM-YYYY HH:mm')
                          : null
                        // moment(element.SaleDate, "YYYY-MM-DD HH:mm").format("DD-MM-YYYY HH:mm")
                      }
                    </td>
                    <td>
                      <div className="flex">
                        <Tooltip title="Edit" arrow>
                          <span
                            className="text-green-700 cursor-pointer"
                            onClick={() => updateSaleModalSetting(element)}
                          >
                            <MdEdit />
                          </span>
                        </Tooltip>
                        <Tooltip title="Download Sale Note" arrow>
                          <span
                            className="text-green-700 px-2 flex"
                          >
                            {pdfBtnLoaderIndexes[index] ? <CircularProgress size={20} /> :
                              <FaDownload className={`cursor-pointer ${pdfBtnLoaderIndexes[index] && "block"}`} onClick={() => handleDownload(element, index)} />
                            }
                          </span>
                        </Tooltip>
                        {/* Conditional delete button for roles */}
                        {[ROLES.HIDE_MASTER_SUPER_ADMIN, ROLES.SUPER_ADMIN].includes(
                          myLoginUser?.roleID?.name
                        ) && (
                            <Tooltip title="Delete" arrow>
                              <span
                                className="text-red-600 pr-2 cursor-pointer"
                                onClick={() => {
                                  handleClickOpen();
                                  setUpdateSale(element);
                                  setDialogData({
                                    title: 'Are you sure want to delete?',
                                    btnSecText: 'Delete',
                                  });
                                }}
                              >
                                <MdDeleteForever width={50} height={50} />
                              </span>
                            </Tooltip>
                          )}
                      </div>
                    </td>
                    {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ${element.TotalSaleAmount}
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationDialog
        open={open}
        title={dialogData?.title || ""}
        btnFirstName="Cancel"
        btnSecondName={dialogData?.btnSecText || ""}
        handleClose={handleClose}
        handleDelete={deleteItem} />
    </div>
  );
}

export default Sales;
