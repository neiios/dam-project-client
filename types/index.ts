import { ReactNode } from "react";

export interface Track {
  id: number;
  name: string;
  description: string;
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

export interface Article {
  id: number;
  title: string;
  authors: string;
  abstract: string;
  startDate: string;
  endDate: string;
  conferenceId: number;
  trackId: number;
  track: {
    id: number;
    room: string;
    name: string;
    description: string;
    conferenceId: number;
  };
}

export interface Track {
  id: number;
  name: string;
  description: string;
  room: string;
  conferenceId: number;
  articles: [
    {
      id: number;
      title: string;
      authors: string;
      abstract: string;
      startDate: string;
      endDate: string;
      conferenceId: number;
      trackId: number;
    }
  ];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

export interface HeaderProps {
  children: ReactNode;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user";
}
