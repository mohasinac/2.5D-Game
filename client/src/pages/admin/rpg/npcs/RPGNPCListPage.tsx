import { RPGListPage } from "@/components/admin/rpg/RPGListPage";
import { npcListConfig } from "./rpgNpcConfig";

export default function RPGNPCListPage() {
  return <RPGListPage config={npcListConfig} />;
}
