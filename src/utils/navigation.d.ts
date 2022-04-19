import { GoFinancesRoutesList } from "../routes/app.routes";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends GoFinancesRoutesList {}
  }
}