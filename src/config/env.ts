type Env = {
  API_URL: string | undefined;
  MODE: string | undefined;
  IMGURL: string | undefined;
};

export const env: Env = {
  API_URL: process.env.API_URL,
  MODE: process.env.MODE,
  IMGURL: process.env.IMGURL,
};
