import React, { useEffect, useRef, useCallback } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Platform,
  PanResponder,
  Easing,
} from "react-native";
import { useTheme } from "@/mobile/contexts/Theme/themeContext";

type MessageType = "success" | "warning" | "error";

interface MensagemProps {
  text: string;
  type: MessageType;
  onClose: () => void;
  duration?: number;
}

export const Mensagem = ({
  text,
  type,
  onClose,
  duration = 3000,
}: MensagemProps) => {
  const { theme } = useTheme();

  // 🔥 animações
  const translateY = useRef(new Animated.Value(-100)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // 🎨 cores
  const bgColors = {
    success: "#d4edda",
    warning: "#fff3cd",
    error: "#f8d7da",
  };

  const stylesColors = {
    success: {
      bg: bgColors.success,
      color: theme.colors.success,
      border: "#c3e6cb",
    },
    warning: {
      bg: bgColors.warning,
      color: theme.colors.warning,
      border: "#ffeeba",
    },
    error: {
      bg: bgColors.error,
      color: theme.colors.error,
      border: "#f5c6cb",
    },
  };

  const currentStyle = stylesColors[type] || stylesColors.success;

  // 🧠 gesto de swipe
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 10;
      },

      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);

        // fade enquanto arrasta
        const newOpacity = 1 - Math.min(Math.abs(gesture.dx) / 200, 1);
        opacity.setValue(newOpacity);
      },

      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > 120) {
          // 🔥 remove igual notificação
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: gesture.dx > 0 ? 400 : -400,
              duration: 300,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(onClose);
        } else {
          // 🔥 volta suave
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const handleAutoClose = useCallback(() => {
    translateX.setValue(0);

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 500,
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  }, [translateX, opacity, onClose]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: Platform.OS === "ios" ? 60 : 40,
        damping: 18,
        stiffness: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      handleAutoClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleAutoClose, opacity, translateY]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          backgroundColor: currentStyle.bg,
          borderColor: currentStyle.border,
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={handleAutoClose}>
        <Text style={[styles.text, { color: currentStyle.color }]}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    left: 20,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    zIndex: 9999,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
