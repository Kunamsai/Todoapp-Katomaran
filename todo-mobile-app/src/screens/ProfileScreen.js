import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Load profile from localStorage
  useEffect(() => {
    const profile = localStorage.getItem('profile');
    if (profile) {
      const data = JSON.parse(profile);
      setFullName(data.fullName || '');
      setAge(data.age || '');
      setGender(data.gender || '');
      setAvatarUrl(data.avatarUrl || null);
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    const profile = { fullName, age, gender, avatarUrl };
    localStorage.setItem('profile', JSON.stringify(profile));
    setSaved(true);
    alert('Profile saved!');
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission to access gallery is required!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : { uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fullName || 'User') }
            }
            style={styles.avatar}
          />
          <Text style={styles.choosePhotoText}>Choose Photo</Text>
        </TouchableOpacity>
        {!saved ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Gender (e.g. Male, Female, Other)"
              value={gender}
              onChangeText={setGender}
            />
            <Button title="Save" onPress={handleSave} />
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Full Name: <Text style={styles.value}>{fullName}</Text></Text>
            <Text style={styles.label}>Age: <Text style={styles.value}>{age}</Text></Text>
            <Text style={styles.label}>Gender: <Text style={styles.value}>{gender}</Text></Text>
            <Button title="Edit" onPress={() => setSaved(false)} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#f6f8fa' },
  title: { fontSize: 28, marginBottom: 24, fontWeight: 'bold', color: '#007bff' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: '100%', maxWidth: 400, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8, borderWidth: 2, borderColor: '#007bff' },
  choosePhotoText: { color: '#007bff', textAlign: 'center', marginBottom: 16, textDecorationLine: 'underline' },
  form: { width: '100%' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, width: '100%', backgroundColor: '#f9f9f9' },
  profileInfo: { alignItems: 'flex-start', width: '100%' },
  label: { fontSize: 18, marginBottom: 8, color: '#333' },
  value: { fontWeight: 'bold', color: '#007bff' },
});
