import { Camera, Map, Marker, type CameraRef, type LngLat } from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { JekoColors, JekoFonts } from '@/constants/jeko';
import { LOME, MAP_STYLE } from '@/constants/map';
import { NEARBY_COURIERS } from '@/data/nearbyCouriers';
import { offsetLngLat } from '@/lib/geo';

type Props = {
  /** Centre la carte sur la position connue si l'utilisateur a déjà autorisé la localisation. */
  followUser?: boolean;
  /** Affiche le bouton d'agrandissement (masqué quand la carte occupe déjà tout l'écran). */
  showExpand?: boolean;
};

/** Délai maximal d'attente d'une position avant d'afficher la vue par défaut. */
const POSITION_TIMEOUT_MS = 4000;
/** Niveau de zoom avant le « plongeon » animé. */
const ZOOM_START = 11.6;
/** Niveau de zoom final, centré sur l'utilisateur. */
const ZOOM_USER = 15;
/** Niveau de zoom final si la position de l'utilisateur est inconnue. */
const ZOOM_CITY = 12.6;

/**
 * Aperçu cartographique réel et manipulable (déplacement, pincement, double tap).
 * Des commandes de recentrage et d'agrandissement évitent de perdre l'utilisateur
 * après une manipulation.
 */
export default function MiniMap({ followUser = true, showExpand = true }: Props) {
  const [me, setMe] = useState<LngLat | null>(null);
  const [resolved, setResolved] = useState(!followUser);
  const [canAskPosition, setCanAskPosition] = useState(false);

  const cameraRef = useRef<CameraRef>(null);

  const center = me ?? LOME;
  const centerKey = `${center[0].toFixed(5)},${center[1].toFixed(5)}`;

  // Réutilise une permission déjà accordée (aucun prompt automatique sur l'accueil).
  const readPosition = useCallback(async (): Promise<LngLat | null> => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      setCanAskPosition(true);
      return null;
    }

    setCanAskPosition(false);
    const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: 10 * 60 * 1000 });
    const coords =
      lastKnown?.coords ??
      (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })).coords;

    return [coords.longitude, coords.latitude];
  }, []);

  // Réévalué à chaque retour sur l'accueil : si la permission vient d'être accordée
  // depuis l'écran carte, l'aperçu se recentre sur l'utilisateur.
  useFocusEffect(
    useCallback(() => {
      if (!followUser) return;

      let cancelled = false;
      let settled = false;

      const timeout = setTimeout(() => {
        if (cancelled || settled) return;
        settled = true;
        setResolved(true);
      }, POSITION_TIMEOUT_MS);

      (async () => {
        try {
          const position = await readPosition();
          if (cancelled || !position) return;
          setMe((current) =>
            current && current[0] === position[0] && current[1] === position[1] ? current : position,
          );
        } catch {
          // Position indisponible : on garde simplement la vue sur Lomé.
        } finally {
          if (!cancelled && !settled) {
            settled = true;
            clearTimeout(timeout);
            setResolved(true);
          }
        }
      })();

      return () => {
        cancelled = true;
        clearTimeout(timeout);
      };
    }, [followUser, readPosition]),
  );

  // Effet « snap » : la carte apparaît de loin puis plonge sur la position.
  useEffect(() => {
    if (!resolved) return;

    const timer = setTimeout(() => {
      cameraRef.current?.zoomTo(me ? ZOOM_USER : ZOOM_CITY, { duration: 1100 });
    }, 350);

    return () => clearTimeout(timer);
  }, [resolved, centerKey, me]);

  const couriers = useMemo(
    () =>
      NEARBY_COURIERS.map((courier) => ({
        ...courier,
        position: offsetLngLat(center, courier.dx, courier.dy),
      })),
    [center],
  );

  const requestPosition = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const position = await readPosition();
      if (position) {
        setMe(position);
        setResolved(true);
      }
    } catch {
      // Silencieux : l'utilisateur peut réessayer.
    }
  };

  const recenter = () => {
    cameraRef.current?.flyTo({ center, zoom: me ? ZOOM_USER : ZOOM_CITY, duration: 700 });
  };

  return (
    <View style={styles.container}>
      {resolved ? (
        <Map style={styles.map} mapStyle={MAP_STYLE}>
          {/* La clé replace la caméra quand la position est résolue ou actualisée. */}
          <Camera key={centerKey} ref={cameraRef} initialViewState={{ center, zoom: ZOOM_START }} />

          {couriers.map((courier) => (
            <Marker key={courier.id} lngLat={courier.position}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Voir la fiche de ${courier.firstName}`}
                hitSlop={6}
                onPress={() =>
                  router.push(`/(client)/(home)/courier/${courier.id}` as Href)
                }
                style={({ pressed }) => [
                  styles.avatar,
                  { backgroundColor: courier.color },
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.avatarText}>{courier.initial}</Text>
              </Pressable>
            </Marker>
          ))}

          {me ? (
            <Marker lngLat={me} anchor="bottom">
              <UserPin />
            </Marker>
          ) : null}
        </Map>
      ) : null}

      {resolved ? (
        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Recentrer sur ma position"
            onPress={recenter}
            style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]}>
            <LocateIcon />
          </Pressable>
          {showExpand ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ouvrir la carte en plein écran"
              onPress={() => router.push('/(client)/(home)/nearby' as Href)}
              style={({ pressed }) => [styles.controlButton, pressed && styles.pressed]}>
              <ExpandIcon />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {resolved && canAskPosition ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Activer ma position"
          onPress={requestPosition}
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <Text style={styles.ctaText}>Activer ma position</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function UserPin() {
  return (
    <Svg width={24} height={30} viewBox="0 0 24 30" fill="none">
      <Path
        d="M12 0C5.37 0 0 5.37 0 12c0 8.25 12 18 12 18s12-9.75 12-18C24 5.37 18.63 0 12 0Z"
        fill={JekoColors.emerald}
        stroke="#FFFFFF"
        strokeWidth={1.6}
      />
      <Circle cx={12} cy={12} r={4} fill="#FFFFFF" />
    </Svg>
  );
}

function LocateIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={6.5} stroke={JekoColors.emerald} strokeWidth={1.8} />
      <Circle cx={12} cy={12} r={2} fill={JekoColors.emerald} />
      <Path
        d="M12 2v3M12 19v3M2 12h3M19 12h3"
        stroke={JekoColors.emerald}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ExpandIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"
        stroke={JekoColors.emerald}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF4F0' },
  map: { flex: 1 },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#0F1E1B',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  avatarText: {
    fontFamily: JekoFonts.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },

  controls: {
    position: 'absolute',
    right: 8,
    bottom: 10,
    gap: 8,
  },
  controlButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F1E1B',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  cta: {
    position: 'absolute',
    bottom: 12,
    left: 10,
    backgroundColor: JekoColors.emerald,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#0B3D36',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  ctaText: { fontFamily: JekoFonts.semibold, fontSize: 11, color: '#FFFFFF' },
  pressed: { opacity: 0.85 },
});
