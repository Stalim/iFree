import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updatePlayerWithImages } from '@/services/playerService';
import { PlayerInfo } from './PlayerProfile';
import { SERVER_BASE_URL } from '@/config';

interface PlayerImageUploaderProps {
  player: PlayerInfo;
  isDarkMode: boolean;
  onUpdateSuccess: (updatedPlayer: PlayerInfo) => void;
}

export default function PlayerImageUploader({ player, isDarkMode, onUpdateSuccess }: PlayerImageUploaderProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Helper function to get full image URL
  const getFullImageUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `${SERVER_BASE_URL}${url}`;
    return url;
  };

  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking profile image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const pickBannerImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setBannerImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking banner image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadImages = async () => {
    if (!profileImage && !bannerImage) {
      Alert.alert('No Changes', 'Please select at least one image to update.');
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData objects for the images
      let profileImageFile: Blob | undefined;
      let bannerImageFile: Blob | undefined;

      if (profileImage) {
        const response = await fetch(profileImage);
        profileImageFile = await response.blob();
      }

      if (bannerImage) {
        const response = await fetch(bannerImage);
        bannerImageFile = await response.blob();
      }

      // Update player with new images
      const updatedPlayer = await updatePlayerWithImages(
        player.id,
        {}, // No other data changes
        profileImageFile,
        bannerImageFile
      );

      Alert.alert('Success', 'Player images updated successfully!');
      onUpdateSuccess(updatedPlayer);
    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Error', 'Failed to update player images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>Update Player Images</Text>
      
      <View style={styles.imageSection}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Profile Picture</Text>
        <View style={styles.imagePreviewContainer}>
          <Image 
            source={{ uri: profileImage || getFullImageUrl(player.imageUrl) }} 
            style={styles.profilePreview} 
          />
          <TouchableOpacity 
            style={[styles.selectButton, isDarkMode && styles.selectButtonDark]} 
            onPress={pickProfileImage}
          >
            <Text style={[styles.buttonText, isDarkMode && styles.buttonTextDark]}>
              Select New Profile Picture
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageSection}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Banner Image</Text>
        <View style={styles.imagePreviewContainer}>
          <Image 
            source={{ uri: bannerImage || getFullImageUrl(player.bannerUrl) }} 
            style={styles.bannerPreview} 
          />
          <TouchableOpacity 
            style={[styles.selectButton, isDarkMode && styles.selectButtonDark]} 
            onPress={pickBannerImage}
          >
            <Text style={[styles.buttonText, isDarkMode && styles.buttonTextDark]}>
              Select New Banner Image
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.uploadButton, 
          isDarkMode && styles.uploadButtonDark,
          (!profileImage && !bannerImage) && styles.disabledButton,
          isUploading && styles.disabledButton
        ]} 
        onPress={uploadImages}
        disabled={(!profileImage && !bannerImage) || isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.uploadButtonText}>
            Upload Images
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  titleDark: {
    color: '#ffffff',
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
  },
  textDark: {
    color: '#ffffff',
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  profilePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
  },
  bannerPreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
  },
  selectButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectButtonDark: {
    backgroundColor: '#2d2d2d',
  },
  buttonText: {
    color: '#4b5563',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonTextDark: {
    color: '#e5e7eb',
  },
  uploadButton: {
    backgroundColor: '#0f2167',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  uploadButtonDark: {
    backgroundColor: '#3b82f6',
  },
  disabledButton: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
}); 