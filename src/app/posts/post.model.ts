export interface Post {
  id?: string;
  date?: Date;
  title: string;
  content?: string;
  imagePath?: string;
  community?: string;
  votes?: number;
  links?: string[];
  creator?: string;
}
