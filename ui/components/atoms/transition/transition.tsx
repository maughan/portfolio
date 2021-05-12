import * as React from "react";
import { useTransition, config, animated } from "@react-spring/web";

interface TransitionProps {
  children: JSX.Element;
}

export const Transition = (props: TransitionProps): JSX.Element => {
  const { children } = props;
  const [show] = React.useState(true);

  const transitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: config.molasses,
  });

  return transitions(
    (styles, item) =>
      item && <animated.div style={styles}>{children}</animated.div>
  );
};
