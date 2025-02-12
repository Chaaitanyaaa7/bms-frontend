import { Html, Head, Main, NextScript } from "next/document";
import { Component } from "react";

class MyDocument extends Component {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
