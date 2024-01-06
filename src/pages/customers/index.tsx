import { NextPage, GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { getCustomers } from "../api/customers";

export type Customer = {
  _id: ObjectId;
  name: string;
  industry: string;
};

type GetCustomerResponse = {
  customers: Customer[];
};

export const getStaticProps: GetStaticProps = async (context) => {
  const data = await getCustomers();

  console.log("$$$$$$$!!!!!!!!", data);

  // const result = await axios.get<GetCustomerResponse>(
  //   "http://127.0.0.1:8000/api/customers/"
  // );
  // console.log(result);

  return {
    props: {
      customers: data,
    },
    revalidate: 60,
  };
};

const Customers: NextPage = ({
  customers,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(customers);
  return (
    <>
      <h1>Customers</h1>
      {customers.map((customer: Customer) => {
        return (
          <div key={customer._id.toString()}>
            <p>{customer._id.toString()}</p>

            <p>{customer.name}</p>
            <p>{customer.industry}</p>
          </div>
        );
      })}
    </>
  );
};

export default Customers;
