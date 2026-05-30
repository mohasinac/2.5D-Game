import { RPGListPage } from "@/components/admin/rpg/RPGListPage";
import { questListConfig } from "./rpgQuestConfig";

export default function RPGQuestListPage() {
  return <RPGListPage config={questListConfig} />;
}
