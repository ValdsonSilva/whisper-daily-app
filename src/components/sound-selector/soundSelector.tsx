// import React, { useMemo, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import Slider from "@react-native-community/slider";
// import { Ionicons } from "@expo/vector-icons";
// import { pallete } from "../../theme/palette";

// type Props = {
//     title: string;              // ex.: "Waves"
//     durationSec: number;        // ex.: 295 (4:55)
//     initialPositionSec?: number;// ex.: 75 (1:15)
//     onPrev?: () => void;
//     onNext?: () => void;
//     onPlayPause?: (isPlaying: boolean) => void;
//     onSeek?: (positionSec: number) => void;
// };

// function formatTime(totalSeconds: number) {
//     const s = Math.max(0, Math.floor(totalSeconds));
//     const m = Math.floor(s / 60);
//     const r = s % 60;
//     return `${m}:${r.toString().padStart(2, "0")}`;
// }

// export default function SoundSelector({
//     title,
//     durationSec,
//     initialPositionSec = 0,
//     onPrev,
//     onNext,
//     onPlayPause,
//     onSeek,
// }: Props) {
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [position, setPosition] = useState(initialPositionSec);

//     const leftTime = useMemo(() => formatTime(position), [position]);
//     const rightTime = useMemo(() => formatTime(durationSec), [durationSec]);

//     const handlePlayPause = () => {
//         setIsPlaying((prev) => {
//             const next = !prev;
//             onPlayPause?.(next);
//             return next;
//         });
//     };

//     const handleSeek = (value: number) => {
//         setPosition(value);
//         onSeek?.(value);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>{title}</Text>

//             <View style={styles.progressBlock}>
//                 <Slider
//                     style={styles.slider}
//                     minimumValue={0}
//                     maximumValue={durationSec}
//                     value={position}
//                     onValueChange={handleSeek}
//                     minimumTrackTintColor={"rgba(120,145,230,0.7)"}
//                     maximumTrackTintColor={pallete.white}
//                     thumbTintColor={"rgba(120,145,230,0.7)"}
//                 />
//                 <View style={styles.timesRow}>
//                     <Text style={styles.time}>{leftTime}</Text>
//                     <Text style={styles.time}>{rightTime}</Text>
//                 </View>
//             </View>

//             <View style={styles.controls}>
//                 <TouchableOpacity
//                     onPress={onPrev}
//                     activeOpacity={0.8}
//                     style={styles.controlBtn}
//                 >
//                     <Ionicons name="play-skip-back" size={18} color={pallete.white} />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     onPress={handlePlayPause}
//                     activeOpacity={0.85}
//                     style={styles.playBtn}
//                 >
//                     <Ionicons
//                         name={isPlaying ? "pause" : "play"}
//                         size={26}
//                         color={pallete.white}
//                         style={{ marginLeft: isPlaying ? 0 : 2 }}
//                     />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     onPress={onNext}
//                     activeOpacity={0.8}
//                     style={styles.controlBtn}
//                 >
//                     <Ionicons name="play-skip-forward" size={18} color={pallete.white} />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         width: "100%",
//         borderRadius: 34,
//         paddingHorizontal: 26,
//         paddingVertical: 22,
//         marginTop: 20,

//         // “glass” do protótipo
//         backgroundColor: "transparent",
//         borderWidth: 2,
//         borderColor: pallete.white,

//         flexDirection: "row",
//         alignItems: "center",
//         gap: 18,
//     },

//     title: {
//         // width: 96,
//         fontSize: 16,
//         fontWeight: "400",
//         color: pallete.white,
//         letterSpacing: 0.2,
//     },

//     progressBlock: {
//         flex: 1,
//         width: "100%",
//         // flexDirection: "row",
//         justifyContent: "center",
//         // backgroundColor: "green",
//         // alignItems: "center"
//     },

//     slider: {
//         width: "100%",
//         height: 24,
//         // backgroundColor: "red"
//     },

//     timesRow: {
//         marginTop: -2,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         paddingHorizontal: 4,
//     },

//     time: {
//         fontSize: 14,
//         fontWeight: "500",
//         color: "rgba(120, 145, 230, 0.7)",
//     },

//     controls: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 10,
//     },

//     controlBtn: {
//         width: 18,
//         height: 18,
//         borderRadius: 20,
//         alignItems: "center",
//         justifyContent: "center",
//     },

//     playBtn: {
//         width: 32,
//         height: 32,
//         borderRadius: 28,
//         backgroundColor: "rgba(120,145,230,0.7)",
//         alignItems: "center",
//         justifyContent: "center",
//     },
// });

import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { pallete } from "../../theme/palette";

type Props = {
    title: string;
    durationSec: number;
    positionSec: number;
    isPlaying: boolean;

    onPrev?: () => void;
    onNext?: () => void;
    onPlayPause?: () => void;

    onSeekStart?: () => void;
    onSeek?: (positionSec: number) => void;          // enquanto arrasta (opcional)
    onSeekComplete?: (positionSec: number) => void;  // quando solta (recomendado)
};

function formatTime(totalSeconds: number) {
    const safe = Number.isFinite(totalSeconds) ? totalSeconds : 0;
    const s = Math.max(0, Math.floor(safe));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function SoundSelector({
    title,
    durationSec,
    positionSec,
    isPlaying,
    onPrev,
    onNext,
    onPlayPause,
    onSeekStart,
    onSeek,
    onSeekComplete,
}: Props) {
    const leftTime = useMemo(() => formatTime(positionSec), [positionSec]);
    const rightTime = useMemo(() => formatTime(durationSec), [durationSec]);

    const max = durationSec > 0 ? durationSec : 1;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.progressBlock}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={max}
                    value={Math.min(positionSec, max)}
                    onSlidingStart={onSeekStart}
                    onValueChange={(v) => onSeek?.(v)}
                    onSlidingComplete={(v) => onSeekComplete?.(v)}
                    minimumTrackTintColor={"rgba(120,145,230,0.7)"}
                    maximumTrackTintColor={pallete.white}
                    thumbTintColor={"rgba(120,145,230,0.7)"}
                />
                <View style={styles.timesRow}>
                    <Text style={styles.time}>{leftTime}</Text>
                    <Text style={styles.time}>{rightTime}</Text>
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={onPrev} activeOpacity={0.8} style={styles.controlBtn}>
                    <Ionicons name="play-skip-back" size={18} color={pallete.white} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onPlayPause} activeOpacity={0.85} style={styles.playBtn}>
                    <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={26}
                        color={pallete.white}
                        style={{ marginLeft: isPlaying ? 0 : 2 }}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={onNext} activeOpacity={0.8} style={styles.controlBtn}>
                    <Ionicons name="play-skip-forward" size={18} color={pallete.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 34,
        paddingHorizontal: 26,
        paddingVertical: 22,
        marginTop: 20,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: pallete.white,
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },
    title: {
        fontSize: 16,
        fontWeight: "400",
        color: pallete.white,
        letterSpacing: 0.2,
    },
    progressBlock: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
    },
    slider: {
        width: "100%",
        height: 24,
    },
    timesRow: {
        marginTop: -2,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },
    time: {
        fontSize: 14,
        fontWeight: "500",
        color: "rgba(120, 145, 230, 0.7)",
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    controlBtn: {
        width: 18,
        height: 18,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    playBtn: {
        width: 32,
        height: 32,
        borderRadius: 28,
        backgroundColor: "rgba(120,145,230,0.7)",
        alignItems: "center",
        justifyContent: "center",
    },
});

