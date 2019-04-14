export interface Comment {
  username: string;
  comment: string;
  postId: string;
  creator?: string;
  date?: Date;
  commentId?: string;
}
