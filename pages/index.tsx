import * as React from "react";
import Head from "next/head";

import { Page, TrailText, Activity, Transition } from "../ui/components";

const Home = (): JSX.Element => {
  const [show, setShow] = React.useState(false);
  const [footer, setFooter] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1000);
  });

  React.useEffect(() => {
    setTimeout(() => {
      setFooter(true);
    }, 2000);
  });

  return (
    <>
      <Head>
        <title>rsjm</title>
      </Head>
      <Page title="Hi, I'm Rhys " greeting={true}>
        {show && (
          <TrailText
            open
            items={["typescript", "javascript", "node", "nextjs"]}
          />
        )}
        {footer && (
          <Transition>
            <Activity />
          </Transition>
        )}
      </Page>
    </>
  );
};

export default Home;
