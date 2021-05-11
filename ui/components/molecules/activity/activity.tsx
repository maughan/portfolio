import * as React from "react";
import Image from "next/image";
import useSWR from "swr";

import styled from "styled-components";

import { fetcher } from "../../../../pages/api";
import { Text } from "../..";
import { theme } from "../../../../pages/_app";

enum DiscordStatus {
  ONLINE = "online",
  DND = "dnd",
  IDLE = "idle",
  OFFLINE = "offline",
}

interface Data {
  spotify: any;
  listening_to_spotify: boolean;
  discord_user: DiscordUser;
  discord_status: DiscordStatus;
  activities: Activity[];
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
}

interface DiscordUser {
  username: string;
  public_flags: number;
  id: string;
  discriminator: string;
  avatar: string;
}

interface Activity {
  type: number;
  timestamps: Timestamps;
  state: string;
  party: Party;
  name: string;
  id: string;
  details: string;
  created_at: number;
  assets: Assets;
  application_id: string;
}

interface Timestamps {
  start: number;
}

interface Party {
  id: string;
}

interface Assets {
  small_text: string;
  small_image: string;
  large_text: string;
  large_image: string;
}

export const Activity = () => {
  const {
    data: lanyard,
    mutate,
    isValidating,
  } = useSWR("https://api.lanyard.rest/v1/users/186144292874485760", fetcher);
  const [time, setTime] = React.useState(Date.now());

  const activity: Data = lanyard?.data;
  const presence: Activity = activity?.activities[0];

  React.useEffect(() => {
    setInterval(() => setTime(Date.now()), 15000); // update every 15 seconds
  }, []);

  React.useEffect(() => {
    if (!isValidating) {
      mutate();
    }
  }, [time]);

  return (
    <Container>
      <DiscordWrapper>
        <DiscordAvatarWrapper>
          <Avatar
            src={`https://cdn.discordapp.com/avatars/186144292874485760/${activity?.discord_user.avatar}
          .png`}
            width={40}
            height={40}
            alt={"Discord profile avatar"}
          />
          <Status status={activity?.discord_status || DiscordStatus.OFFLINE} />
        </DiscordAvatarWrapper>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DiscordName
            weight={theme.font.weight.bold}
            color={theme.font.colors.white}
          >
            {activity?.discord_user.username}
            <Text
              weight={theme.font.weight.regular}
              color={theme.font.colors.darkGray}
              style={{ margin: "4px 0 0 2px" }}
              size={theme.font.size.s}
            >
              #{activity?.discord_user.discriminator}
            </Text>
          </DiscordName>
        </div>
      </DiscordWrapper>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  padding: 10px;
  bottom: 10px;
  right: 10px;
`;

const DiscordWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const DiscordAvatarWrapper = styled.div`
  display: flex;
  user-select: none;
`;

const Avatar = styled(Image)`
  border-radius: 100%;
  user-select: none;
  width: 40px;
  height: 40px;
`;

const Status = styled.div<{ status: DiscordStatus }>`
  width: 12px;
  height: 12px;
  bottom: 4px;
  position: absolute;
  border-radius: 100%;
  margin-left: 25px;
  border: 4px solid ${(props) => props.theme.colors.background};

  background-color: ${(props) =>
    props.status === DiscordStatus.DND
      ? props.theme.colors.error
      : props.status === DiscordStatus.IDLE
      ? props.theme.colors.warning
      : props.status === DiscordStatus.OFFLINE
      ? "gray"
      : props.theme.colors.success};
`;

const DiscordName = styled(Text)`
  margin-left: 10px;
  display: flex;
  align-items: center;
`;
