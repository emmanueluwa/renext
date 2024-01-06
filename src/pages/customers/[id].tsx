import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { Customer } from ".";
import axios, { AxiosError } from "axios";
import { ParsedUrlQuery } from "querystring";

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
  const params = context.params;

  // check if data found
  try {
    const result = await axios.get<{ customer: Customer }>(
      `http://127.0.0.1:8000/api/customers/${params?.id}/`
    );

    return {
      props: {
        customer: result.data.customer,
      },
      //checking for changes in db
      revalidate: 60,
    };
  } catch (err) {
    //TODO: LOOK INTO BUILDING OUT MORE ERROR CASES?
    if (err instanceof AxiosError) {
      if (err.response?.status === 404) {
        return {
          notFound: true,
          revalidate: 60,
        };
      }
    }
    return {
      props: {},
    };
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
