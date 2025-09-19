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
  /*createdAt: Date;
updatedAt: Date;
deletedAt: Date;
*/
};

//fazer um macete com essas data required pra ser mais performático
export type Chat = {
  ownerId: string;
  title: string;
  avatar: File | string;
  description: string;
  participants: Set<string>;
};

export type Message = {
  userId: string;
  chatId: string;
  content: string;
  photo: string;
  /*
sendedAt: Date;
deletedAt: Date;
*/
};

export type ChatParticipants = {
  chatId: string;
  userId: string;
  role: string;
  /*
addedAt: Date;
exitedAt?: Date;
*/
};

export interface UserMetadata {
  browser: string;
  ip: string;
  os: string;
}
