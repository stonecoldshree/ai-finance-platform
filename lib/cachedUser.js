import { cache } from "react";
import { checkUser } from "./checkUser";

export const getCachedUser = cache(async () => {
  return await checkUser();
});
