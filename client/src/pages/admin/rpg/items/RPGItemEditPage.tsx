import { RPGFormPage } from "@/components/admin/rpg/RPGFormPage";
import { itemFormConfig } from "./rpgItemConfig";

export default function RPGItemEditPage() {
  return <RPGFormPage config={itemFormConfig} mode="edit" />;
}
