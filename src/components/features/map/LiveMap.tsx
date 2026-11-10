import { Camera, Map, Marker, type LngLat } from '@maplibre/maplibre-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Crypto from 'expo-crypto';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { JekoColors, JekoFonts } from '@/constants/jeko';
import { LOME, MAP_STYLE, SEND_EVERY_MS } from '@/constants/map';
import { supabase } from '@/lib/supabase';

const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MY_ID = Math.random().toString(36).slice(2, 10);

type Peer = { lngLat: LngLat; ts: number };
type ChannelStatus = 'connecting' | 'connected' | 'error';

function generateRoomCode() {
  const bytes = Crypto.getRandomBytes(12);
  const chars = Array.from(bytes, (byte) => ROOM_ALPHABET[byte % ROOM_ALPHABET.length]);
  return `${chars.slice(0, 4).join('')}-${chars.slice(4, 8).join('')}-${chars.slice(8, 12).join('')}`;
}

function normalizeRoomCode(value: string) {
  const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
  return raw.replace(/(.{4})(?=.)/g, '$1-');
}

function isLngLat(value: unknown): value is LngLat {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number'
  );
}

function CopyIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 9h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z"
        stroke={JekoColors.emerald}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M15 5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7"
        stroke={JekoColors.emerald}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function SharePinIcon({ color = '#FFFFFF' }: { color?: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M12 7.5v6M9 10.5h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export default function LiveMap({ initialRoomId }: { initialRoomId?: string }) {
  const insets = useSafeAreaInsets();

  const [roomId, setRoomId] = useState(() => initialRoomId ?? generateRoomCode());
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinValue, setJoinValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<ChannelStatus>('connecting');

  const [peers, setPeers] = useState<Record<string, Peer>>({});
  const [pins, setPins] = useState<LngLat[]>([]);
  const [me, setMe] = useState<LngLat | null>(null);
  const [sharing, setSharing] = useState(false);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const ready = useRef(false);
  const lastSent = useRef(0);

  // Un « salon » = un canal Supabase Broadcast, sans table ni authentification.
  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on('broadcast', { event: 'pos' }, ({ payload }) => {
        const data = payload as { id?: unknown; lngLat?: unknown };
        if (typeof data?.id !== 'string' || data.id === MY_ID || !isLngLat(data.lngLat)) return;
        setPeers((current) => ({
          ...current,
          [data.id as string]: { lngLat: data.lngLat as LngLat, ts: Date.now() },
        }));
      })
      .on('broadcast', { event: 'pin' }, ({ payload }) => {
        const data = payload as { lngLat?: unknown };
        if (!isLngLat(data?.lngLat)) return;
        setPins((current) => [...current, data.lngLat as LngLat]);
      })
      .subscribe((nextStatus) => {
        ready.current = nextStatus === 'SUBSCRIBED';
        setStatus(
          nextStatus === 'SUBSCRIBED'
            ? 'connected'
            : nextStatus === 'CHANNEL_ERROR' || nextStatus === 'TIMED_OUT'
              ? 'error'
              : 'connecting',
        );
      });

    channelRef.current = channel;

    return () => {
      ready.current = false;
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Suivi GPS au premier plan, uniquement quand le partage est actif.
  useEffect(() => {
    if (!sharing) return;

    let subscription: Location.LocationSubscription | undefined;
    let cancelled = false;

    (async () => {
      const { status: permission } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;

      if (permission !== 'granted') {
        setSharing(false);
        Alert.alert(
          'Localisation refusée',
          'Autorise la localisation dans les réglages du téléphone pour partager ta position.',
        );
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: SEND_EVERY_MS,
          distanceInterval: 10,
        },
        (location) => {
          const lngLat: LngLat = [location.coords.longitude, location.coords.latitude];
          setMe(lngLat);

          const now = Date.now();
          if (ready.current && now - lastSent.current >= SEND_EVERY_MS) {
            lastSent.current = now;
            channelRef.current?.send({
              type: 'broadcast',
              event: 'pos',
              payload: { id: MY_ID, lngLat },
            });
          }
        },
      );
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [sharing]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const sendBroadcast = (event: 'pos' | 'pin', payload: Record<string, unknown>) => {
    if (!ready.current) return;
    channelRef.current?.send({ type: 'broadcast', event, payload });
  };

  const addPin = (lngLat: LngLat) => {
    setPins((current) => [...current, lngLat]);
    sendBroadcast('pin', { lngLat });
  };

  const handleLongPress = (lngLat: LngLat) => {
    addPin(lngLat);
  };

  const copyRoomCode = async () => {
    await Clipboard.setStringAsync(roomId);
    setCopied(true);
  };

  const submitJoin = () => {
    const nextRoom = normalizeRoomCode(joinValue);
    if (nextRoom.length < 8) {
      Alert.alert('Code invalide', 'Le code de salle doit contenir au moins 8 caractères.');
      return;
    }
    setJoinOpen(false);
    setJoinValue('');
    setPeers({});
    setMe(null);
    setSharing(false);
    setPins([]);
    setRoomId(nextRoom);
  };

  const peerCount = Object.keys(peers).length;

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={MAP_STYLE}
        onLongPress={(event) => handleLongPress(event.nativeEvent.lngLat)}>
        <Camera initialViewState={{ center: LOME, zoom: 6 }} />

        {pins.map((pin, index) => (
          <Marker key={`pin-${index}`} lngLat={pin}>
            <View style={[styles.dot, styles.pinDot]} />
          </Marker>
        ))}

        {Object.entries(peers).map(([peerId, peer]) => (
          <Marker key={peerId} lngLat={peer.lngLat}>
            <View style={[styles.dot, styles.peerDot]} />
          </Marker>
        ))}

        {me ? (
          <Marker lngLat={me}>
            <View style={[styles.dot, styles.meDot]} />
          </Marker>
        ) : null}
      </Map>

      {/* Salle de partage */}
      <View style={[styles.header, { marginTop: 12 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>Salle de partage</Text>
            <Text style={styles.roomCode} selectable>
              {roomId}
            </Text>
          </View>
          <View style={[styles.statusDot, status === 'connected' ? styles.statusOnline : null]} />
        </View>

        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Copier le code de la salle"
            onPress={copyRoomCode}
            style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}>
            <CopyIcon />
            <Text style={styles.smallButtonText}>{copied ? 'Copié' : 'Copier'}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rejoindre une autre salle"
            onPress={() => setJoinOpen((open) => !open)}
            style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}>
            <Text style={styles.smallButtonText}>{joinOpen ? 'Fermer' : 'Rejoindre'}</Text>
          </Pressable>

          <Text style={styles.peerCount}>
            {peerCount === 0 ? 'Personne pour le moment' : `${peerCount} personne${peerCount > 1 ? 's' : ''}`}
          </Text>
        </View>

        {joinOpen ? (
          <View style={styles.joinRow}>
            <TextInput
              value={joinValue}
              onChangeText={(value) => setJoinValue(value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX"
              placeholderTextColor="#9CAFA9"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={14}
              style={styles.joinInput}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Valider le code de la salle"
              onPress={submitJoin}
              style={({ pressed }) => [styles.joinButton, pressed && styles.pressed]}>
              <Text style={styles.joinButtonText}>OK</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Action principale */}
      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
        <View style={styles.hint}>
          <Text style={styles.hintText}>Appui long sur la carte pour poser un point</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={sharing ? 'Arrêter le partage de position' : 'Partager ma position'}
          onPress={() => setSharing((current) => !current)}
          style={({ pressed }) => [
            styles.shareButton,
            sharing && styles.shareButtonActive,
            pressed && styles.pressed,
          ]}>
          <SharePinIcon color={sharing ? JekoColors.emeraldDeep : '#FFFFFF'} />
          <Text style={[styles.shareButtonText, sharing && styles.shareButtonTextActive]}>
            {sharing ? 'Arrêter le partage' : 'Partager ma position'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F8F6' },
  map: { flex: 1 },

  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#0F1E1B',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  pinDot: { backgroundColor: '#E53935' },
  peerDot: { backgroundColor: '#1E88E5' },
  meDot: { backgroundColor: '#43A047', width: 22, height: 22, borderRadius: 11 },

  header: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#0B3D36',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerText: { flex: 1 },
  headerLabel: {
    fontFamily: JekoFonts.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#7A8F88',
  },
  roomCode: {
    marginTop: 2,
    fontFamily: JekoFonts.bold,
    fontSize: 19,
    letterSpacing: 1.5,
    color: '#0F1E1B',
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#C9D6D1',
    marginLeft: 8,
  },
  statusOnline: { backgroundColor: '#2BB673' },

  headerActions: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF4F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  smallButtonText: { fontFamily: JekoFonts.semibold, fontSize: 12, color: JekoColors.emerald },
  peerCount: { flex: 1, textAlign: 'right', fontFamily: JekoFonts.regular, fontSize: 11, color: '#5A6B66' },

  joinRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  joinInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D6E6E0',
    paddingHorizontal: 12,
    fontFamily: JekoFonts.semibold,
    fontSize: 14,
    letterSpacing: 1,
    color: '#0F1E1B',
  },
  joinButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: JekoColors.emerald,
  },
  joinButtonText: { fontFamily: JekoFonts.semibold, fontSize: 13, color: '#FFFFFF' },

  bottom: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    alignItems: 'center',
    gap: 10,
  },
  hint: {
    backgroundColor: 'rgba(15, 30, 27, 0.72)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hintText: { fontFamily: JekoFonts.regular, fontSize: 11, color: '#FFFFFF' },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    height: 54,
    borderRadius: 16,
    backgroundColor: JekoColors.emerald,
    shadowColor: JekoColors.emerald,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  shareButtonActive: { backgroundColor: '#FFFFFF' },
  shareButtonText: { fontFamily: JekoFonts.semibold, fontSize: 15, color: '#FFFFFF' },
  shareButtonTextActive: { color: JekoColors.emeraldDeep },

  pressed: { opacity: 0.85 },
});
