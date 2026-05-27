
export interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  shares: number;
  comments?: string[];
  type: "mp4" | "youtube";
}