import { KeyIcon, RefreshCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { createToken, getToken } from "@/api/games/game_id/teams/profile/token";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldIcon } from "@/components/ui/field";
import { TextField } from "@/components/ui/text-field";
import { useGameStore } from "@/storages/game";
import { cn } from "@/utils";

export default function Index() {
  const { currentGame, selfTeam, members } = useGameStore();
  const [token, setToken] = useState<string>();

  const disabled = Date.now() / 1000 > Number(currentGame?.ended_at);

  useEffect(() => {
    if (!currentGame?.id || !selfTeam?.id) return;
    getToken({
      game_id: currentGame.id!,
      team_id: selfTeam.id!,
    }).then((res) => {
      setToken(res.data);
    });
  }, [currentGame?.id, selfTeam?.id]);

  function handleCreateToken() {
    if (!currentGame || !selfTeam) return;
    createToken({
      game_id: currentGame.id!,
      team_id: selfTeam.id!,
    }).then((res) => {
      setToken(res.data);
    });
  }

  return (
    <div
      className={cn([
        "flex",
        "flex-col",
        "flex-1",
        "p-10",
        "xl:mx-50",
        "lg:mx-30",
        "gap-8",
      ])}
    >
      <div className={cn(["flex", "gap-5", "items-center"])}>
        <Field className={cn(["flex-1"])}>
          <FieldIcon>
            <KeyIcon />
          </FieldIcon>
          <TextField
            readOnly
            disabled={disabled}
            value={
              token ? `${selfTeam?.id ?? ""}:${token || ""}` : "暂无邀请码"
            }
            onChange={() => {}}
          />
        </Field>

        <Button
          icon={<RefreshCcwIcon />}
          variant={"solid"}
          onClick={handleCreateToken}
          size={"lg"}
          disabled={disabled}
        >
          生成新邀请码
        </Button>
      </div>
      <div className={cn(["grid", "grid-cols-2", "gap-5"])}>
        {members?.map((user) => (
          <Link key={user?.id} to={`/users/${user?.id}`}>
            <Card className={cn(["p-3", "flex", "gap-3", "items-center"])}>
              <Avatar
                src={`/api/users/${user?.id}/avatar`}
                fallback={user?.name?.charAt(0)}
              />
              <div>
                <p className={cn(["text-md"])}>{user?.name}</p>
                <p
                  className={cn(["text-sm", "text-secondary-foreground"])}
                >{`# ${user?.username}`}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
