export interface Track {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  conferenceId: number;
}

export interface Conference {
  id: number;
  name: string;
  longitude: string;
  latitude: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  description: string;
  location?: string;
  tracks?: Track[];
  city?: string;
}
