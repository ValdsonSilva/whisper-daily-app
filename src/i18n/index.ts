import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ptChat from "./locales/pt-BR/chat.json";
import ptDailyGoal from "./locales/pt-BR/dailyGoal.json";
import ptGoalsGarden from "./locales/pt-BR/goalsGarden.json";
import ptGoalsList from "./locales/pt-BR/goalsList.json";
import ptHome from "./locales/pt-BR/home.json";
import ptNoteEditor from "./locales/pt-BR/noteEditor.json";
import ptBlockNotes from "./locales/pt-BR/blockNotes.json"; // confira o nome do arquivo
import ptAttachmentPopup from "./locales/pt-BR/attachmentPopup.json";
import ptOptions from "./locales/pt-BR/optionsPopup.json";
import ptSounds from "./locales/pt-BR/sounds.json";

import enChat from "./locales/en/chat.json";
import enDailyGoal from "./locales/en/dailyGoal.json";
import enGoalsGarden from "./locales/en/goalsGarden.json";
import enGoalsList from "./locales/en/goalsList.json";
import enHome from "./locales/en/home.json";
import enNoteEditor from "./locales/en/noteEditor.json";
import enBlockNotes from "./locales/en/blockNotes.json";
import enAttachmentPopup from "./locales/en/attachmentPopup.json";
import enOptions from "./locales/en/optionsPopup.json";
import enSounds from "./locales/en/sounds.json";



const LANG_KEY = "language" as const;

export type SupportedLang = "pt-BR" | "en";

const resources = {
    "pt-BR": {
        home: ptHome,
        dailyGoal: ptDailyGoal,
        goalsList: ptGoalsList,
        goalsGarden: ptGoalsGarden,
        blockNotes: ptBlockNotes,
        noteEditor: ptNoteEditor,
        chat: ptChat,
        attachmentPopup: ptAttachmentPopup,
        optionsPopup: ptOptions,
        sounds: ptSounds,
    },
    en: {
        home: enHome,
        dailyGoal: enDailyGoal,
        goalsList: enGoalsList,
        goalsGarden: enGoalsGarden,
        blockNotes: enBlockNotes,
        noteEditor: enNoteEditor,
        chat: enChat,
        attachmentPopup: enAttachmentPopup,
        optionsPopup: enOptions,
        sounds: enSounds,
    },
} as const;

const namespaces = Object.keys(resources["pt-BR"]) as Array<keyof typeof resources["pt-BR"]>;

export function getDeviceLanguage(): SupportedLang {
    const locale = Localization.getLocales()?.[0];

    // Ex.: "pt-BR", "en-US"
    const tag = locale?.languageTag;
    if (tag === "pt-BR") return "pt-BR";
    if (tag?.startsWith("en")) return "en";

    // Ex.: "pt", "en"
    const code = locale?.languageCode;
    if (code === "pt") return "pt-BR";
    if (code === "en") return "en";

    return "en";
}

export async function initI18n() {
    const saved = await AsyncStorage.getItem(LANG_KEY);
    const initial: SupportedLang =
        saved === "pt-BR" || saved === "en" ? saved : getDeviceLanguage();

    await i18n.use(initReactI18next).init({
        resources: resources as any, // i18next às vezes exige cast por causa do typing
        lng: initial,
        fallbackLng: "en",
        ns: namespaces as any,
        defaultNS: "home",
        interpolation: { escapeValue: false },
    });
}

export async function setAppLanguage(lang: SupportedLang) {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANG_KEY, lang);
}

export default i18n;
