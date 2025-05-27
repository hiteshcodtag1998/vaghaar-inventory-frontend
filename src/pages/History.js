import React, { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import { MdDeleteForever } from "react-icons/md";
import ConfirmationDialog from "../components/ConfirmationDialog";
import moment from "moment-timezone";
import { ROLES } from "../utils/constant";

function History() {
  const [history, setAllHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState();
  const [dialogData, setDialogData] = useState();
  const myLoginUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // Fetching all history data
  const fetchData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}history/get`, {
      headers: { role: myLoginUser?.roleID?.name, requestBy: myLoginUser?._id },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllHistory(data);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Delete item
  const deleteItem = () => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}history/delete/${selectedHistory?._id}`,
      { method: "delete", headers: { role: myLoginUser?.roleID?.name } }
    )
      .then((response) => response.json())
      .then(() => {
        setSelectedHistory();
        fetchData();
        handleClose();
      })
      .catch(() => {
        setSelectedHistory();
        handleClose();
      });
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-full md:w-11/12">
        <span className="font-semibold text-xl text-gray-900">History</span>

        {history.length > 0 ? (
          history.map((element, index) => (
            <div
              key={element._id}
              className="bg-white p-4 rounded-lg shadow-md mb-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  <div className="flex gap-3 mt-3">
                    <span
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full cursor-pointer"
                      title="Product Code"
                    >
                      Product Code: {element?.productCode || "N/A"}
                    </span>
                    <span
                      className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                      title="History Date"
                    >
                      {moment
                        .utc(element.historyDate)
                        .format("DD-MM-YYYY HH:mm")}
                    </span>
                    {element?.notes && (
                      <span
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full"
                        title="Notes"
                      >
                        Notes
                      </span>
                    )}
                  </div>
                </span>
                {[ROLES.HIDE_MASTER_SUPER_ADMIN, ROLES.SUPER_ADMIN].includes(
                  myLoginUser?.roleID?.name
                ) && (
                  <span
                    className="text-red-600 cursor-pointer hover:text-red-800"
                    onClick={() => {
                      handleClickOpen();
                      setSelectedHistory(element);
                      setDialogData({
                        title:
                          "Are you sure you want to delete this history entry?",
                        btnSecText: "Delete",
                      });
                    }}
                  >
                    <MdDeleteForever width={24} height={24} />
                  </span>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <p className="mb-2">
                  <strong>Description:</strong> {element?.description || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Notes:</strong> {element?.notes || "N/A"}
                </p>
                {/* <p className="mb-2"><strong>Product Code:</strong> {element?.productCode || 'N/A'}</p> */}
                <p className="mb-2">
                  <strong>Created By:</strong>{" "}
                  {element?.updatedById?.email || "Unknown"}
                </p>
                {/* <p className="mb-2"><strong>History Date:</strong> {
                                    // moment(element.historyDate).utc().format("DD-MM-YYYY HH:mm")
                                    // moment(element?.historyDate).format("DD-MM-YYYY HH:mm")
                                    // moment.tz(element.historyDate, moment.tz.guess()).format('DD-MM-YYYY HH:mm')
                                    // moment(element?.historyDate).tz(moment.tz.guess()).format("DD-MM-YYYY HH:mm")
                                    moment.utc(element.historyDate).format('DD-MM-YYYY HH:mm')}</p> */}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-5 rounded-lg shadow-md text-center text-sm text-gray-500">
            No history data found.
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={open}
        title={dialogData?.title || ""}
        btnFirstName="Cancel"
        btnSecondName={dialogData?.btnSecText || ""}
        handleClose={handleClose}
        handleDelete={deleteItem}
      />
    </div>
  );
}

export default History;
