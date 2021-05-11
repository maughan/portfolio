import styled from "styled-components";
import * as React from "react";

interface TextProps {
  children: any;
  size?: number;
  color?: string;
  weight?: number;
  style?: any;
}

export const Text = (props: TextProps): JSX.Element => {
  return <Font {...props}>{props.children}</Font>;
};

const Font = styled.p<TextProps>`
  font-size: ${(props) => props.size ?? props.theme.font.size.m}px;
  font-weight: ${(props) => props.weight ?? 400};
  color: ${(props) => props.color ?? props.theme.font.colors.black};
  margin: 0;
`;
