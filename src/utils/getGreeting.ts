// src/utils/getGreeting.ts

import { LanguageCode } from "../api/auth";

type SupportedLocale = LanguageCode;

export function getGreeting(locale: SupportedLocale = "en_US"): string {
    const now = new Date();
    const hour = now.getHours(); // 0–23

    let key: "morning" | "afternoon" | "evening";

    if (hour >= 5 && hour < 12) {
        key = "morning";
    } else if (hour >= 12 && hour < 18) {
        key = "afternoon";
    } else {
        key = "evening";
    }

    if (locale === "pt_BR") {
        switch (key) {
            case "morning":
                return "Bom dia";
            case "afternoon":
                return "Boa tarde";
            case "evening":
                return "Boa noite";
        }
    }

    // default: inglês
    switch (key) {
        case "morning":
            return "Good morning";
        case "afternoon":
            return "Good afternoon";
        case "evening":
            return "Good evening";
    }
}
