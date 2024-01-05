import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { Customer } from ".";
import axios from "axios";
import { ParsedUrlQuery } from "querystring";

type Props = {
  customer: Customer;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  //request data
  const result = await axios.get("http://127.0.0.1:8000/api/customers");

  const paths = result.data.customers.map((customer: Customer) => {
    return { params: { id: customer.id.toString() } };
  });

  return {
    //all paths to be generated on build
    paths: paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const params = context.params;

  const result = await axios.get<{ customer: Customer }>(
    `http://127.0.0.1:8000/api/customers/${params?.id}/`
  );
  console.log("RES$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$:", result);
  return {
    props: {
      customer: result.data.customer,
    },
  };
};

const Customer: NextPage<Props> = (props) => {
  return <h1>{props.customer.name}</h1>;
};

export default Customer;
