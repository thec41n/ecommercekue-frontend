import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { IoMdPeople } from "react-icons/io";
import { LuPackage2 } from "react-icons/lu";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: function (val) {
            return `Rp ${val.toLocaleString("id-ID")}`;
          },
        },
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return `Rp ${val.toLocaleString("id-ID")}`;
        },
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Trend Penjualan",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Tanggal",
        },
      },
      yaxis: {
        title: {
          text: "Penjualan",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Penjualan", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Penjualan", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg bg-[#faa4a2] p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-orange-500 text-center p-3">
              Rp
            </div>

            <p className="mt-5">Penjualan</p>
            <h1 className="text-xl font-bold">
              Rp{" "}
              {isLoading ? (
                <Loader />
              ) : (
                sales.totalSales.toLocaleString("id-ID")
              )}
            </h1>
          </div>
          <div className="rounded-lg bg-[#faa4a2] p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-orange-500 text-center p-3">
              <IoMdPeople className="w-6 h-6 text-black" />
            </div>

            <p className="mt-5">Pelanggan</p>
            <h1 className="text-xl font-bold">
              {isLoading ? <Loader /> : customers?.length}
            </h1>
          </div>
          <div className="rounded-lg bg-[#faa4a2] p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-orange-500 text-center p-3">
              <LuPackage2 className="w-6 h-6 text-black" />
            </div>

            <p className="mt-5">Semua Pesanan</p>
            <h1 className="text-xl font-bold">
              {isLoading ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="ml-[10rem] mt-[4rem]">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="70%"
          />
        </div>

        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
