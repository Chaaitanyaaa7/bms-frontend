import { ApolloProvider } from "@apollo/client";
import client from "../src/graphql/apolloClient";
import "../src/styles/globals.css";
import '../src/styles/AddBookModal.css';
import '../src/styles/AddAuthorModal.css';
import '../src/styles/EditAuthorModal.css';
import '../src/styles/EditBookModal.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
}
