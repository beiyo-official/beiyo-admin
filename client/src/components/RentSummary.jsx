import React, { useState, useEffect } from "react";
import { Card, Table, DatePicker, Spin, message, Tabs } from "antd";
import axios from "axios";
import moment from "moment";
import api from "../../api/apiKey";

const { TabPane } = Tabs;

const RentSummaryPage = () => {
  const [currentRent, setCurrentRent] = useState([]);
  const [nextMonthRent, setNextMonthRent] = useState([]);
  const [pastMonthRent, setPastMonthRent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment()); // For past-month data

  // Table Columns
  const columns = [
    {
      title: "Hostel ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Hostel Name",
      dataIndex: "hostel",
      key: "hostel",
    },
    {
      title: "SuccessFull Rent",
      dataIndex: "totalSuccessfullRent",
      key: "totalSuccessfullRent",
      render: (value) => `₹${value.toLocaleString()}`,
    },
    {
      title:"Expected Rent",
      dataIndex: "expectedRent",
      key:"expectedRent",
      render: (value) => `₹${value.toLocaleString()}`
    },
    {
      title: "Rent Due",
      dataIndex:"rentDue",
      key:"rentDue",
      render: (value) => `₹${value.toLocaleString()}`
    },
    {
      title:"Occupancy Rate",
      dataIndex: "occupancyRate",
      key:"occupancyRate",
      render: (value) => `${Math.ceil(value)}%`
    },
    {
      title:"Owner Rent",
      dataIndex: "ownerRent",
      key:"ownerRent",
      render: (value) => `₹${value.toLocaleString()}`
    },
    {
      title:"Gross Profit",
      dataIndex: "grossProfit",
      key:"grossProfit",
      render: (value) => `₹${value.toLocaleString()}`
    },

  ];
  const futureRentColumns = [
    {
      title: "Hostel ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Hostel Name",
      dataIndex: "hostel",
      key: "hostel",
    },
    {
      title: "Rent Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value) => `₹${value.toLocaleString()}`,
    },
  ];

  // Fetch Current Month Rent
  const fetchCurrentMonthRent = async () => {
    setLoading(true);
    try {
      const response = await api.get("https://beiyo-admin.in/api/hostels/rent/current-month");
      setCurrentRent(response.data);
    } catch (error) {
      message.error("Failed to fetch current month rent data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Next Month Expected Rent
  const fetchNextMonthRent = async () => {
    setLoading(true);
    try {
      const response = await api.get("https://beiyo-admin.in/api/hostels/rent/next-month-expected");
      setNextMonthRent(response.data);
    } catch (error) {
      message.error("Failed to fetch next month expected rent data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Past Month Rent
  const fetchPastMonthRent = async (month, year) => {
    setLoading(true);
    try {
      const response = await api.get("https://beiyo-admin.in/api/hostels/rent/past-months", {
        params: { month, year },
      });
      setPastMonthRent(response.data);
    } catch (error) {
      message.error("Failed to fetch past month rent data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Month Change for Past Month
  const handleMonthChange = (date) => {
    if (!date) return;
    setSelectedMonth(date);
    fetchPastMonthRent(date.month() + 1, date.year());
  };

  // Fetch Data on Component Mount
  useEffect(() => {
    fetchCurrentMonthRent();
    fetchNextMonthRent();
  }, []);

  return (
    <Card title="Monthly Summary" style={{ margin: "20px", marginLeft:"5rem", }}>
      <Tabs defaultActiveKey="1">
        {/* Current Month Rent */}
        <TabPane tab="Current Month Rent" key="1">
          {loading ? (
            <Spin tip="Loading Current Month Rent..." />
          ) : (
            <Table
              columns={columns}
              dataSource={currentRent.map((item) => ({
                ...item,
                amount: item.totalRent,
              }))}
              rowKey="_id"
              bordered
              pagination={{ pageSize: 5 }}
            />
          )}
        </TabPane>

        {/* Next Month Expected Rent */}
        <TabPane tab="Next Month Expected Rent" key="2">
          {loading ? (
            <Spin tip="Loading Next Month Expected Rent..." />
          ) : (
            <Table
              columns={futureRentColumns}
              dataSource={nextMonthRent.map((item) => ({
                ...item,
                amount: item.expectedRent,
              }))}
              rowKey="_id"
              bordered
              pagination={{ pageSize: 5 }}
            />
          )}
        </TabPane>

        {/* Past Month Rent */}
        <TabPane tab="Past Month Rent" key="3">
          <div style={{ marginBottom: "20px" }}>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ width: "100%" }}
            />
          </div>
          {loading ? (
            <Spin tip="Loading Past Month Rent..." />
          ) : (
            <Table
              columns={columns}
              dataSource={pastMonthRent.map((item) => ({
                ...item,
                amount: item.successfullRent,
              }))}
              rowKey="_id"
              bordered
              pagination={{ pageSize: 5 }}
            />
          )}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default RentSummaryPage;
