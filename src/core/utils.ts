import { Track } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const truncateTrackList = (tracks: Track[]) => {
  tracks.sort((a, b) => a.name.localeCompare(b.name));

  let upperBound = 12;
  let combinedLength = 0;
  const truncatedList: string[] = [];
  let remainingCount = 0;

  for (const track of tracks) {
    if (combinedLength + track.name.length <= upperBound) {
      truncatedList.push(track.name);
      combinedLength += track.name.length;
    } else {
      remainingCount++;
    }
  }

  if (remainingCount > 0) {
    truncatedList.push(`+${remainingCount}`);
  }

  return truncatedList;
};

export const formatDate = (startDate: string, endDate?: string) => {
  const start = new Date(startDate);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const startDateFormatted = new Intl.DateTimeFormat("en-US", options).format(
    start
  );

  if (endDate) {
    const end = new Date(endDate);
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const endDateFormatted = new Intl.DateTimeFormat(
      "en-US",
      timeOptions
    ).format(end);
    return `${startDateFormatted} - ${endDateFormatted}`;
  }

  return startDateFormatted;
};

export const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const formattedStart = new Intl.DateTimeFormat("en-US", options).format(
    start
  );
  const formattedEnd = new Intl.DateTimeFormat("en-US", options).format(end);

  return `${formattedStart} - ${formattedEnd}`;
};

export const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
    minutes !== 1 ? "s" : ""
  }`;
};

export const formatTrackDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
};

export async function checkAuth() {
  const jwtToken = await AsyncStorage.getItem("jwtToken");
  if (!jwtToken) {
    return false;
  }

  const response = await fetch(
    `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/users/verify`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  if (response.status !== 200) {
    await AsyncStorage.removeItem("jwtToken");
    return false;
  }

  return true;
}
