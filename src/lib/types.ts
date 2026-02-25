import { type FieldValue, type Timestamp } from "firebase/firestore";

export type UserProfile = {
  uid: string;
  email: string | null;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
};

export type ProjectCreator = {
  uid: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export type CommentAuthor = ProjectCreator;

export type Comment = {
  id: string;
  text: string;
  author: CommentAuthor;
  createdAt: Timestamp;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  keywords: string[];
  likes: number;
  thumbnailUrl: string;
  mediaUrls: string[];
  creator: ProjectCreator;
  createdAt: Timestamp;
};
