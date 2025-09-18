export type JWTPayload = {
  id: string;
  email: string;
};

export type User = {
  authId?: string;
  email: string;
  password: string;
  avatar: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

//fazer um macete com essas data required pra ser mais performático
export type Chat = {
  id: string;
  title: string;
  avatar: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Message = {
  id: string;
  userId: string;
  chatId: string;
  content: string;
  photo: string;
  sendedAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type ChatParticipants = {
  chatId: string;
  userId: string;
  role: string;
  addedAt: Date;
  exitedAt?: Date;
};

export interface UserMetadata {
  browser: string;
  ip: string;
  os: string;
}
