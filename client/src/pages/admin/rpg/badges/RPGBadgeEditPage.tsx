import { RPGFormPage } from "@/components/admin/rpg/RPGFormPage";
import { badgeFormConfig } from "./rpgBadgeConfig";

export default function RPGBadgeEditPage() {
  return <RPGFormPage config={badgeFormConfig} mode="edit" />;
}
