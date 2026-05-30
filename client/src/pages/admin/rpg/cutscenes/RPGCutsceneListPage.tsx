import { RPGListPage } from "@/components/admin/rpg/RPGListPage";
import { cutsceneListConfig } from "./rpgCutsceneConfig";

export default function RPGCutsceneListPage() {
  return <RPGListPage config={cutsceneListConfig} />;
}
