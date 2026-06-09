import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../contexts/Theme/themeContext";
import { useAuth } from "../../hooks/Auth/useAuth";

import { useHomeHeader } from "../../hooks/Home/useHomeHeader";

import { obterSaudacao } from "../../utils/obterSaudacao";

import { styles } from "./styles";

import { useState } from "react";

export function HomeHeader() {
  const { theme } = useTheme();

  const headerStyles = styles(theme);

  const { usuario } = useAuth();

  const isResponsavel = usuario?.usuario_proprietario_id !== usuario?.id;

  const [expanded, setExpanded] = useState(false);
  const { dados, loading } = useHomeHeader(
    usuario?.usuario_proprietario_id || usuario?.id || "",
  );

  if (loading || !dados) {
    return null;
  }

  return (
    <View style={headerStyles.container}>
      {/* TOPO */}
      <View style={headerStyles.topRow}>
        <View>
          {/* BADGE */}
          <View style={headerStyles.accountBadge}>
            <Ionicons
              name={isResponsavel ? "heart-outline" : "heart-outline"}
              size={13}
              color="#FFF"
            />

            <Text style={headerStyles.accountBadgeText}>
              {isResponsavel ? "Responsável" : "Proprietário"}
            </Text>
          </View>

          {/* SAUDAÇÃO */}
          <Text style={headerStyles.greeting}>{obterSaudacao()}</Text>

          {/* NOME */}
          <Text style={headerStyles.name}>{usuario?.nome}</Text>
        </View>

        {/* FOTO */}
        {/* <TouchableOpacity */}
        <View style={headerStyles.profileButton}>
          <Text style={headerStyles.profileLetter}>
            {usuario?.nome?.charAt(0)?.toUpperCase()}
          </Text>

          {isResponsavel && (
            <View style={headerStyles.heartMiniBadge}>
              <Ionicons name="heart" size={10} color="#FFF" />
            </View>
          )}
        </View>
      </View>

      {/* CARD DIA */}
      <View style={headerStyles.card}>
        <Ionicons name="calendar-outline" size={24} color="#FFF" />

        <View>
          <Text style={headerStyles.cardTitle}>Hoje, {dados?.dataAtual}</Text>

          <Text style={headerStyles.cardSubtitle}>
            {dados?.totalMedicamentosHoje || 0} medicamentos •{" "}
            {dados?.totalTomadosHoje || 0} tomado
          </Text>
        </View>
      </View>

      {/* CARD RESPONSÁVEL */}
      {/* EXPANSÃO RESPONSÁVEL */}
      {isResponsavel && (
        <View
          style={{
            marginTop: 12,
          }}
        >
          {/* BOTÃO */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setExpanded(!expanded)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 8,
              paddingHorizontal: 4,
            }}
          >
            <Text
              style={{
                color: "#FFFFFFCC",
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Você cuida de {usuario?.usuario_proprietario_nome}
            </Text>

            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={18}
              color="#FFFFFFAA"
            />
          </TouchableOpacity>

          {/* CONTEÚDO */}
          {expanded && (
            <View style={headerStyles.careCard}>
              <View style={headerStyles.careAvatar}>
                <Text style={headerStyles.careAvatarText}>
                  {usuario?.usuario_proprietario_nome?.charAt(0)?.toUpperCase()}
                </Text>

                <View style={headerStyles.careHeart}>
                  <Ionicons name="heart" size={11} color="#FFF" />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={headerStyles.careLabel}>RESPONSÁVEL POR</Text>

                <Text style={headerStyles.careName}>
                  {usuario?.usuario_proprietario_nome}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
