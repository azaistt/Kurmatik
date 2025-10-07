import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchFx, fetchGoldToday, fetchGoldXau } from '@/src/lib/api';

const FEATURE_LIST = [
  {
    title: 'Anlık Kur Takibi',
    description: 'Kurmatik, majör para birimlerini saniyeler içinde yenileyerek doğru dönüşüm sonuçları sunar.'
  },
  {
    title: 'Altın Uzmanlığı',
    description: 'Gramdan Cumhuriyet altınına kadar tüm altın tiplerini tek ekrandan izleyin, çevirin, karşılaştırın.'
  },
  {
    title: 'Akıllı Uyarılar',
    description: 'Kur veya altın hedefinizi belirleyin, Kurmatik hareket başladığında size bildirsin.'
  },
];

const STEPS = [
  {
    step: '1',
    title: 'Kurmatik’i aç',
    description: 'Web veya mobil uygulamada aynı hesap ile giriş yap.'
  },
  {
    step: '2',
    title: 'Hedeflerini belirle',
    description: 'Döviz, altın veya özel pariteler için izleme ve alarm kur.'
  },
  {
    step: '3',
    title: 'Harekete geç',
    description: 'Anlık bildirimler ve temiz grafiklerle fırsatı kaçırma.'
  }
];

type HighlightState = {
  title: string;
  value: string;
  badge?: string;
};

type RealtimeSnapshot = {
  usdTry: string;
  eurTry: string;
  gramAltin: string;
  onsAltin: string;
  updatedAt?: string;
};

const INITIAL_SNAPSHOT: RealtimeSnapshot = {
  usdTry: '—',
  eurTry: '—',
  gramAltin: '—',
  onsAltin: '—',
};

