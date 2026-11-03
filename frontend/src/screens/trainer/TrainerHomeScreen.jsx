import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderBar from '../../components/common/HeaderBar';
import MetricStatCard from '../../components/common/MetricStatCard';
import ClientProgressChart from '../../components/trainer/ClientProgressChart';
import QuickActionsRow from '../../components/trainer/QuickActionsRow';
import ClientCard from '../../components/trainer/ClientCard';
import AddClientModal from '../../components/trainer/AddClientModal';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function TrainerHomeScreen({ navigation }) {
  const { stats, clients, setActiveClientId, setSelectedDay } = useGym();
  const [addModalVisible, setAddModalVisible] = useState(false);

  const recentClients = clients.slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <HeaderBar />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Greeting matching Panel 2 */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Good Evening, Coach 👋</Text>
          <Text style={styles.greetingSubtitle}>Here's how your clients are doing today.</Text>
        </View>

        {/* 4 Stat Cards matching Panel 2: 42, 37, 5, 12 */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <MetricStatCard
              icon="people-outline"
              value={stats.totalClients}
              label="Total Clients"
              iconColor={COLORS.primaryGreen}
              iconBg={COLORS.greenMuted}
              onPress={() => navigation.navigate('Clients')}
            />
            <MetricStatCard
              icon="barbell-outline"
              value={stats.activePlans}
              label="Active Plans"
              iconColor={COLORS.primaryGreen}
              iconBg={COLORS.greenMuted}
              onPress={() => navigation.navigate('Clients')}
            />
          </View>

          <View style={styles.statsRow}>
            <MetricStatCard
              icon="card-outline"
              value={stats.paymentsDue}
              label="Payments Due"
              iconColor={COLORS.error}
              iconBg={COLORS.errorMuted}
              onPress={() => navigation.navigate('Payments')}
            />
            <MetricStatCard
              icon="checkmark-circle-outline"
              value={stats.coursesEnding}
              label="Courses Ending"
              iconColor={COLORS.warning}
              iconBg={COLORS.warningMuted}
              onPress={() => navigation.navigate('Clients')}
            />
          </View>
        </View>

        {/* Client Progress Chart matching Panel 2 */}
        <ClientProgressChart />

        {/* Quick Actions matching Panel 2 */}
        <QuickActionsRow
          onAddClient={() => setAddModalVisible(true)}
          onAssignPlan={() => {
            setSelectedDay('Wed');
            navigation.navigate('Plans');
          }}
          onAddDiet={() => {
            setSelectedDay('Wed');
            navigation.navigate('Plans');
          }}
          onRecordPayment={() => navigation.navigate('Payments')}
        />

        {/* Recent Clients Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Clients</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Clients')}>
              <Text style={styles.viewAllText}>View All ({clients.length})</Text>
            </TouchableOpacity>
          </View>

          {recentClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onPress={() => {
                setActiveClientId(client.id);
                navigation.navigate('ClientDetail', { clientId: client.id });
              }}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Client Modal */}
      <AddClientModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.paddingMd,
  },
  greetingSection: {
    marginTop: 16,
    marginBottom: 18,
  },
  greetingTitle: {
    fontSize: SIZES.fontXl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsGrid: {
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  recentSection: {
    marginTop: 6,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  viewAllText: {
    fontSize: SIZES.fontSm,
    color: COLORS.primaryGreen,
    fontWeight: '600',
  },
});

