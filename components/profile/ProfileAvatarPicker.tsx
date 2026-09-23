import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { getProfileInitials, persistProfilePhoto } from '@/lib/profile-api';

type ProfileAvatarPickerProps = {
  fullName: string;
  photoUri?: string | null;
  onChange: (uri: string | null) => void;
  size?: number;
};

export function ProfileAvatarPicker({
  fullName,
  photoUri,
  onChange,
  size = 96,
}: ProfileAvatarPickerProps) {
  const applyPickedUri = async (uri: string) => {
    try {
      const stored = await persistProfilePhoto(uri);
      onChange(stored);
    } catch {
      Alert.alert('Could not save photo', 'Please try another image.');
    }
  };

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Photo access needed',
        'Allow photo library access to upload your profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;
    await applyPickedUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera access needed', 'Allow camera access to take a profile picture.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;
    await applyPickedUri(result.assets[0].uri);
  };

  const openPicker = () => {
    const buttons: {
      text: string;
      style?: 'cancel' | 'destructive' | 'default';
      onPress?: () => void;
    }[] = [
      { text: 'Take photo', onPress: () => void takePhoto() },
      { text: 'Choose from library', onPress: () => void pickFromLibrary() },
    ];
    if (photoUri) {
      buttons.push({
        text: 'Remove photo',
        style: 'destructive',
        onPress: () => onChange(null),
      });
    }
    buttons.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert('Profile photo', 'Add a picture so attendees recognise you.', buttons);
  };

  const initials = getProfileInitials(fullName || 'ME');

  return (
    <Pressable
      onPress={openPicker}
      style={styles.wrap}
      accessibilityRole="button"
      accessibilityLabel="Upload profile photo"
    >
      <View
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      >
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        ) : (
          <Text style={[styles.initials, { fontSize: size * 0.32 }]}>{initials}</Text>
        )}
      </View>
      <View style={styles.badge}>
        <Ionicons name="camera" size={14} color={colors.white} />
      </View>
      <Text style={styles.hint}>{photoUri ? 'Change photo' : 'Add photo'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  avatar: {
    backgroundColor: `${colors.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: `${colors.primary}33`,
  },
  initials: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  badge: {
    position: 'absolute',
    right: 4,
    bottom: 22,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
