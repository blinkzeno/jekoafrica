import { StyleSheet, Text, View } from 'react-native';

import { JekoColors, JekoFonts } from '@/constants/jeko';

/**
 * MapLibre React Native ne fournit pas de rendu web.
 * Ce fallback évite de casser le bundle web (expo start --web / export web).
 */
export default function LiveMap({ initialRoomId }: { initialRoomId?: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Carte disponible sur mobile</Text>
        <Text style={styles.body}>
          La carte interactive et le partage de position en temps réel nécessitent un development build iOS ou
          Android.
        </Text>
        {initialRoomId ? <Text style={styles.code}>Salle : {initialRoomId}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { maxWidth: 420, borderRadius: 18, backgroundColor: '#FFFFFF', padding: 20 },
  title: { fontFamily: JekoFonts.bold, fontSize: 17, color: '#0F1E1B' },
  body: { marginTop: 8, fontFamily: JekoFonts.regular, fontSize: 13, lineHeight: 19, color: '#5A6B66' },
  code: { marginTop: 12, fontFamily: JekoFonts.semibold, fontSize: 13, color: JekoColors.emerald },
});
