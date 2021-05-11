import * as React from "react";
import { useTrail, a } from "@react-spring/web";
import styled from "styled-components";

interface TrailTextProps {
  open: boolean;
  items: string[];
  delay?: number;
  onClick?: () => void;
}

export const TrailText = (props: TrailTextProps): JSX.Element => {
  const { open, items } = props;

  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 50,
    height: open ? 50 : 0,
    from: { opacity: 0, x: 20, height: 0 },
  });

  return (
    <div>
      {trail.map(({ height, ...style }, index) => (
        <TrailsText key={index}>
          <a.div style={{ height }}>{items[index]}</a.div>
        </TrailsText>
      ))}
    </div>
  );
};

const TrailsText = styled(a.div)`
  position: relative;
  width: 100%;
  height: 30px;
  margin: 5px;
  line-height: 30px;
  color: ${(props) => props.theme.font.colors.darkGray};
  font-size: 2em;
  font-weight: 800;
  letter-spacing: -0.05em;
  will-change: transform, opacity, overflow;
  user-select: none;

  div {
    padding-right: 0.05em;
    display: flex;
    align-items: center;
    overflow: hidden;

    &:hover {
      color: ${(props) => props.theme.font.colors.white};
    }
  }
`;
