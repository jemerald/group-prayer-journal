import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Layout } from "../components/Layout";

import { trpc } from "../utils/trpc";

import Head from "next/head";
import "../styles/globals.css";
import { env } from "../env/client.mjs";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {env.NEXT_PUBLIC_ENABLE_ANALYTICS ? <Analytics /> : null}
      <SpeedInsights />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
