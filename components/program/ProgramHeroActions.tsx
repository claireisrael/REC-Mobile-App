import { useState } from 'react';
import { ActivityIndicator, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { colors } from '@/constants/theme';
import { config } from '@/lib/config';
import type { Conference } from '@/lib/types';

type ProgramHeroActionsProps = {
  conference: Conference;
  variant?: 'default' | 'hero';
};

export function ProgramHeroActions({ conference, variant = 'default' }: ProgramHeroActionsProps) {
  const [downloading, setDownloading] = useState(false);
  const isHero = variant === 'hero';

  const downloadUrl = `${config.apiBaseUrl}/program/download`;
  const conferenceTitle = conference?.title || 'Conference';

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await WebBrowser.openBrowserAsync(downloadUrl);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareMessage = `${conferenceTitle} Program\n\nDownload the full conference program PDF:\n${downloadUrl}\n\nGet all sessions, speakers, and schedule details in one PDF.`;

    try {
      await Share.share({
        title: `${conferenceTitle} Program`,
        message: shareMessage,
      });
    } catch {
      // User cancelled or share failed silently
    }
  };

  return (
    <View style={[styles.row, isHero && styles.rowHero]}>
      <Pressable
        style={({ pressed }) => [
          styles.downloadBtn,
          isHero && styles.downloadBtnHero,
          pressed && (isHero ? styles.downloadBtnHeroPressed : styles.downloadBtnPressed),
        ]}
        onPress={handleDownload}
        disabled={downloading}
      >
        {downloading ? (
          <ActivityIndicator size="small" color={isHero ? colors.primary : colors.white} />
        ) : (
          <Ionicons
            name="download-outline"
            size={16}
            color={isHero ? colors.primary : colors.white}
          />
        )}
        <Text style={[styles.downloadText, isHero && styles.downloadTextHero]}>
          {downloading ? 'Opening...' : 'Download'}
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.shareBtn,
          isHero && styles.shareBtnHero,
          pressed && (isHero ? styles.shareBtnHeroPressed : styles.shareBtnPressed),
        ]}
        onPress={handleShare}
      >
        <Ionicons
          name="share-social-outline"
          size={16}
          color={isHero ? colors.white : colors.primary}
        />
        <Text style={[styles.shareText, isHero && styles.shareTextHero]}>Share</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 20,
  },
  rowHero: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  downloadBtnHero: {
    backgroundColor: colors.white,
  },
  downloadBtnPressed: {
    backgroundColor: colors.primaryDark,
  },
  downloadBtnHeroPressed: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  downloadTextHero: {
    color: colors.primary,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    backgroundColor: colors.white,
  },
  shareBtnHero: {
    borderColor: 'rgba(255,255,255,0.38)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  shareBtnPressed: {
    backgroundColor: `${colors.primary}0D`,
  },
  shareBtnHeroPressed: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  shareText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  shareTextHero: {
    color: colors.white,
  },
});
