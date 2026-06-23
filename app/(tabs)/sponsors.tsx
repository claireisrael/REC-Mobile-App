import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { colors } from '@/constants/theme';
import { REC_GALLERY } from '@/lib/gallery-data';

export default function GalleryScreen() {
  return (
    <ScreenContainer>
      <ScrollView style={styles.screen}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Ionicons name="images-outline" size={14} color={colors.primary} />
            <Text style={styles.badgeText}>REC Media</Text>
          </View>
          <Text style={styles.title}>Gallery</Text>
          <Text style={styles.subtitle}>
            Explore selected REC moments by year, day, and session. Each session shows 5 preview
            photos, then you can open the full album.
          </Text>
        </View>

        <View style={styles.content}>
          {REC_GALLERY.map((yearGroup) => (
            <View key={yearGroup.id} style={styles.yearSection}>
              <Text style={styles.yearTitle}>{yearGroup.year}</Text>

              {yearGroup.days.map((day) => (
                <View key={day.id} style={styles.dayCard}>
                  <Text style={styles.dayTitle}>{day.label}</Text>

                  {day.sessions.map((session) => (
                    <View key={session.id} style={styles.sessionSection}>
                      <Text style={styles.sessionTitle}>{session.sessionTitle}</Text>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.photoRow}
                      >
                        {session.previewPhotos.map((photoUrl, index) => (
                          <Image
                            key={`${session.id}-${index + 1}`}
                            source={{ uri: photoUrl }}
                            style={styles.photo}
                            resizeMode="cover"
                          />
                        ))}
                      </ScrollView>

                      <Pressable
                        style={({ pressed }) => [styles.moreBtn, pressed && styles.moreBtnPressed]}
                        onPress={() => Linking.openURL(session.morePhotosUrl)}
                      >
                        <Text style={styles.moreBtnText}>View more photos</Text>
                        <Ionicons name="open-outline" size={14} color={colors.primary} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}14`,
    borderWidth: 1,
    borderColor: `${colors.primary}26`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  yearSection: {
    gap: 10,
  },
  yearTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  dayCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 14,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  sessionSection: {
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  photoRow: {
    gap: 10,
    paddingVertical: 2,
  },
  photo: {
    width: 200,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  moreBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: `${colors.primary}55`,
    borderRadius: 8,
    backgroundColor: `${colors.primary}10`,
  },
  moreBtnPressed: {
    backgroundColor: `${colors.primary}1F`,
  },
  moreBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
