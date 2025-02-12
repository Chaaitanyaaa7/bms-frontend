import { ApolloProvider } from "@apollo/client";
import client from "../src/graphql/apolloClient";
import "../src/styles/globals.css";

export default function MyApp({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
}
