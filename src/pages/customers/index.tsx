import { NextPage, GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { getCustomers } from "../api/customers";
import { useQuery } from "@tanstack/react-query";
import CustomerComponent from "@/components/CustomerComponent";

export type Customer = {
  _id?: ObjectId;
  name: string;
  industry: string;
};

type GetCustomerResponse = {
  customers: Customer[];
};

export const getStaticProps: GetStaticProps = async (context) => {
  const data = await getCustomers();

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
  customers: customersFromProps,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  //react-query
  // const query = useQuery({, {}  deconstructing => data.data.customers
  const {
    data: {
      data: { customers },
    },
  } = useQuery({
    queryKey: ["customers"],
    queryFn: () => {
      return axios("/api/customers") as any;
    },
    //get initial data from getStaticProps
    initialData: { data: { customers: customersFromProps } },
  });

  return (
    <>
      <h1>Customers</h1>
      {customers.map((customer: Customer) => {
        return <CustomerComponent customer={customer} />;
      })}
    </>
  );
};

export default Customers;
