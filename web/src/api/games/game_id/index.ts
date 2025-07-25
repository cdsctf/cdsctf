import type { Game, ScoreRecord } from "@/models/game";
import type { WebResponse } from "@/types";
import { api, toSearchParams } from "@/utils/query";

export interface GetGameRequest {
  id?: number;
}

export async function getGame(request: GetGameRequest) {
  return api.get(`games/${request.id}`).json<WebResponse<Game>>();
}

export interface GetGameScoreboardRequest {
  id?: number;
  size?: number;
  page?: number;
}

export async function getGameScoreboard(request: GetGameScoreboardRequest) {
  return api
    .get(`games/${request.id}/scoreboard`, {
      searchParams: toSearchParams(request),
    })
    .json<WebResponse<Array<ScoreRecord>>>();
}
