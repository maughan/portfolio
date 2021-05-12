import * as React from "react";
import Image from "next/image";

import useSWR from "swr";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { fetcher } from "../../../../pages/api";

dayjs.extend(relativeTime);

enum DiscordStatus {
  ONLINE = "online",
  DND = "dnd",
  IDLE = "idle",
  OFFLINE = "offline",
}

export interface Spotify {
  track_id: string;
  timestamps: Timestamps;
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

interface Data {
  spotify: Spotify;
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
  const spotify = activity?.spotify;

  React.useEffect(() => {
    setInterval(() => setTime(Date.now()), 15000); // update every 15 seconds
  }, []);

  React.useEffect(() => {
    if (!isValidating) {
      mutate().then(() => {});
    }
  }, [time]);

  const avatar = `https://cdn.discordapp.com/avatars/186144292874485760/${
    activity?.discord_user?.avatar || "c35a5a9454e77a13bab73c8c23368e56"
  }.png`;

  function handlePresenceIcon() {
    if (presence) {
      if (presence.assets) {
        return `https://cdn.discordapp.com/app-assets/${BigInt(
          presence.application_id
        ).toString()}${
          presence.assets ? `/${presence.assets.large_image}` : ""
        }.png`;
      }
      if (presence.application_id === "356875057940791296") {
        return "/csgo.png";
      }
    }
    return;
  }

  return (
    <div
      className={
        "flex justify-between left-5 right-5 bottom-5 absolute padding-2 select-none"
      }
    >
      <div className={"flex bottom-0 self-end text-white"}>
        {spotify && (
          <div
            className={
              "flex flex-col justify-start align-start select-none opacity-50 hover:opacity-100 cursor-pointer"
            }
            onClick={() =>
              window.open(`https://open.spotify.com/track/${spotify.track_id}`)
            }
          >
            <div className={"flex flex-col align-end items-center sm:flex-row"}>
              <div className={"flex self-start w-100 h-100 sm:items-center "}>
                <Image
                  className={"rounded"}
                  src={spotify.album_art_url}
                  height={60}
                  width={60}
                />
              </div>
              <div
                className={
                  "flex flex-col text-left align-start justify-end mt-2 sm:mt-0 sm:ml-2"
                }
              >
                <span className={"opacity-50 text-xs"}>
                  Currently listening on Spotify
                </span>
                <span className={"text-base font-bold"}>{spotify.song}</span>
                <span className={"opacity-50 text-xs"}>
                  by {spotify.artist}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={"opacity-50 hover:opacity-100"}>
        {presence && (
          <div
            className={"flex flex-col justify-end align-end"}
            style={{ maxWidth: "10rem" }}
          >
            <div className={"flex justify-end"}>
              <Image
                className={"rounded select-none"}
                src={handlePresenceIcon()}
                height={60}
                width={60}
              />
            </div>

            <p
              className={"text-white flex flex-col text-right my-2 select-none"}
            >
              <span className={"text-base font-bold"}>{presence.name}</span>
              {presence.state && (
                <span className={"opacity-50 text-xs"}>{presence.state}</span>
              )}

              <span className={"opacity-50 text-xs"}>
                {dayjs(presence.timestamps?.start).fromNow(true)} elapsed
              </span>
            </p>
          </div>
        )}
        <div className={"flex justify-end"}>
          <div className={"flex items-center mr-2"}>
            <div className={"flex flex-col"}>
              <p
                className={
                  "font-bold text-white ml-2 flex align-center select-none"
                }
              >
                {activity?.discord_user.username}
                <p
                  className={
                    "font-light text-white opacity-50 mt-0.5 select-none"
                  }
                >
                  #{activity?.discord_user.discriminator}
                </p>
              </p>
            </div>
          </div>
          <div className={"flex object-contain"}>
            <div style={{ height: 40, width: 40 }}>
              <Image
                className={"rounded-full select-none "}
                src={avatar}
                width={40}
                height={40}
                alt={"Discord profile avatar"}
              />
            </div>
            <div
              className={"w-5 h-5 rounded-full border-4 mb-0 mt-5 -ml-3 z-10"}
              style={{
                backgroundColor:
                  activity?.discord_status === DiscordStatus.DND
                    ? "#ed4245"
                    : activity?.discord_status === DiscordStatus.IDLE
                    ? "#faa61a"
                    : activity?.discord_status === DiscordStatus.OFFLINE
                    ? "gray"
                    : "#3ba55c",
                borderColor: "#1d1f21",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
