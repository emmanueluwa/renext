/*
ENDPOINT: GET ALL CUSTOMERS && ADD NEW CUSTOMERS
*/

import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
import { Customer } from "@/pages/customers";

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

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ReturnCustomers>
) => {
  const data = await getCustomers();
  res.status(200).json({ customers: data });
};

export default handler;
