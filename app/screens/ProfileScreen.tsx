import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { Colors } from '../constants/colors';

type ProfileStackParamList = {
  Profile: undefined;
  Edit: undefined;
};

type Props = {
  navigation: StackNavigationProp<ProfileStackParamList, 'Profile'>;
};

const placeholderImage = require('../../assets/images/adaptive-icon.png');

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { darkModeEnabled } = useTheme();
  const themeColors = darkModeEnabled ? Colors.dark : Colors.light;

  // Dummy user profile data
  const user = {
    name: 'John Doe',
    age: 23,
    bio: 'Adventure seeker and coffee lover. Always up for a good conversation!',
    // photos aren’t needed any more since we always show the placeholder
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Profile Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        <Image
          source={placeholderImage}
          style={styles.profileImage}
        />
        <Text style={[styles.name, darkModeEnabled && styles.darkName]}>
          {user.name}, {user.age}
        </Text>
        <Text style={[styles.bio, darkModeEnabled && styles.darkBio]}>
          {user.bio}
        </Text>
      </View>

      {/* Photos Section */}
      <View
        style={[
          styles.photosSection,
          {
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            darkModeEnabled && styles.darkSectionTitle,
          ]}
        >
          Photos
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Image
              key={index}
              source={placeholderImage}
              style={styles.photo}
            />
          ))}
        </ScrollView>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('Edit')}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  darkName: {
    color: '#fff',
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  darkBio: {
    color: '#eee',
  },
  photosSection: {
    paddingVertical: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
    marginBottom: 12,
  },
  darkSectionTitle: {
    color: '#fff',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#ff6b6b',
    padding: 16,
    borderRadius: 10,
    margin: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
