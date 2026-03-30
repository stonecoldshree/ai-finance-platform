import { cache } from "react";
import { checkUser } from "./checkUser";

/**
 * Request-scoped cached version of checkUser().
 * React.cache() deduplicates calls within a single server request,
 * so Header and MainLayout both calling getCachedUser() only hits
 * Clerk + DB once.
 */
export const getCachedUser = cache(async () => {
  return await checkUser();
});
