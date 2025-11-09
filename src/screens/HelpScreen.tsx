import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from '../theme';
import CommonHeader from '../components/CommonHeader';
import MenuItem from '../components/MenuItem';
import {faqItems, supportOptions, commonIssues} from '../data/helpData';

function HelpScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleSupportAction = (option: typeof supportOptions[0]) => {
    switch (option.action) {
      case 'email':
        if (option.value) {
          Linking.openURL(`mailto:${option.value}?subject=Support Request`);
        }
        break;
      case 'chat':
        Alert.alert('Live Chat', 'Live chat feature coming soon!');
        break;
      case 'feedback':
        Alert.alert(
          'Send Feedback',
          'Thank you for your interest! Please email us at support@dramadrop.com with your feedback.',
          [
            {
              text: 'Email',
              onPress: () => Linking.openURL('mailto:support@dramadrop.com?subject=App Feedback'),
            },
            {text: 'Cancel', style: 'cancel'},
          ],
        );
        break;
      case 'link':
        if (option.value) {
          Linking.openURL(option.value);
        }
        break;
    }
  };

  const tabBarHeight = 60 + insets.bottom;
  const bottomPadding = tabBarHeight + theme.spacing.xl;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CommonHeader title="Help & Support" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(index)}
                activeOpacity={0.7}>
                <Text style={styles.faqQuestionText}>{item.question}</Text>
                <Icon
                  name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
              {expandedFAQ === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.menuContainer}>
            {supportOptions.map((option) => (
              <MenuItem
                key={option.id}
                icon={option.icon}
                title={option.title}
                value={option.description}
                onPress={() => handleSupportAction(option)}
              />
            ))}
          </View>
        </View>

        {/* Common Issues Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Issues</Text>
          {commonIssues.map((issue, index) => (
            <View key={index} style={styles.issueCard}>
              <View style={styles.issueHeader}>
                <Icon name="warning-outline" size={20} color={theme.colors.status.warning} />
                <Text style={styles.issueTitle}>{issue.title}</Text>
              </View>
              <Text style={styles.issueSolution}>{issue.solution}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.base,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  menuContainer: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  faqItem: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.md,
  },
  faqAnswer: {
    padding: theme.spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  faqAnswerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
  },
  issueCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  issueTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  issueSolution: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
    marginLeft: theme.spacing.xl,
  },
});

export default HelpScreen;
