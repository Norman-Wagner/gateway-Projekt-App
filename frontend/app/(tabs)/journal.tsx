import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/appStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

const moods = [
  { id: 'peaceful', icon: 'leaf-outline', color: '#4CAF50' },
  { id: 'energized', icon: 'flash-outline', color: '#FF9800' },
  { id: 'confused', icon: 'help-circle-outline', color: '#9E9E9E' },
  { id: 'enlightened', icon: 'sunny-outline', color: '#FFD700' },
  { id: 'tired', icon: 'moon-outline', color: '#607D8B' },
];

export default function JournalScreen() {
  const { t, language } = useTranslation();
  const {
    journalEntries,
    isLoading,
    fetchJournalEntries,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
  } = useAppStore();

  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const handleRefresh = () => {
    fetchJournalEntries();
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setSelectedMood(null);
    setShowModal(true);
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setSelectedMood(entry.mood);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (editingEntry) {
      await updateJournalEntry(editingEntry.id, {
        title,
        content,
        mood: selectedMood || undefined,
      });
    } else {
      await createJournalEntry({
        title,
        content,
        mood: selectedMood || undefined,
        tags: [],
      });
    }

    setShowModal(false);
    setTitle('');
    setContent('');
    setSelectedMood(null);
    setEditingEntry(null);
  };

  const handleDelete = (entry: any) => {
    Alert.alert(
      t.journal.delete,
      '',
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.confirm,
          style: 'destructive',
          onPress: () => deleteJournalEntry(entry.id),
        },
      ]
    );
  };

  const getMoodInfo = (moodId: string | undefined) => {
    if (!moodId) return null;
    return moods.find((m) => m.id === moodId);
  };

  const getMoodLabel = (moodId: string) => {
    const moodLabels: Record<string, string> = {
      peaceful: t.journal.moods.peaceful,
      energized: t.journal.moods.energized,
      confused: t.journal.moods.confused,
      enlightened: t.journal.moods.enlightened,
      tired: t.journal.moods.tired,
    };
    return moodLabels[moodId] || moodId;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.journal.title}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleNewEntry}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#7B68EE"
          />
        }
      >
        {journalEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#3a3a5a" />
            <Text style={styles.emptyTitle}>{t.journal.noEntries}</Text>
            <Text style={styles.emptyText}>{t.journal.startWriting}</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleNewEntry}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.emptyButtonText}>{t.journal.newEntry}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          journalEntries.map((entry) => {
            const moodInfo = getMoodInfo(entry.mood);
            return (
              <TouchableOpacity
                key={entry.id}
                style={styles.entryCard}
                onPress={() => handleEditEntry(entry)}
                activeOpacity={0.8}
              >
                <View style={styles.entryHeader}>
                  <View style={styles.entryTitleRow}>
                    {moodInfo && (
                      <View
                        style={[
                          styles.moodBadge,
                          { backgroundColor: moodInfo.color + '20' },
                        ]}
                      >
                        <Ionicons
                          name={moodInfo.icon as any}
                          size={16}
                          color={moodInfo.color}
                        />
                      </View>
                    )}
                    <Text style={styles.entryTitle} numberOfLines={1}>
                      {entry.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(entry)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.entryContent} numberOfLines={3}>
                  {entry.content}
                </Text>
                <Text style={styles.entryDate}>
                  {format(
                    new Date(entry.created_at),
                    'PPp',
                    { locale: language === 'de' ? de : enUS }
                  )}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* New/Edit Entry Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEntry ? t.journal.edit : t.journal.newEntry}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.titleInput}
              placeholder={t.journal.titlePlaceholder}
              placeholderTextColor="#6a6a8a"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={styles.contentInput}
              placeholder={t.journal.contentPlaceholder}
              placeholderTextColor="#6a6a8a"
              multiline
              value={content}
              onChangeText={setContent}
            />

            <Text style={styles.moodLabel}>{t.journal.mood}</Text>
            <View style={styles.moodSelector}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodOption,
                    selectedMood === mood.id && {
                      backgroundColor: mood.color + '30',
                      borderColor: mood.color,
                    },
                  ]}
                  onPress={() =>
                    setSelectedMood(selectedMood === mood.id ? null : mood.id)
                  }
                >
                  <Ionicons
                    name={mood.icon as any}
                    size={24}
                    color={selectedMood === mood.id ? mood.color : '#6a6a8a'}
                  />
                  <Text
                    style={[
                      styles.moodText,
                      selectedMood === mood.id && { color: mood.color },
                    ]}
                  >
                    {getMoodLabel(mood.id)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t.journal.save}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7B68EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6a6a8a',
    marginTop: 8,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B68EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 24,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  entryCard: {
    backgroundColor: '#12122a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  moodBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  entryContent: {
    fontSize: 14,
    color: '#a0a0b0',
    lineHeight: 20,
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 12,
    color: '#6a6a8a',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#12122a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  titleInput: {
    backgroundColor: '#1a1a3a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  contentInput: {
    backgroundColor: '#1a1a3a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  moodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    gap: 6,
  },
  moodText: {
    fontSize: 12,
    color: '#6a6a8a',
  },
  saveButton: {
    backgroundColor: '#7B68EE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
