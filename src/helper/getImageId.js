export const getImageId = (imageURL) => {
  const splitUrl = imageURL.split("/");
  const imageIdExt = splitUrl[splitUrl.length - 1];
  const imageId = imageIdExt.split(".")[0];
  return imageId;
};
