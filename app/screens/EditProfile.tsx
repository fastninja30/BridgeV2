import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert, Image, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';
import { Colors } from '../constants/colors';
import { useTheme } from '../ThemeContext';
import { useUser } from '../UserContext'; // <-- add

const placeholderImage = require('../../assets/images/adaptive-icon.png');

const EditProfile: React.FC = () => {
  const navigation = useNavigation();
  const { darkModeEnabled } = useTheme();
  const themeColors = darkModeEnabled ? Colors.dark : Colors.light;

  const { user, updateUser } = useUser(); // <-- get from context

  // Form state (initialize from context user)
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(String(user.age));
  const [bio, setBio] = useState(user.bio);
  const [photos, setPhotos] = useState<string[]>([...user.photos]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [erroredMap, setErroredMap] = useState<Record<string, boolean>>({});

  // If the context user changes while this screen is mounted, sync (optional)
  useEffect(() => {
    setName(user.name);
    setAge(String(user.age));
    setBio(user.bio);
    setPhotos(user.photos);
  }, [user]);

  const handleImageError = (key: string) => () => {
    setErroredMap(m => ({ ...m, [key]: true }));
  };

  const addPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotos(prev => [...prev, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const parsedAge = parseInt(age, 10);
    if (Number.isNaN(parsedAge) || parsedAge <= 0) {
      Alert.alert('Invalid age', 'Age must be a positive number.');
      return;
    }

    updateUser({
      name: name.trim(),
      age: parsedAge,
      bio: bio.trim(),
      photos,
    });

    Alert.alert('Profile Saved', 'Your changes have been saved.');
    // go back to Profile screen so user sees the updates immediately
    // @ts-ignore (if you don't have a typed nav here)
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Name */}
      <View style={styles.fieldContainer}>
        <Text style={[styles.label, darkModeEnabled && styles.darkLabel]}>Name</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: themeColors.cardBorder,
              backgroundColor: themeColors.cardBackground,
              color: themeColors.text,
            },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={darkModeEnabled ? '#aaa' : '#666'}
        />
      </View>

      {/* Age */}
      <View style={styles.fieldContainer}>
        <Text style={[styles.label, darkModeEnabled && styles.darkLabel]}>Age</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: themeColors.cardBorder,
              backgroundColor: themeColors.cardBackground,
              color: themeColors.text,
            },
          ]}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="Enter your age"
          placeholderTextColor={darkModeEnabled ? '#aaa' : '#666'}
        />
      </View>

      {/* Bio */}
      <View style={styles.fieldContainer}>
        <Text style={[styles.label, darkModeEnabled && styles.darkLabel]}>Bio</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: themeColors.cardBorder,
              backgroundColor: themeColors.cardBackground,
              color: themeColors.text,
            },
          ]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself"
          placeholderTextColor={darkModeEnabled ? '#aaa' : '#666'}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Photos */}
      <View style={[styles.photosSection, { borderColor: themeColors.cardBorder, backgroundColor: themeColors.cardBackground }]}>
        <Text style={[styles.sectionTitle, darkModeEnabled && styles.darkSectionTitle]}>Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {photos.map((uri, index) => {
            const key = `edit-photo-${index}`;
            const source = erroredMap[key] ? placeholderImage : { uri };
            return (
              <View key={key} style={styles.photoContainer}>
                <Image
                  source={source}
                  defaultSource={placeholderImage}
                  onError={handleImageError(key)}
                  style={styles.photo}
                />
                <TouchableOpacity style={styles.removeBtn} onPress={() => removePhoto(index)}>
                  <Text style={styles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.addPhotoContainer}>
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                borderColor: themeColors.cardBorder,
                backgroundColor: themeColors.cardBackground,
                color: themeColors.text,
              },
            ]}
            value={newPhotoUrl}
            onChangeText={setNewPhotoUrl}
            placeholder="Photo URL"
            placeholderTextColor={darkModeEnabled ? '#aaa' : '#666'}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addPhoto}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Save */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// (styles unchanged)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  darkLabel: { color: '#fff' },
  input: {
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8,
    padding: 12, fontSize: 16, backgroundColor: '#fff', color: '#333',
  },
  photosSection: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  darkSectionTitle: { color: '#fff' },
  photoContainer: { position: 'relative', marginRight: 12 },
  photo: { width: 100, height: 100, borderRadius: 8 },
  removeBtn: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, borderRadius: 4 },
  removeBtnText: { color: '#fff', fontSize: 12 },
  addPhotoContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  addBtn: { marginLeft: 8, backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  saveButton: { backgroundColor: '#ff6b6b', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 32 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default EditProfile;
