import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type CourseType = 'colis' | 'courses' | 'document' | 'autre';
type Size = 'petit' | 'moyen' | 'grand';

const TYPES: { key: CourseType; label: string; sub: string; icon: string }[] = [
  { key: 'colis', label: 'Colis', sub: 'Objets, paquets, achats', icon: 'inventory-2' },
  { key: 'courses', label: 'Courses', sub: 'Achats boutique, marché', icon: 'shopping-bag' },
  { key: 'document', label: 'Document', sub: 'Plis, contrats urgents', icon: 'description' },
  { key: 'autre', label: 'Autre', sub: 'Demande sur mesure', icon: 'auto-awesome' },
];

const SIZES: { key: Size; label: string; sub: string; icon: string }[] = [
  { key: 'petit', label: 'Petit format', sub: 'Moins de 2 kg (pochette, repas)', icon: 'inventory' },
  { key: 'moyen', label: 'Format standard', sub: '2 à 7 kg (compatible top-case moto)', icon: 'inventory' },
  { key: 'grand', label: 'Volumineux', sub: 'Plus de 7 kg (tricycle recommandé)', icon: 'local-shipping' },
];

export default function NewRequestScreen() {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState<CourseType>('colis');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState<Size>('moyen');
  const [price, setPrice] = useState(1500);
  const [quote, setQuote] = useState(false);

  const fmt = (n: number) => n.toLocaleString('fr-FR');

  return (
    <View className="flex-1 bg-[#ECFDF8]">
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="h-16 px-5 flex-row items-center justify-between bg-[#ECFDF8]/80" style={{ paddingTop: insets.top }}>
        <Pressable
          onPress={() => router.back()}
          className="w-11 h-11 -ml-1 rounded-full items-center justify-center active:scale-95">
          <MaterialIcons name="arrow-back" size={24} color="#0F1E1B" />
        </Pressable>
        <Text className="font-jeko-bold text-lg text-[#0F1E1B] text-center max-w-[200px]" numberOfLines={1}>
          Nouvelle Demande
        </Text>
        <View className="w-8 h-8 rounded-full bg-[#00614F] items-center justify-center">
          <MaterialIcons name="person" size={18} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-4 pb-28"
        showsVerticalScrollIndicator={false}>
        {/* Progress stepper */}
        <View className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center justify-between relative overflow-hidden mb-6">
          <View className="absolute left-10 right-10 top-7 h-0.5 bg-[#D5E6E1] -z-0" />
          <View className="absolute left-10 w-1/3 top-7 h-0.5 bg-[#0E7C66] -z-0" />
          <View className="flex-col items-center gap-1 z-10">
            <View className="w-7 h-7 rounded-full bg-[#0E7C66] items-center justify-center">
              <Text className="font-jeko-bold text-xs text-white">1</Text>
            </View>
            <Text className="font-jeko-semibold text-[11px] text-[#00614F]">Détails</Text>
          </View>
          <View className="flex-col items-center gap-1 z-10">
            <View className="w-7 h-7 rounded-full bg-[#E0F2EC] items-center justify-center">
              <Text className="font-jeko-semibold text-xs text-[#3E4945]">2</Text>
            </View>
            <Text className="font-jeko text-[11px] text-[#3E4945]">Lieux</Text>
          </View>
          <View className="flex-col items-center gap-1 z-10">
            <View className="w-7 h-7 rounded-full bg-[#E0F2EC] items-center justify-center">
              <Text className="font-jeko-semibold text-xs text-[#3E4945]">3</Text>
            </View>
            <Text className="font-jeko text-[11px] text-[#3E4945]">Résumé</Text>
          </View>
        </View>

        {/* Section 1: Type de course */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-jeko-bold text-lg text-[#0F1E1B]">Type de course</Text>
            <View className="bg-[#E0F2EC] px-2.5 py-1 rounded-full">
              <Text className="font-jeko-semibold text-[11px] text-[#00614F]">Requis</Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {TYPES.map((t) => {
              const selected = type === t.key;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setType(t.key)}
                  style={{ width: '48%' }}
                  className={`p-3.5 rounded-2xl h-28 justify-between active:scale-[0.98] ${
                    selected ? 'bg-[#E6F7F2]' : 'bg-white'
                  }`}>
                  <View className="flex-row items-start justify-between w-full">
                    <View
                      className={`w-9 h-9 rounded-xl items-center justify-center ${
                        selected ? 'bg-[#0E7C66]' : 'bg-[#E0F2EC]'
                      }`}>
                      <MaterialIcons
                        name={t.icon as any}
                        size={20}
                        color={selected ? '#FFFFFF' : '#3E4945'}
                      />
                    </View>
                    {selected ? (
                      <MaterialIcons name="check-circle" size={20} color="#00614F" />
                    ) : (
                      <View style={{ width: 20, height: 20 }} />
                    )}
                  </View>
                  <View>
                    <Text className="font-jeko-semibold text-sm text-[#0F1E1B]">{t.label}</Text>
                    <Text className="font-jeko text-xs text-[#3E4945]" numberOfLines={1}>
                      {t.sub}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section 2: Description */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-jeko-bold text-lg text-[#0F1E1B]">Description du besoin</Text>
            <Text className="font-jeko text-xs text-[#3E4945]">Précision utile</Text>
          </View>
          <View className="bg-white rounded-2xl p-3.5 shadow-sm">
            <TextInput
              className="w-full bg-transparent font-jeko text-sm text-[#0F1E1B]"
              placeholder="Décrivez ce que le coursier doit faire… (ex. récupérer un colis scellé chez Kodjo au Grand Marché)"
              placeholderTextColor="#6E7A75"
              multiline
              maxLength={300}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
              style={{ minHeight: 80 }}
            />
            <View className="flex-row justify-end pt-2">
              <Text className="font-jeko text-xs text-[#6E7A75]">{description.length}/300</Text>
            </View>
          </View>
        </View>

        {/* Section 3: Taille du colis */}
        <View className="mb-6">
          <Text className="font-jeko-bold text-lg text-[#0F1E1B] mb-3">Taille du colis</Text>
          <View className="gap-2">
            {SIZES.map((s) => {
              const selected = size === s.key;
              return (
                <Pressable
                  key={s.key}
                  onPress={() => setSize(s.key)}
                  className={`w-full flex-row items-center justify-between p-3.5 rounded-2xl active:scale-[0.99] ${
                    selected ? 'bg-[#E6F7F2]' : 'bg-white'
                  }`}>
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`w-8 h-8 rounded-xl items-center justify-center ${
                        selected ? 'bg-[#0E7C66]' : 'bg-[#E0F2EC]'
                      }`}>
                      <MaterialIcons name={s.icon as any} size={18} color={selected ? '#FFFFFF' : '#3E4945'} />
                    </View>
                    <View>
                      <Text className="font-jeko-semibold text-sm text-[#0F1E1B]">{s.label}</Text>
                      <Text className="font-jeko text-xs text-[#3E4945]">{s.sub}</Text>
                    </View>
                  </View>
                  {selected ? (
                    <MaterialIcons name="check" size={20} color="#00614F" />
                  ) : (
                    <View style={{ width: 20, height: 20 }} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section 4: Tarif proposé */}
        <View className="mb-6">
          <View className="mb-3">
            <Text className="font-jeko-bold text-lg text-[#0F1E1B]">Votre tarif proposé</Text>
            <Text className="font-jeko text-xs text-[#3E4945] mt-0.5">
              Montant recommandé selon les distances moyennes à Lomé
            </Text>
          </View>

          {/* Price stepper */}
          <View
            className={`bg-white rounded-2xl p-4 shadow-sm flex-row items-center justify-between mb-3 ${
              quote ? 'opacity-40' : ''
            }`}
            pointerEvents={quote ? 'none' : 'auto'}>
            <Pressable
              onPress={() => price > 500 && setPrice((p) => p - 100)}
              className="w-12 h-12 rounded-full bg-[#E6F7F2] items-center justify-center active:scale-90">
              <MaterialIcons name="remove" size={24} color="#00614F" />
            </Pressable>
            <View className="flex-col items-center">
              <View className="flex-row items-baseline gap-1">
                <Text className="font-jeko-bold text-2xl text-[#00614F] tracking-tight">{fmt(price)}</Text>
                <Text className="font-jeko-semibold text-sm text-[#3E4945]">FCFA</Text>
              </View>
              <Text className="font-jeko text-[11px] text-[#305D55]">Paiement à la livraison</Text>
            </View>
            <Pressable
              onPress={() => price < 50000 && setPrice((p) => p + 100)}
              className="w-12 h-12 rounded-full bg-[#0E7C66] items-center justify-center active:scale-90 shadow-sm">
              <MaterialIcons name="add" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Quote toggle */}
          <View className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center justify-between gap-3">
            <View className="flex-col gap-0.5 pr-2 flex-1">
              <Text className="font-jeko-semibold text-sm text-[#0F1E1B]">Je souhaite un devis du coursier</Text>
              <Text className="font-jeko text-xs text-[#3E4945]">
                Laissez les livreurs proposer leur propre tarif en fonction du trajet
              </Text>
            </View>
            <Pressable
              onPress={() => setQuote((q) => !q)}
              className={`relative inline-flex h-7 w-12 shrink-0 rounded-full ${
                quote ? 'bg-[#0E7C66]' : 'bg-[#D5E6E1]'
              }`}>
              <View
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm ${
                  quote ? 'right-1' : 'left-1'
                }`}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom button */}
      <View className="absolute bottom-0 inset-x-0 bg-[#ECFDF8]/90 px-5 pb-6 pt-3">
        <Pressable
          onPress={() => router.push('/(client)/new-request-step-2' as any)}
          className="w-full h-[52px] bg-[#0E7C66] rounded-2xl flex-row items-center justify-center gap-2 shadow-md active:scale-[0.98]">
          <Text className="font-jeko-semibold text-base text-white">Suivant</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
