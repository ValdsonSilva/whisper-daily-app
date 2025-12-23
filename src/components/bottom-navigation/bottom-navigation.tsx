import { router } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function BottomNavigation() {
    return (
        // Bottom Navigation (UI only) }
        < View style={styles.bottomNav} >
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
                <Text style={styles.navIcon}>🏡</Text>
                <Text style={styles.navLabel}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dailyGoal')}>
                <Text style={styles.navIcon}>🌱</Text>
                <Text style={styles.navLabel}>Goals</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navIcon}>✨</Text>
                <Text style={styles.navLabel}>Inspired</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navIcon}>👤</Text>
                <Text style={styles.navLabel}>Profile</Text>
            </TouchableOpacity> */}
        </View >
    )
}

const styles = StyleSheet.create({
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 8,
    },
    navItem: {
        alignItems: "center",
    },
    navIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    navLabel: {
        fontSize: 11,
        color: "#4B5563",
    },
})