import { Stack } from "expo-router";

// rotas do aplicativo
export default function RootLayout() {
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
