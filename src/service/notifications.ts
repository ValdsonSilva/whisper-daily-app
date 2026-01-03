import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Handler global (executa sempre que uma notificação chega)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false
    }),
});

export async function registerForPush() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return null;

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    return {
        token,
        platform: Platform.OS,
    };
}
