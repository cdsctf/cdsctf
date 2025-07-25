import type { WebResponse } from "@/types";
import { api } from "@/utils/query";

interface DeleteUserAvatarRequest {
  user_id: number;
}

export async function deleteUserAvatar(request: DeleteUserAvatarRequest) {
  return api
    .delete(`admin/users/${request.user_id}/avatar`)
    .json<WebResponse<never>>();
}
