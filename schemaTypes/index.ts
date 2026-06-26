import property from "./property";
import editorial from "./editorial";
import siteSettings from "./siteSettings";
import legalPage from "./legalPage";
import feesPage from "./feesPage";
import editorialIndexPage from "./editorialIndexPage";
import propertyIndexPage from "./propertyIndexPage";
import personProfile from "./personProfile";
import contactPage from "./documents/contactPage";
import methodPage from "./documents/methodPage";
import homePage from "./homePage";

import { localizedTypes } from "./localized";

// 🔹 BLOCS
import contentInfoBlock from "./contentInfoBlock";
import editorialQuote from "./editorialQuote";
import patrimonyFocus from "./patrimonyFocus";
import cinematicManifestoBlock from "./cinematicManifestoBlock";

export const schemaTypes = [
  ...localizedTypes,

  // 🔹 DOCUMENTS
  property,
  editorial,
  siteSettings,
  legalPage,
  feesPage,
  editorialIndexPage,
  propertyIndexPage,
  personProfile,
  contactPage,
  methodPage,
  homePage,

  // 🔹 BLOCS
  contentInfoBlock,
  editorialQuote,
  patrimonyFocus,
  cinematicManifestoBlock,
];