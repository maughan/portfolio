import * as React from "react";

import { Page, TrailText, Activity } from "../ui/components";

const Home = (): JSX.Element => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1000);
  });

  return (
    <Page title="Hi, I'm Rhys " greeting={true}>
      {show && (
        <TrailText
          open
          items={["typescript", "javascript", "node", "nextjs"]}
        />
      )}
      <Activity />
    </Page>
  );
};

export default Home;
