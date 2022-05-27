import Head from "next/head";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";

type LayoutProps = { children: ReactNode };

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Skeleton</title>
      </Head>

      <main className="p-6">{children}</main>

      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
};
