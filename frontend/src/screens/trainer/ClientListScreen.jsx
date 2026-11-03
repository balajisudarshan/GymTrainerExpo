import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ClientCard from '../../components/trainer/ClientCard';
import AddClientModal from '../../components/trainer/AddClientModal';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function ClientListScreen({ navigation }) {
  const { clients, setActiveClientId, deleteClient } = useGym();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // 'All' | 'Active' | 'Due' | 'Completed'
  const [addModalVisible, setAddModalVisible] = useState(false);

  const filteredClients = clients.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.goal.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'All') return true;
    if (filter === 'Active') return c.status === 'Active';
    if (filter === 'Due') return c.status === 'Due' || c.remainingAmount > 0;
    if (filter === 'Completed') return c.status === 'Completed' || c.isExpired;
    return true;
  });

  const allCount = clients.length;
  const activeCount = clients.filter((c) => c.status === 'Active').length;
  const dueCount = clients.filter((c) => c.status === 'Due' || c.remainingAmount > 0).length;
  const completedCount = clients.filter((c) => c.status === 'Completed' || c.isExpired).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header matching Panel 3 */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Clients</Text>
              <Text style={styles.subtitle}>Manage and track all your clients.</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setAddModalVisible(true)}
            style={styles.addButton}
          >
            <Ionicons name="add" size={16} color={COLORS.textDark} />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar matching Panel 3 */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={16} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search client..."
              placeholderTextColor={COLORS.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Segmented Filter Pills matching Panel 3 */}
        <View style={styles.filterTabsRow}>
          <TouchableOpacity
            onPress={() => setFilter('All')}
            style={[styles.filterPill, filter === 'All' && styles.filterPillActive]}
          >
            <Text style={[styles.filterPillText, filter === 'All' && styles.filterPillTextActive]}>
              All ({allCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('Active')}
            style={[styles.filterPill, filter === 'Active' && styles.filterPillActive]}
          >
            <Text style={[styles.filterPillText, filter === 'Active' && styles.filterPillTextActive]}>
              Active ({activeCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('Due')}
            style={[styles.filterPill, filter === 'Due' && styles.filterPillDueActive]}
          >
            <Text style={[styles.filterPillText, filter === 'Due' && styles.filterPillTextDueActive]}>
              Due ({dueCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('Completed')}
            style={[styles.filterPill, filter === 'Completed' && styles.filterPillCompletedActive]}
          >
            <Text style={[styles.filterPillText, filter === 'Completed' && styles.filterPillTextCompletedActive]}>
              Completed ({completedCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Client List matching Panel 3 */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onPress={() => {
                setActiveClientId(client.id);
                navigation.navigate('ClientDetail', { clientId: client.id });
              }}
              onDelete={() => deleteClient(client.id)}
            />
          ))}

          {filteredClients.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No clients found.</Text>
            </View>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>

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
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: SIZES.radiusSm,
  },
  addText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: SIZES.fontSm,
    paddingVertical: 8,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: COLORS.primaryGreen,
  },
  filterPillDueActive: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  filterPillCompletedActive: {
    backgroundColor: COLORS.info,
    borderColor: COLORS.info,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.textDark,
  },
  filterPillTextDueActive: {
    color: '#FFF',
  },
  filterPillTextCompletedActive: {
    color: '#FFF',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSm,
  },
});

