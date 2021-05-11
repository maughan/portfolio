import * as React from "react";
import Image from "next/image";

import useSWR from "swr";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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

export interface Emoji {
  name: string;
  id: number;
  animated: boolean;
}

export interface Activity {
  type: number;
  state: string;
  name: string;
  id: string;
  emoji?: Emoji;
  created_at: number;
  application_id?: string;
  timestamps?: Timestamps;
  party?: Party;
  details?: string;
  assets?: Assets;
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
  const presence: Activity = activity?.activities.find(
    (activity) => activity.type === 0
  );
  const spotify = activity?.activities.find((activity) => activity.type === 2);

  React.useEffect(() => {
    setInterval(() => setTime(Date.now()), 15000); // update every 15 seconds
  }, []);

  React.useEffect(() => {
    if (!isValidating) {
      mutate();
    }
  }, [time]);

  const avatar = `https://cdn.discordapp.com/avatars/186144292874485760/${activity?.discord_user.avatar}.png`;

  return (
    <Container>
      <div>{spotify && JSON.stringify(spotify.details)}</div>
      <div>
        {presence && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <ActivityImage
              src={`https://cdn.discordapp.com/app-assets/${BigInt(
                presence.application_id
              ).toString()}/${presence.assets.large_image}.png`}
              height={50}
              width={50}
            />

            <p
              style={{
                color: "white",
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
                margin: "10px 0 10px 0",
              }}
            >
              <span
                style={{
                  fontSize: theme.font.size.m,
                  fontWeight: theme.font.weight.bold,
                }}
              >
                {presence.name}
              </span>
              <span style={{ opacity: 0.5, fontSize: theme.font.size.s }}>
                {presence.state}
              </span>
              <span style={{ opacity: 0.5, fontSize: theme.font.size.s }}>
                {presence.details}
              </span>
              <span style={{ opacity: 0.5, fontSize: theme.font.size.s }}>
                {dayjs(presence.timestamps?.start).fromNow(true)} elapsed
              </span>
            </p>
          </div>
        )}
        <DiscordWrapper>
          <DiscordAvatarWrapper>
            <Avatar
              src={avatar}
              width={40}
              height={40}
              alt={"Discord profile avatar"}
            />
            <Status
              status={activity?.discord_status || DiscordStatus.OFFLINE}
            />
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
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  left: 10px;
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

const ActivityImage = styled(Image)`
  border-radius: 10px;
  z-index: 100 !important;
  position: absolute !important;
  right: 0 !important;
`;
