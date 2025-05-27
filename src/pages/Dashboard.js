import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { toastMessage } from "../utils/handler";
import { TOAST_TYPE } from "../utils/constant";

import SalesService from "../services/SalesService";
import PurchaseService from "../services/PurchaseService";
import WarehouseService from "../services/WarehouseService";
import ProductService from "../services/ProductService";

ChartJS.register(ArcElement, Tooltip, Legend);

const doughnutData = {
  labels: ["Apple", "Knorr", "Shoop", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [0, 1, 5, 8, 9, 15],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

function StatCard({ title, value, colorClass = "text-gray-900" }) {
  return (
    <article className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <strong className="block text-sm font-medium text-gray-500">
        {title}
      </strong>
      <p className={`text-2xl font-semibold ${colorClass}`}>{value}</p>
    </article>
  );
}

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [chart, setChart] = useState({
    options: {
      chart: { id: "basic-bar" },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
    series: [
      {
        name: "Monthly Sales Amount",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  const myLoginUser = JSON.parse(localStorage.getItem("user"));

  // Update Chart Data helper
  const updateChartData = (salesData) => {
    setChart((prev) => ({
      ...prev,
      series: [{ name: "Monthly Sales Amount", data: salesData }],
    }));
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const role = myLoginUser?.roleID?.name;

        const [
          totalSalesResp,
          totalPurchaseResp,
          warehousesResp,
          productsResp,
          monthlySalesResp,
        ] = await Promise.all([
          SalesService.getTotalSaleAmount(),
          PurchaseService.getTotalPurchaseAmount(),
          WarehouseService.getAll(role),
          ProductService.getAll(role),
          SalesService.getMonthlySalesData(),
        ]);

        setSaleAmount(totalSalesResp.totalSaleAmount);
        setPurchaseAmount(totalPurchaseResp.totalPurchaseAmount);
        setStores(warehousesResp);
        setProducts(productsResp);
        updateChartData(monthlySalesResp.salesAmount);
      } catch (err) {
        toastMessage(
          err?.message || "Something went wrong",
          TOAST_TYPE.TYPE_ERROR
        );
      }
    }

    fetchDashboardData();
  }, [myLoginUser]);

  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-3 lg:grid-cols-4 lg:col-span-10">
      {/* Sales and Purchase Summary Cards */}
      <StatCard
        title="Total Sales"
        value={`$${saleAmount}`}
        colorClass="text-green-600"
      />
      <StatCard
        title="Total Purchase"
        value={`$${purchaseAmount}`}
        colorClass="text-red-600"
      />

      {/* Products and Warehouses */}
      <StatCard title="Total Products" value={products.length} />
      <StatCard title="Total Warehouses" value={stores.length} />

      {/* Charts Section */}
      <div className="col-span-full flex flex-col md:flex-row items-center justify-around bg-white rounded-lg p-8 shadow-sm space-y-8 md:space-y-0 md:space-x-12">
        <div className="w-full md:w-1/2 max-w-[600px]">
          <Chart
            options={chart.options}
            series={chart.series}
            type="bar"
            width="100%"
            height={350}
          />
        </div>
        <div className="w-full md:w-1/2 max-w-[400px]">
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
