import { Track } from "@/types";

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
