/**
 * In-app Privacy Policy screen.
 * Play Store safe: mentions AdMob, storage, internet, no personal data.
 * Language from device (English / Bengali) via i18n.
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppUi } from '../contexts/AppUiContext';
import { setI18nLocaleFromDevice, t } from '../i18n';

export function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const { closePrivacyPolicy } = useAppUi();

  useEffect(() => {
    setI18nLocaleFromDevice();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={closePrivacyPolicy} style={styles.backButton}>
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('privacy.title')}</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updated}>{t('privacy.lastUpdated')}</Text>
        <Text style={styles.paragraph}>{t('privacy.intro')}</Text>
        <Text style={styles.sectionTitle}>{t('privacy.sectionAdMob')}</Text>
        <Text style={styles.paragraph}>{t('privacy.admob')}</Text>
        <Text style={styles.sectionTitle}>{t('privacy.sectionStorage')}</Text>
        <Text style={styles.paragraph}>{t('privacy.storage')}</Text>
        <Text style={styles.sectionTitle}>{t('privacy.sectionInternet')}</Text>
        <Text style={styles.paragraph}>{t('privacy.internet')}</Text>
        <Text style={styles.sectionTitle}>{t('privacy.sectionNoPersonalData')}</Text>
        <Text style={styles.paragraph}>{t('privacy.noPersonalData')}</Text>
        <Text style={styles.paragraph}>{t('privacy.contact')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backText: {
    color: '#4a9eff',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  updated: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e0e0e0',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#b0b0b0',
    lineHeight: 24,
    marginBottom: 12,
  },
});
