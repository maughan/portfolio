import * as React from "react";
import styled from "styled-components";

import { Text, Transition } from "../..";
import { theme } from "../../../../pages/_app";

interface PageProps {
  children: JSX.Element | JSX.Element[];
  title: string;
  greeting?: boolean;
}

export const Page = (props: PageProps): JSX.Element => {
  const { children, title, greeting } = props;
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 500);
  }, []);

  return (
    <Container>
      <Title>
        <Text
          size={theme.font.size.largest}
          weight={theme.font.weight.bolder}
          color={theme.font.colors.white}
        >
          {title}
        </Text>

        {greeting && show && (
          <Transition>
            <span style={{ fontSize: theme.font.size.largest }}>👋</span>
          </Transition>
        )}
      </Title>
      {children}
    </Container>
  );
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  max-width: 100vw;
  max-height: 100vh;
  padding: 20px;
  user-select: none;
`;

const Title = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: row;
`;
