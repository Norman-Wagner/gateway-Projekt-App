import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../../src/hooks/useTranslation';
import { colors } from '../../src/theme/colors';
import { 
  practicalTools, 
  gatewayHistory, 
  gatewayAffirmation,
  ciaFacts 
} from '../../src/data/gatewayData';

export default function ToolsScreen() {
  const { language } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [dailyFact, setDailyFact] = useState('');

  const history = language === 'de' ? gatewayHistory.de : gatewayHistory.en;
  const affirmation = language === 'de' ? gatewayAffirmation.de : gatewayAffirmation.en;
  const facts = language === 'de' ? ciaFacts.de : ciaFacts.en;

  useEffect(() => {
    // Get a "daily" fact based on the date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const factIndex = dayOfYear % facts.length;
    setDailyFact(facts[factIndex]);
  }, [facts]);

  const openCIADocument = () => {
    Linking.openURL('https://www.cia.gov/readingroom/docs/CIA-RDP96-00788R001700210016-5.pdf');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {language === 'de' ? 'Gateway Werkzeuge' : 'Gateway Tools'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'de' 
            ? 'Praktische Techniken aus dem Gateway-Arbeitsheft' 
            : 'Practical techniques from the Gateway workbook'}
        </Text>

        {/* Daily CIA Fact */}
        <View style={styles.dailyFactCard}>
          <View style={styles.dailyFactHeader}>
            <Ionicons name="information-circle" size={20} color={colors.status.warning} />
            <Text style={styles.dailyFactTitle}>
              {language === 'de' ? 'CIA Fakt des Tages' : 'Daily CIA Fact'}
            </Text>
          </View>
          <Text style={styles.dailyFactText}>{dailyFact}</Text>
        </View>

        {/* Gateway Affirmation Card */}
        <TouchableOpacity
          style={styles.specialCard}
          onPress={() => setShowAffirmation(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.accent.secondary, colors.accent.primary]}
            style={styles.specialGradient}
          >
            <Ionicons name="sparkles-outline" size={32} color="#fff" />
            <View style={styles.specialContent}>
              <Text style={styles.specialTitle}>
                {language === 'de' ? 'Gateway Affirmation' : 'Gateway Affirmation'}
              </Text>
              <Text style={styles.specialDesc}>
                {language === 'de' 
                  ? 'Die grundlegende Absichtserklärung' 
                  : 'The foundational statement of intent'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* History Card */}
        <TouchableOpacity
          style={styles.specialCard}
          onPress={() => setShowHistory(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={colors.focus.level12.gradient}
            style={styles.specialGradient}
          >
            <Ionicons name="document-text-outline" size={32} color="#fff" />
            <View style={styles.specialContent}>
              <Text style={styles.specialTitle}>{history.title}</Text>
              <Text style={styles.specialDesc}>{history.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Original Document Link */}
        <TouchableOpacity
          style={styles.documentLink}
          onPress={openCIADocument}
          activeOpacity={0.8}
        >
          <Ionicons name="link-outline" size={20} color={colors.accent.glow} />
          <Text style={styles.documentLinkText}>
            {language === 'de' 
              ? 'Original CIA-Dokument (PDF)' 
              : 'Original CIA Document (PDF)'}
          </Text>
          <Ionicons name="open-outline" size={16} color={colors.text.muted} />
        </TouchableOpacity>

        {/* Practical Tools */}
        <Text style={styles.sectionTitle}>
          {language === 'de' ? 'Praktische Techniken' : 'Practical Techniques'}
        </Text>

        {practicalTools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolCard}
            onPress={() => setSelectedTool(tool)}
            activeOpacity={0.8}
          >
            <View style={styles.toolIcon}>
              <Ionicons 
                name={tool.icon as any} 
                size={28} 
                color={colors.accent.glow} 
              />
            </View>
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>
                {language === 'de' ? tool.title_de : tool.title}
              </Text>
              <Text style={styles.toolDesc} numberOfLines={2}>
                {language === 'de' ? tool.description_de : tool.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
          </TouchableOpacity>
        ))}

        {/* 55515 Special Highlight */}
        <View style={styles.highlightCard}>
          <Text style={styles.highlightNumber}>55515</Text>
          <Text style={styles.highlightText}>
            {language === 'de' 
              ? 'Die Schmerzlinderungs-Sequenz aus dem Gateway-Arbeitsheft'
              : 'The pain relief sequence from the Gateway workbook'}
          </Text>
        </View>
      </ScrollView>

      {/* Tool Detail Modal */}
      <Modal visible={!!selectedTool} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons 
                  name={selectedTool?.icon as any} 
                  size={40} 
                  color={colors.accent.glow} 
                />
              </View>
              <TouchableOpacity onPress={() => setSelectedTool(null)}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalTitle}>
              {language === 'de' ? selectedTool?.title_de : selectedTool?.title}
            </Text>
            
            <ScrollView style={styles.modalScroll}>
              {/* Disclaimer if exists */}
              {selectedTool?.disclaimer && (
                <View style={styles.disclaimerBox}>
                  <Text style={styles.disclaimerText}>
                    {language === 'de' ? selectedTool.disclaimer_de : selectedTool.disclaimer}
                  </Text>
                </View>
              )}

              <Text style={styles.modalDesc}>
                {language === 'de' ? selectedTool?.description_de : selectedTool?.description}
              </Text>
              
              <View style={styles.techniqueBox}>
                <Text style={styles.techniqueLabel}>
                  {language === 'de' ? 'Anleitung:' : 'Instructions:'}
                </Text>
                <Text style={styles.techniqueText}>
                  {language === 'de' ? selectedTool?.technique_de : selectedTool?.technique}
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setSelectedTool(null)}
            >
              <Text style={styles.closeButtonText}>
                {language === 'de' ? 'Schließen' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Affirmation Modal */}
      <Modal visible={showAffirmation} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Gateway Affirmation</Text>
              <TouchableOpacity onPress={() => setShowAffirmation(false)}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.affirmationScroll}>
              <Text style={styles.affirmationText}>{affirmation}</Text>
              <Text style={styles.affirmationNote}>
                {language === 'de'
                  ? 'Sprich diese Affirmation zu Beginn jeder Gateway-Sitzung innerlich oder laut.'
                  : 'Speak this affirmation at the beginning of each Gateway session, internally or aloud.'}
              </Text>
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowAffirmation(false)}
            >
              <Text style={styles.closeButtonText}>
                {language === 'de' ? 'Schließen' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* History Modal */}
      <Modal visible={showHistory} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.historyModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{history.title}</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.historyScroll}>
              {history.sections.map((section, index) => (
                <View key={index} style={styles.historySection}>
                  <Text style={styles.historySectionTitle}>{section.title}</Text>
                  <Text style={styles.historySectionContent}>{section.content}</Text>
                </View>
              ))}

              {/* Sources */}
              <View style={styles.sourcesSection}>
                <Text style={styles.sourcesTitle}>
                  {language === 'de' ? 'Quellen' : 'Sources'}
                </Text>
                {history.sources.map((source, index) => (
                  <View key={index} style={styles.sourceItem}>
                    <Text style={styles.sourceTitle}>{source.title}</Text>
                    <Text style={styles.sourceAuthor}>
                      {source.author} ({source.year})
                    </Text>
                    {source.link && (
                      <TouchableOpacity onPress={() => Linking.openURL(source.link)}>
                        <Text style={styles.sourceLink}>
                          {language === 'de' ? 'Dokument öffnen' : 'Open Document'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowHistory(false)}
            >
              <Text style={styles.closeButtonText}>
                {language === 'de' ? 'Schließen' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 4,
    marginBottom: 20,
  },
  dailyFactCard: {
    backgroundColor: colors.overlay.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.status.warning + '40',
  },
  dailyFactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dailyFactTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.status.warning,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dailyFactText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  specialCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  specialGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  specialContent: {
    flex: 1,
  },
  specialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  specialDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  documentLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  documentLinkText: {
    fontSize: 14,
    color: colors.accent.glow,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 16,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.overlay.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  toolDesc: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 4,
    lineHeight: 18,
  },
  highlightCard: {
    backgroundColor: colors.overlay.medium,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  highlightNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.accent.glow,
    letterSpacing: 8,
  },
  highlightText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay.dark,
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  historyModal: {
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.overlay.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
  },
  modalScroll: {
    maxHeight: 400,
    marginBottom: 16,
  },
  modalDesc: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  disclaimerBox: {
    backgroundColor: colors.status.warning + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.status.warning + '40',
  },
  disclaimerText: {
    fontSize: 13,
    color: colors.status.warning,
    lineHeight: 20,
  },
  techniqueBox: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
  },
  techniqueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.glow,
    marginBottom: 12,
  },
  techniqueText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  affirmationScroll: {
    maxHeight: 350,
    marginBottom: 16,
  },
  affirmationText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 28,
    fontStyle: 'italic',
  },
  affirmationNote: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 20,
    textAlign: 'center',
  },
  historyScroll: {
    marginBottom: 16,
  },
  historySection: {
    marginBottom: 24,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent.glow,
    marginBottom: 8,
  },
  historySectionContent: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  sourcesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  sourcesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  sourceItem: {
    marginBottom: 16,
  },
  sourceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  sourceAuthor: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  sourceLink: {
    fontSize: 13,
    color: colors.accent.glow,
    marginTop: 4,
  },
});
