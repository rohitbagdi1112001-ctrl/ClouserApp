export const shareVideo = async (title: string) => {
  await navigator.share({
    title
  });
};