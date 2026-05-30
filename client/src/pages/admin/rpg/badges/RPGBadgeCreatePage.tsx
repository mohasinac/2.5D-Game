import { RPGFormPage } from "@/components/admin/rpg/RPGFormPage";
import { badgeFormConfig } from "./rpgBadgeConfig";

export default function RPGBadgeCreatePage() {
  return <RPGFormPage config={badgeFormConfig} mode="create" />;
}
