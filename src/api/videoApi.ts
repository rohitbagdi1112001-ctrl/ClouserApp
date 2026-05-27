import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getVideos = async (page = 1, limit = 12) => {
  const response = await API.get("/videos", {
    params: { page, limit },
  });

  return response.data.data;
};

export const likeVideo = async (videoId: number, action: "like" | "unlike" = "like") => {
  const response = await API.post("/like", {
    videoId,
    action,
  });

  return response.data;
};

export const getComments = async (videoId: number) => {
  const response = await API.get("/comments", {
    params: { videoId },
  });

  return response.data.data as string[];
};

export const postComment = async (videoId: number, comment: string) => {
  const response = await API.post("/comments", {
    videoId,
    comment,
  });

  return response.data.data as string;
};

export const shareVideo = async (
  videoId: number,
  platform: string
) => {
  const response = await API.post("/share", {
    videoId,
    platform
  });

  return response.data;
};