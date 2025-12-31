import { Stack } from "expo-router";
import { initI18n } from "../../src/i18n";
import "../../src/i18n"; // inicializa i18n
import { useEffect, useState } from "react";
import { View } from "react-native";

// rotas do aplicativo
export default function RootLayout() {

    const [ready, setReady] = useState(false);

    useEffect(() => {
        initI18n().then(() => setReady(true));
    }, []);

    if (!ready) return <View />; // ou Splash/Loading

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* o Expo Router descobre as telas pelos arquivos */}
            <Stack.Screen name="index" />
            <Stack.Screen name="onBoardingFirst" />
            <Stack.Screen name="onBoardingTwo" />
            <Stack.Screen name="onBoardingThree" />
            <Stack.Screen name="language" />
            <Stack.Screen name="home" />
            <Stack.Screen name="dailyGoal" />
            <Stack.Screen name="goalsList" />
            <Stack.Screen name="goalsGardenScreen" />
            <Stack.Screen name="blocknotes" />
            <Stack.Screen name="noteEditor" />
            <Stack.Screen name="whisper-chat-ai" />
            {/* <Stack.Screen name="profile" /> */}
        </Stack>
    );
}
