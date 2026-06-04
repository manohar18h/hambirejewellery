import axios from "axios";

const schemeApi = axios.create({
  baseURL: "https://api.hambirejewellery.com",
});



export type SchemeRegisterPayload = {
  name: string;
  village: string;
  phoneNumber: string;
  emailId: string;
  password: string;
  fullAddress: string;
  pincode: string;
  aadhaarNumber: string;
  panNumber: string;
};

export const sendSchemeOtp = async (phoneNumber: string) => {
  const res = await schemeApi.post("/scheme/auth/send-otp", {
    phoneNumber,
  });
  return res.data;
};

export const verifySchemeOtp = async (
  phoneNumber: string,
  otp: string,
) => {
  const res = await schemeApi.post("/scheme/auth/verify-otp", {
    phoneNumber,
    otp,
  });
  return res.data;
};

export const registerSchemeCustomer = async (
  data: SchemeRegisterPayload,
) => {
  const res = await schemeApi.post("/scheme/auth/register", data);
  return res.data;
};

export const loginSchemeCustomer = async (
  phoneNumber: string,
  password: string,
) => {
  const res = await schemeApi.post("/scheme/auth/login", {
    phoneNumber,
    password,
  });
  return res.data;
};

export const getSchemeDashboard = async (customerId: number) => {
  const res = await schemeApi.get(`/scheme/dashboard/${customerId}`);
  return res.data;
};

export const createPreBookingScheme = async (data: any) => {
  const res = await schemeApi.post("/scheme/pre-booking", data);
  return res.data;
};

export const createFlexi11Scheme = async (data: any) => {
  const res = await schemeApi.post("/scheme/flexi11", data);
  return res.data;
};

export const createQuickBuyScheme = async (data: any) => {
  const res = await schemeApi.post("/scheme/quick-buy", data);
  return res.data;
};