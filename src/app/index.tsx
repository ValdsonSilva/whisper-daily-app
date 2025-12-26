// app/index.tsx
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, StyleSheet, View } from "react-native";


export default function Index() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          // Usuário já logado (anônimo ou não) -> vai direto pra home
          router.replace("/home");
        } else {
          // Não tem login ainda -> começa o onboarding
          router.replace("/onBoardingFirst");
          // ou qualquer rota inicial do seu flow
        }
      } catch (error) {
        console.log("Erro ao verificar auth:", error);
        // Em caso de erro, manda pro onboarding mesmo assim
        router.replace("/onBoardingFirst");
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, []);

  // Telinha de loading enquanto decide pra onde ir
  if (isChecking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return null;

  // return (
  //   <OnboardingFirst onNext={() => router.push("/onBoardingTwo")} />
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
