import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Layout from "../components/Layout";

import { trpc } from "../utils/trpc";

import Head from "next/head";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
