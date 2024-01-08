import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";
import { ParsedUrlQuery } from "querystring";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { BSONTypeError } from "bson";
import { getCustomer } from "../api/customers/[id]";
import { Customer } from "@/utils/types";

type Props = {
  customer?: Customer;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  //request data
  // const result = await axios.get("http://127.0.0.1:8000/api/customers");

  // const paths = result.data.customers.map((customer: Customer) => {
  //   return { params: { id: customer.id.toString() } };
  // });

  return {
    //all paths to be generated on build
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  // ! : of there is no id given the user will go to the index page
  const params = context.params!;

  // check if data found
  try {
    const data = await getCustomer(params.id);

    if (!data) {
      return {
        notFound: true,
        revalidate: 60,
      };
    }

    return {
      props: {
        customer: JSON.parse(JSON.stringify(data)),
      },
      //checking for changes in db
      // revalidate: 60,
    };
  } catch (err) {
    //TODO: LOOK INTO BUILDING OUT MORE ERROR CASES?
    console.log(err);

    if (err instanceof BSONTypeError) {
      return {
        notFound: true,
      };
    }
    throw err;
  }
};

const Customer: NextPage<Props> = (props) => {
  //check if data is loaded yet
  const router = useRouter();
  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return <h1>{props.customer ? props.customer.name : null}</h1>;
};

export default Customer;
