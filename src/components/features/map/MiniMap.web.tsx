import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { JekoColors } from '@/constants/jeko';

/**
 * MapLibre React Native ne rend pas de carte sur le web.
 * On conserve donc l'ancien visuel schématique pour l'aperçu web.
 */
export default function MiniMap() {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={[styles.hLine, { top: '32%' }]} />
        <View style={[styles.hLine, { top: '58%' }]} />
        <View style={[styles.hLine, { top: '82%' }]} />
        <View style={[styles.vLine, { left: '22%' }]} />
        <View style={[styles.vLine, { left: '48%' }]} />
        <View style={[styles.vLine, { left: '74%' }]} />
        <View style={[styles.block, { left: '38%', top: '36%', height: 64, width: 80 }]} />
        <View style={[styles.block, { right: '14%', top: '18%', height: 40, width: 56 }]} />
      </View>
      <View style={styles.pin}>
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
            fill={JekoColors.emerald}
          />
          <Circle cx={12} cy={9} r={2.6} fill="#FFFFFF" />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAF4F0' },
  grid: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  hLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#D6E6E0' },
  vLine: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#D6E6E0' },
  block: { position: 'absolute', borderRadius: 12, backgroundColor: '#DCEFE8' },
  pin: { alignItems: 'center' },
});
