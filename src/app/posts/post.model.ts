export interface Post {
  id?: string;
  date?: Date;
  username?: string;
  title: string;
  content?: string;
  imagePath?: string;
  community?: string;
  votes?: number;
  links?: string[];
  creator?: string;
}
