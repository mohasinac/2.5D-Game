import { RPGFormPage } from "@/components/admin/rpg/RPGFormPage";
import { routeFormConfig } from "./rpgRouteConfig";

export default function RPGRouteCreatePage() {
  return <RPGFormPage config={routeFormConfig} mode="create" />;
}
