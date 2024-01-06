import { NextPage, GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { MongoClient, ObjectId } from "mongodb";

export type Customer = {
  _id: ObjectId;
  name: string;
  industry: string;
};

type GetCustomerResponse = {
  customers: Customer[];
};

export const getStaticProps: GetStaticProps = async (context) => {
  // const mongoClient = new MongoClient(process.env.MONGODB!);
  const mongoClient = new MongoClient(process.env.MONGODB!);

  const data = await mongoClient.db().collection("Customers").find().toArray();

  console.log("$$$$$$$$$$$$$$$$$$$$$!!!!!!!!!!!!!!", data);

  // const result = await axios.get<GetCustomerResponse>(
  //   "http://127.0.0.1:8000/api/customers/"
  // );
  // console.log(result);

  return {
    props: {
      customers: JSON.parse(JSON.stringify(data)),
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
