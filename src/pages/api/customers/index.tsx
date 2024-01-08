/*
ENDPOINT: GET ALL CUSTOMERS && ADD NEW CUSTOMERS
*/

import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import NextCors from "nextjs-cors";
import { Customer, Order } from "@/utils/types";

type ReturnCustomers = {
  customers: Customer[];
};

export const getCustomers = async (): Promise<Customer[]> => {
  const mongoClient = await clientPromise;

  const data = (await mongoClient
    .db()
    .collection("customers")
    .find()
    .toArray()) as Customer[];

  return JSON.parse(JSON.stringify(data));
};

//POST: Adding new customer
export const addCustomer = async (customer: Customer): Promise<ObjectId> => {
  const mongoClient = await clientPromise;

  const response = await mongoClient
    .db()
    .collection("customers")
    .insertOne(customer);

  //user can use the id to get the customer
  return response.insertedId;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ReturnCustomers | ObjectId | { error: string }>
) => {
  await NextCors(req, res, {
    methods: ["GET", "POST"],
    origin: ["http://localhost:5173"],
    optionsSuccessStatus: 200,
  });
  // will be used by react-query to ensure data is up to date
  if (req.method === "GET") {
    const data = await getCustomers();

    res.status(200).json({ customers: data });
  } else if (req.method === "POST") {
    //expecting customer to be sent with request
    console.log(req.body);

    if (req.body.name && req.body.industry) {
      //validation to avoid bogus data database. FYI: frontend forms html/css/js can be bypassed
      const customer: Customer = {
        name: req.body.name,
        industry: req.body.industry,
        orders: req.body.orders.map((order: Order) => {
          return { ...order, _id: new ObjectId() };
        }),
      };

      const insertedId = await addCustomer(customer);
      //refresh page
      res.revalidate("/customers");
      res.revalidate("/customers/" + insertedId);

      res.status(200).json(insertedId);
    } else {
      res.status(400).json({ error: "name and industry are requirements" });
    }
  }
};

export default handler;
