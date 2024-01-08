import { ObjectId } from "mongodb";

export type Order = {
  description: string;
  cost: { $numberDecimal: string };
  _id: ObjectId;
};

export type Customer = {
  _id?: ObjectId;
  name: string;
  industry: string;
  orders: Order[];
};

export type GetCustomerResponse = {
  customers: Customer[];
};
