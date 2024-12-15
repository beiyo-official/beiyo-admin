import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, InputNumber, Upload, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../api/apiKey';
import "./styles/booking-form.css"
const { Option } = Select;
import axios from "axios"

const ResidentForm = () => {
  const [form] = Form.useForm();
  const [dueAmount, setDueAmount] = useState(0);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rent, setRent] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [extraDayPaymentAmount, setExtraDayPaymentAmount] = useState(0);
  const [extraDays, setExtraDays] = useState(0);
  const [load,setLoad]=useState(false);

  useEffect(() => {
    // Fetch hostels
    const fetchHostels = async () => {
      try {
        const response = await api.get('https://beiyo-admin.in/api/hostels');
        setHostels(response.data);
      } catch (error) {
        message.error('Error fetching hostels: ' + error.message);
      }
    };

    fetchHostels();
  }, []);

  const handleHostelChange = async (hostelId) => {
    try {
      const response = await api.get(`https://beiyo-admin.in/api/hostels/${hostelId}/remainingCapacityRooms`);
      setRooms(response.data);
      form.setFieldsValue({ roomNumberId: null }); // Reset room selection
    } catch (error) {
      message.error('Error fetching rooms: ' + error.message);
    }
  };

  const handleRoomSelect = (roomId) => {
    const room = rooms.find((r) => r._id === roomId);
    if (room) {
      setSelectedRoom(room.roomNumber);
      setRent(room.price);
      setDeposit(room.price);
      // Correct usage of setFieldsValue
      form.setFieldsValue({
        rent: room.price, 
        deposit: room.price,
      }); 
    }
  };
  

  const handleDateChange = (date) => {
    if (date && selectedRoom) {
      const room = rooms.find((r) => r.roomNumber === selectedRoom);
      if (room) {
        const oneDayRent = Math.ceil(room.price / 30);
        const selectedDate = date.startOf('day');
        const firstDayOfMonth = dayjs().startOf('month');

        // Check if the selected date is the 1st of the current month
        if (selectedDate.isSame(firstDayOfMonth)) {
          setExtraDayPaymentAmount(0);
          setExtraDays(0);
          form.setFieldsValue({
            extraDayPaymentAmount: 0,
          });
        } else {
          const nextMonth = date.startOf('month').add(1, 'month');
          const remainingDays = Math.ceil(nextMonth.diff(date, 'days'));
          const remainingDaysRent = oneDayRent * remainingDays;

          setExtraDayPaymentAmount(remainingDaysRent);
          setExtraDays(remainingDays);
          form.setFieldsValue({
            extraDayPaymentAmount: remainingDaysRent,
          });
        }
      }
    }
  };

  const handleFormSubmit = async (values) => {
    console.log('Form Values:', values);
    setLoad(true);
    const formData = new FormData();
  
    Object.keys(values).forEach((key) => {
      if (key === 'aadhaarCard' || key === 'image') {
        const fileList = values[key];
        if (fileList && fileList.length > 0) {
          const file = fileList[0].originFileObj;
          formData.append(key, file);
        } else {
          console.error(`No file found for ${key}`);
        }
      } else {
        formData.append(key, values[key]);
      }
    });
  
    formData.append('extraDays', extraDays);
  
    try {
      const response = await api.post('https://beiyo-admin.in/api/newResident', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Resident registered successfully!');
      setLoad(false);
      form.resetFields();
    } catch (error) {
      message.error('Error registering resident: ' + error.response?.data?.message || error.message);
      setLoad(false);
    }
  };
  
  

  const calculateDueAmount = (values) => {
    const {
      deposit,
      maintainaceCharge,
      formFee,
      extraDayPaymentAmount,
      depositStatus,
      maintainaceChargeStatus,
      formFeeStatus,
      extraDayPaymentAmountStatus,
    } = values;
    let totalDue = 0;

    if (!depositStatus) totalDue += deposit || 0;
    if (!maintainaceChargeStatus) totalDue += maintainaceCharge || 0;
    if (!formFeeStatus) totalDue += formFee || 0;
    if (!extraDayPaymentAmountStatus) totalDue += extraDayPaymentAmount || 0;

    setDueAmount(totalDue);
  };

  return (
    <div className="form-div" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Form
        form={form}
        layout="horizontal"
        onValuesChange={calculateDueAmount}
        onFinish={handleFormSubmit}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}>
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter a valid password' }]}>
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item name="mobileNumber" label="Mobile Number" rules={[{ required: true, message: 'Please enter the mobile number' }]}>
          <Input placeholder="Enter mobile number" />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input.TextArea placeholder="Enter address" />
        </Form.Item>
        <Form.Item name="parentsName" label="Parent's Name">
          <Input placeholder="Enter parent's name" />
        </Form.Item>
        <Form.Item name="parentsMobileNo" label="Parent's Mobile Number">
          <Input placeholder="Enter parent's mobile number" />
        </Form.Item>

        <Form.Item name="hostelId" label="Select Hostel" rules={[{ required: true, message: 'Please select a hostel' }]}>
          <Select placeholder="Select a hostel" onChange={handleHostelChange}>
            {hostels.map((hostel) => (
              <Option key={hostel._id} value={hostel._id}>
                {hostel.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="roomNumberId" label="Select Room" rules={[{ required: true, message: 'Please select a room' }]}>
          <Select placeholder="Select a room" disabled={!rooms.length} onChange={handleRoomSelect}>
            {rooms.map((room) => (
              <Option key={room._id} value={room._id}>
                {room.roomNumber}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="dateJoined" label="Date Joined" rules={[{ required: true, message: 'Please select the joining date' }]}>
          <DatePicker style={{ width: '100%' }} onChange={handleDateChange} />
        </Form.Item>
        <Form.Item name="contractTerm" label="Contract Term (Months)">
          <InputNumber min={1} placeholder="Enter contract term" style={{ width: '100%' }} />
        </Form.Item>
       
        <Form.Item name="rent" label="Rent"> <InputNumber value={rent} readOnly style={{ width: '100%' }} /> </Form.Item>
        <Form.Item name="deposit" label="Deposit"> <InputNumber value={deposit} readOnly style={{ width: '100%' }} /> </Form.Item>
        <Form.Item name="maintainaceCharge" label="Maintenance Charge">
          <InputNumber min={0} placeholder="Enter maintenance charge" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="formFee" label="Form Fee">
          <InputNumber min={0} placeholder="Enter form fee" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="extraDayPaymentAmount" label="Extra Day Payment Amount"> <InputNumber value={extraDayPaymentAmount} readOnly style={{ width: '100%' }} /> </Form.Item>
        <Form.Item name="depositStatus" valuePropName="checked">
          <Checkbox>Deposit Paid</Checkbox>
        </Form.Item>
        <Form.Item name="maintainaceChargeStatus" valuePropName="checked">
          <Checkbox>Maintenance Charge Paid</Checkbox>
        </Form.Item>
        <Form.Item name="formFeeStatus" valuePropName="checked">
          <Checkbox>Form Fee Paid</Checkbox>
        </Form.Item>
        <Form.Item name="extraDayPaymentAmountStatus" valuePropName="checked">
          <Checkbox>Extra Day Payment Paid</Checkbox>
        </Form.Item>

        <Form.Item 
  name="aadhaarCard" 
  label="Upload Aadhaar Card" 
  valuePropName="fileList"
  getValueFromEvent={(e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }}
  rules={[{ required: true, message: 'Please upload Aadhaar card' }]}
>
  <Upload
    maxCount={1}
    beforeUpload={() => false} // Prevent automatic upload
  >
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
</Form.Item>

<Form.Item 
  name="image" 
  label="Upload Profile Pic" 
  valuePropName="fileList"
  getValueFromEvent={(e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }}
  rules={[{ required: true, message: 'Please upload Profile Pic' }]}
>
  <Upload
    maxCount={1}
    beforeUpload={() => false} // Prevent automatic upload
  >
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
</Form.Item>



        <Form.Item label="Due Amount">
          <InputNumber value={dueAmount} readOnly style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" 
          disabled={load}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResidentForm;
