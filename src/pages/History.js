import React, { useState, useEffect, useContext } from "react";
import { Tooltip } from "@mui/material";
import { MdDeleteForever, MdHistory } from "react-icons/md";
import ConfirmationDialog from "../components/ConfirmationDialog";
import moment from "moment-timezone";
import { ROLES, TOAST_TYPE } from "../utils/constant";
import AuthContext from "../AuthContext";
import HistoryService from "../services/HistoryService";
import { toastMessage } from "../utils/handler";

function History() {
  const authContext = useContext(AuthContext);

  const [history, setAllHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState();
  const [dialogData, setDialogData] = useState();

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // Fetching all history data
  const fetchHistoryData = async () => {
    try {
      const data = await HistoryService.getAll(
        authContext?.user?.roleID?.name,
        authContext?.user?._id
      );
      setAllHistory(data);
    } catch (err) {
      toastMessage(
        err?.message || "Something goes wrong",
        TOAST_TYPE.TYPE_ERROR
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Delete item
  const deleteItem = async () => {
    try {
      await HistoryService.delete(
        selectedHistory?._id,
        authContext?.user?.roleID?.name
      );
      setSelectedHistory(undefined);
      fetchHistoryData();
      handleClose();
    } catch (err) {
      setSelectedHistory(undefined);
      handleClose();
    }
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-7 w-full md:w-11/12">
        <header className="flex items-center gap-3 border-b border-gray-300 pb-3">
          <MdHistory className="text-blue-600 w-5 h-5" />
          <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">
            History
          </span>
        </header>

        {history.length > 0 ? (
          history.map((element) => (
            <article
              key={element._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 cursor-default
                     hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 ease-in-out"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap gap-4 max-w-[75%]">
                  <span
                    className="px-4 py-1 text-xs font-semibold tracking-wide text-blue-700 bg-blue-100 rounded-full select-none"
                    title="Product Code"
                  >
                    Product Code: {element?.productCode ?? "N/A"}
                  </span>
                  <span
                    className="px-4 py-1 text-xs font-semibold tracking-wide text-green-700 bg-green-100 rounded-full select-none"
                    title="History Date"
                  >
                    {moment.utc(element.historyDate).format("DD-MM-YYYY HH:mm")}
                  </span>
                  {element?.notes && (
                    <span
                      className="px-4 py-1 text-xs font-semibold tracking-wide text-yellow-800 bg-yellow-100 rounded-full select-none"
                      title="Notes"
                    >
                      Notes
                    </span>
                  )}
                </div>

                {[ROLES.HIDE_MASTER_SUPER_ADMIN, ROLES.SUPER_ADMIN].includes(
                  authContext?.user?.roleID?.name
                ) && (
                  <button
                    onClick={() => {
                      handleClickOpen();
                      setSelectedHistory(element);
                      setDialogData({
                        title:
                          "Are you sure you want to delete this history entry?",
                        btnSecText: "Delete",
                      });
                    }}
                    aria-label="Delete history entry"
                    title="Delete History Entry"
                    className="text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md p-1"
                  >
                    <MdDeleteForever className="w-7 h-7" />
                  </button>
                )}
              </div>

              <section className="mt-5 space-y-3 text-gray-800 text-sm leading-relaxed select-text">
                <p>
                  <strong className="font-semibold">Description:</strong>{" "}
                  {element?.description ?? "N/A"}
                </p>
                <p>
                  <strong className="font-semibold">Notes:</strong>{" "}
                  {element?.notes ?? "N/A"}
                </p>
                <p>
                  <strong className="font-semibold">Created By:</strong>{" "}
                  {element?.updatedById?.email ?? "Unknown"}
                </p>
              </section>
            </article>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center bg-white p-10 rounded-xl border border-gray-200 shadow-sm text-gray-400 select-none">
            <MdHistory className="w-16 h-16 mb-4" />
            <p className="text-lg font-semibold">No history data found.</p>
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={open}
        title={dialogData?.title ?? ""}
        btnFirstName="Cancel"
        btnSecondName={dialogData?.btnSecText ?? ""}
        handleClose={handleClose}
        handleDelete={deleteItem}
      />
    </div>
  );
}

export default History;

{
  /* <p className="mb-2"><strong>History Date:</strong> {
                                    // moment(element.historyDate).utc().format("DD-MM-YYYY HH:mm")
                                    // moment(element?.historyDate).format("DD-MM-YYYY HH:mm")
                                    // moment.tz(element.historyDate, moment.tz.guess()).format('DD-MM-YYYY HH:mm')
                                    // moment(element?.historyDate).tz(moment.tz.guess()).format("DD-MM-YYYY HH:mm")
                                    moment.utc(element.historyDate).format('DD-MM-YYYY HH:mm')}</p> */
}