export default function LandingPage() {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => createPalette(colorScheme === 'dark'), [colorScheme]);

  const [snapshot, setSnapshot] = useState<RealtimeSnapshot>(INITIAL_SNAPSHOT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrateRealtime() {
      try {
        setLoading(true);
        const [usd, eur, gold, xau] = await Promise.all([
          fetchFx('USD', 'TRY', 1),
          fetchFx('EUR', 'TRY', 1),
          fetchGoldToday(),
          fetchGoldXau('TRY'),
        ]);

        if (cancelled) return;

        const format = (input: number | string | null | undefined, fraction = 2) => {
          if (input == null) return '—';
          const value = typeof input === 'number' ? input : Number(String(input).replace(',', '.'));
          if (!Number.isFinite(value)) return '—';
          return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: fraction,
          }).format(value);
        };

        const gramSale = gold?.gram?.Satış;
        const onsSale = gold?.ons?.Satış;

        setSnapshot({
          usdTry: format(usd?.result ?? usd?.rate),
          eurTry: format(eur?.result ?? eur?.rate),
          gramAltin: gramSale ?? format(xau?.gram, 2),
          onsAltin: onsSale ?? format(xau?.ounce, 0),
          updatedAt: gold?.updated || xau?.date,
        });
      } catch (error) {
        console.warn('Realtime snapshot fetch failed', error);
        if (cancelled) return;
        setSnapshot(INITIAL_SNAPSHOT);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    hydrateRealtime();

    const interval = setInterval(() => {
      hydrateRealtime();
    }, 1000 * 60 * 3); // refresh every 3 minutes

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const highlights: HighlightState[] = [
    {
      title: 'USD / TRY',
      value: snapshot.usdTry,
      badge: loading ? 'Canlı' : undefined,
    },
    {
      title: 'EUR / TRY',
      value: snapshot.eurTry,
      badge: loading ? 'Canlı' : undefined,
    },
    {
      title: 'Gram Altın',
      value: snapshot.gramAltin,
    },
    {
      title: 'Ons Altın',
      value: snapshot.onsAltin,
    },
  ];

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.page }]} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.hero, { backgroundColor: theme.heroBackground, borderColor: theme.heroBorder }]}>        <View style={styles.heroTextBlock}>
          <View style={styles.heroBadgeRow}>
            <Text style={[styles.heroBadge, { backgroundColor: theme.badgeBackground, color: theme.badgeText }]}>Finansınızı hızlandırın</Text>
            {!!snapshot.updatedAt && (
              <Text style={[styles.heroBadgeSecondary, { color: theme.mutedText }]}>Güncelleme: {snapshot.updatedAt}</Text>
            )}
          </View>
          <Text style={[styles.heroTitle, { color: theme.primaryText }]}>Kurmatik ile döviz ve altını tek ekrandan yönetin</Text>
          <Text style={[styles.heroSubtitle, { color: theme.secondaryText }]}>Anlık kurlar, altın fiyatları ve hedef uyarıları ile finansal kararlarınızı saniyeler içinde verin. Kurmatik yatırımcının karar merkezidir.</Text>
          <View style={styles.ctaRow}>
            <Link href="/(tabs)" asChild>
              <Pressable style={[styles.primaryButton, { backgroundColor: theme.accent, shadowColor: theme.accentShadow }]}>
                <Text style={[styles.primaryButtonText, { color: theme.buttonText }]}>Uygulamayı Aç</Text>
              </Pressable>
            </Link>
            <Link href="mailto:info@kurmatik.app" asChild>
              <Pressable style={[styles.secondaryButton, { borderColor: theme.accent, backgroundColor: theme.secondaryButton }]}>
                <Text style={[styles.secondaryButtonText, { color: theme.accent }]}>İş ortaklığı için yaz</Text>
              </Pressable>
            </Link>
          </View>
        </View>
        <View style={[styles.heroPanel, { backgroundColor: theme.panelBackground, borderColor: theme.panelBorder }]}>          <View style={styles.panelHeader}>
            <Text style={[styles.panelTitle, { color: theme.primaryText }]}>Anlık Görünüm</Text>
            <Text style={[styles.panelSubtitle, { color: theme.mutedText }]}>{loading ? 'Veriler yenileniyor…' : 'Son kurlar'}</Text>
          </View>
          <View style={styles.panelGrid}>
            {highlights.map((item) => (
              <View key={item.title} style={[styles.panelCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>                <Text style={[styles.panelCardTitle, { color: theme.secondaryText }]}>{item.title}</Text>
                <Text style={[styles.panelCardValue, { color: theme.primaryText }]}>{item.value}</Text>
                {!!item.badge && (
                  <Text style={[styles.cardBadge, { color: theme.accent }]}>{item.badge}</Text>
                )}
              </View>
            ))}
          </View>
          <View style={styles.panelFooter}>
            <Text style={[styles.panelFootnote, { color: theme.mutedText }]}>Veriler Yahoo Finance, TradingView ve Kurmatik altyapısından anlık olarak toplanır.</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionEyebrow, { color: theme.mutedText }]}>Neden Kurmatik?</Text>
        <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Finans sürecinizi hızlandıracak çözümler</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.secondaryText }]}>Kurmatik yatırımcıların her gün kullandığı kur takibi, altın analizi ve kişiselleştirilmiş uyarıları tek ekranda toplar.</Text>
        <View style={styles.featureGrid}>
          {FEATURE_LIST.map((feature) => (
            <View key={feature.title} style={[styles.featureCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>              <Text style={[styles.featureTitle, { color: theme.primaryText }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: theme.secondaryText }]}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, styles.sectionAlt, { backgroundColor: theme.sectionAltBackground, borderColor: theme.sectionAltBorder }]}>        <Text style={[styles.sectionEyebrow, { color: theme.mutedText }]}>Nasıl çalışır?</Text>
        <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Üç adımda finansal radarını kur</Text>
        <View style={styles.stepsRow}>
          {STEPS.map((item) => (
            <View key={item.step} style={[styles.stepCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>              <Text style={[styles.stepNumber, { color: theme.accent }]}>{item.step}</Text>
              <Text style={[styles.stepTitle, { color: theme.primaryText }]}>{item.title}</Text>
              <Text style={[styles.stepDescription, { color: theme.secondaryText }]}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, styles.ctaSection, { backgroundColor: theme.ctaBackground, borderColor: theme.ctaBorder }]}>        <Text style={[styles.ctaTitle, { color: theme.primaryText }]}>Kurmatik ile finansal gündemi kaçırma</Text>
        <Text style={[styles.ctaSubtitle, { color: theme.secondaryText }]}>API altyapımız, mobil uygulamalarımız ve web konsolumuz tek çatı altında. Risklerini kontrol etmek için bugün Kurmatik’i kullanmaya başla.</Text>
        <View style={styles.ctaRow}>          <Link href="/(tabs)" asChild>
            <Pressable style={[styles.primaryButton, styles.ctaButton, { backgroundColor: theme.accent }]}>              <Text style={[styles.primaryButtonText, { color: theme.buttonText }]}>Kurmatik Web'i Aç</Text>
            </Pressable>
          </Link>
          <Link href="https://kurmatik.app" asChild>
            <Pressable style={[styles.secondaryButton, styles.ctaButtonOutline, { borderColor: theme.buttonOutline, backgroundColor: theme.secondaryButton }]}>              <Text style={[styles.secondaryButtonText, { color: theme.buttonOutline }]}>Mobil uygulama için bekleme listesi</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.footer}>        <Text style={[styles.footerTitle, { color: theme.secondaryText }]}>Kurmatik • Finansal karar merkezi</Text>
        <Text style={[styles.footerText, { color: theme.mutedText }]}>© {new Date().getFullYear()} Kurmatik Teknoloji. Tüm hakları saklıdır.</Text>
      </View>
    </ScrollView>
  );
}

function createPalette(isDark: boolean) {
  const base = isDark ? Colors.dark : Colors.light;
  const heroAccent = isDark ? '#4ade80' : '#2563eb';
  return {
    page: isDark ? '#05060a' : '#f5f7fb',
    primaryText: base.text,
    secondaryText: isDark ? '#cbd5f5' : '#475569',
    mutedText: isDark ? '#94a3b8' : '#6b7280',
    heroBackground: isDark ? 'rgba(37, 99, 235, 0.08)' : '#eef3ff',
    heroBorder: isDark ? 'rgba(148, 163, 184, 0.15)' : '#cbd5f5',
    badgeBackground: isDark ? 'rgba(148, 163, 184, 0.12)' : '#dbeafe',
    badgeText: isDark ? '#e2e8f0' : '#1e3a8a',
    accent: heroAccent,
    accentShadow: heroAccent,
    buttonText: '#ffffff',
    buttonOutline: isDark ? '#a5b4fc' : '#2563eb',
    secondaryButton: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
    panelBackground: isDark ? 'rgba(15, 23, 42, 0.9)' : '#ffffff',
    panelBorder: isDark ? 'rgba(148, 163, 184, 0.12)' : '#e2e8f0',
    cardBackground: isDark ? 'rgba(15, 23, 42, 0.75)' : '#ffffff',
    cardBorder: isDark ? 'rgba(148, 163, 184, 0.18)' : '#e2e8f0',
    panelHeader: base.tint,
    heroAccent,
    sectionAltBackground: isDark ? 'rgba(15, 23, 42, 0.85)' : '#ffffff',
    sectionAltBorder: isDark ? 'rgba(37, 99, 235, 0.2)' : '#e0e7ff',
    ctaBackground: isDark ? 'rgba(24, 24, 27, 0.9)' : '#1f2937',
    ctaBorder: isDark ? 'rgba(59, 130, 246, 0.4)' : '#111827',
    heroPanelShadow: isDark ? 'rgba(37, 99, 235, 0.25)' : 'rgba(37, 99, 235, 0.18)',
    panelFooter: isDark ? '#0f172a' : '#f8fafc',
  };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 32,
    paddingVertical: 48,
    paddingHorizontal: 24,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: 1200,
    marginTop: Platform.select({ web: 48, default: 24 }),
    flexDirection: Platform.select({ web: 'row', default: 'column' }),
    justifyContent: 'space-between',
    rowGap: 32,
    columnGap: 32,
  },
  heroTextBlock: {
    flex: 1,
    maxWidth: 560,
    rowGap: 16,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 12,
  },
  heroBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: '600',
  },
  heroBadgeSecondary: {
    fontSize: 13,
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 18,
    lineHeight: 26,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  heroPanel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    rowGap: 18,
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
  },
  panelHeader: {
    rowGap: 4,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  panelSubtitle: {
    fontSize: 14,
  },
  panelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: 12,
    rowGap: 12,
  },
  panelCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    minWidth: 150,
    flex: Platform.select({ web: 1, default: 1 }),
  },
  panelCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  panelCardValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  cardBadge: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  panelFooter: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    paddingTop: 12,
  },
  panelFootnote: {
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    marginTop: 64,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: 1050,
    paddingHorizontal: 12,
  },
  sectionEyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  featureGrid: {
    flexDirection: Platform.select({ web: 'row', default: 'column' }),
    flexWrap: 'wrap',
    columnGap: 20,
    rowGap: 20,
  },
  featureCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    flex: Platform.select({ web: 1, default: undefined }),
    minWidth: 280,
    maxWidth: 320,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionAlt: {
    borderWidth: 1,
    borderRadius: 28,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  stepsRow: {
    flexDirection: Platform.select({ web: 'row', default: 'column' }),
    marginTop: 24,
    columnGap: 20,
    rowGap: 20,
  },
  stepCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    rowGap: 12,
  },
  stepNumber: {
    fontSize: 32,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  stepDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  ctaSection: {
    borderWidth: 1,
    borderRadius: 28,
    paddingVertical: 48,
    paddingHorizontal: 24,
    marginTop: 72,
    alignItems: 'center',
    rowGap: 20,
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 640,
  },
  ctaButton: {
    minWidth: 180,
  },
  ctaButtonOutline: {
    borderWidth: 1,
  },
  footer: {
    marginTop: 80,
    alignItems: 'center',
    rowGap: 6,
  },
  footerTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 13,
  },
});
