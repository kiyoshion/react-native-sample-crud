import { type Timestamp } from "firebase/firestore";

export type ItemProps = {
  id: string;
  title: string;
  body: string;
  updatedAt: Timestamp;
  author: string;
}