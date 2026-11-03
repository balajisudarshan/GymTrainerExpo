import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../../components/common/Badge';
import ExerciseItem from '../../components/trainer/ExerciseItem';
import MealItem from '../../components/trainer/MealItem';
import ActionButton from '../../components/common/ActionButton';
import { useGym } from '../../context/GymContext';
import { formatINR } from '../../utils/formatters';
import { COLORS, SIZES } from '../../constants/theme';

export default function ClientDetailScreen({ route, navigation }) {
  const { 
    clients, 
    activeClientId, 
    selectedDay, 
    setSelectedDay,
    toggleExerciseCompleted,
    deleteExercise,
    addExercise,
    toggleMealEaten,
    deleteMeal,
    addMeal,
    markPaymentAsPaid,
    toggleSimulateExpired,
    renewMembership 
  } = useGym();

  const clientId = route?.params?.clientId || activeClientId;
  const client = clients.find((c) => c.id === clientId) || clients[0];

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'workout' | 'diet' | 'payments' | 'progress'
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [renewModalVisible, setRenewModalVisible] = useState(false);

  // Exercise form state
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('4');
  const [newExReps, setNewExReps] = useState('10-12');
  const [newExWeight, setNewExWeight] = useState('40 kg');
  const [newExRest, setNewExRest] = useState('60s');

  // Meal form state
  const [newMealName, setNewMealName] = useState('Breakfast');
  const [newMealTime, setNewMealTime] = useState('8:00 AM');
  const [newMealItems, setNewMealItems] = useState('');
  const [newMealCals, setNewMealCals] = useState('550');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const currentWorkouts = client?.workouts?.[selectedDay] || [];
  const currentDiet = client?.diet?.[selectedDay] || [];

  const totalCals = currentDiet.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
  const totalProtein = currentDiet.reduce((sum, m) => sum + (Number(m.protein) || 0), 0);
  const totalCarbs = currentDiet.reduce((sum, m) => sum + (Number(m.carbs) || 0), 0);
  const totalFats = currentDiet.reduce((sum, m) => sum + (Number(m.fats) || 0), 0);

  const handleAddExerciseSubmit = () => {
    if (!newExName.trim()) return;
    addExercise(client.id, selectedDay, {
      name: newExName,
      sets: newExSets,
      reps: newExReps,
      weight: newExWeight,
      rest: newExRest,
    });
    setNewExName('');
    setExerciseModalVisible(false);
  };

  const handleAddMealSubmit = () => {
    if (!newMealItems.trim()) return;
    addMeal(client.id, selectedDay, {
      name: newMealName,
      time: newMealTime,
      items: newMealItems,
      calories: newMealCals,
      protein: 35,
    });
    setNewMealItems('');
    setMealModalVisible(false);
  };

  if (!client) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header Bar matching Panel 4 */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => toggleSimulateExpired(client.id)}
          style={styles.navBtn}
        >
          <Ionicons 
            name={client.isExpired ? 'lock-open-outline' : 'lock-closed-outline'} 
            size={18} 
            color={client.isExpired ? COLORS.primaryGreen : COLORS.error} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Client Profile Header matching Panel 4 */}
        <View style={styles.profileHeader}>
          <View style={styles.profileLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{client.initials}</Text>
            </View>
            <View>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientSubtitle}>
                {client.age} • {client.gender} • {client.weight} kg
              </Text>
            </View>
          </View>

          <Badge status={client.isExpired ? 'Completed' : client.status} />
        </View>

        {/* Tab Selector Bar matching Panel 4: Overview, Workout, Diet, Payment, Progress */}
        <View style={styles.tabBar}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'workout', label: 'Workout' },
            { id: 'diet', label: 'Diet' },
            { id: 'payments', label: 'Payment' },
            { id: 'progress', label: 'Progress' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
              >
                <Text style={[styles.tabItemText, isActive && styles.tabItemTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ----------------------------------------------------------------- */}
        {/* 1. OVERVIEW TAB matching Panel 4 */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <View>
            {/* 4 Metric Cards matching Panel 4: Week 3/12, Muscle Gain, 78kg, +6.4% */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Ionicons name="calendar-outline" size={17} color={COLORS.primaryGreen} />
                <Text style={styles.metricLabel}>WEEK</Text>
                <Text style={styles.metricValue}>{client.week} / {client.totalWeeks}</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="fitness-outline" size={17} color={COLORS.primaryGreen} />
                <Text style={styles.metricLabel}>GOAL</Text>
                <Text style={styles.metricValueSmall}>{client.goal}</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="speedometer-outline" size={17} color={COLORS.primaryGreen} />
                <Text style={styles.metricLabel}>WEIGHT</Text>
                <Text style={styles.metricValue}>{client.weight} kg</Text>
              </View>

              <View style={styles.metricCard}>
                <Ionicons name="trending-up-outline" size={17} color={COLORS.primaryGreen} />
                <Text style={styles.metricLabel}>PROGRESS</Text>
                <Text style={[styles.metricValue, { color: COLORS.primaryGreen }]}>
                  {client.progress}
                </Text>
              </View>
            </View>

            {/* This Week's Plan Section matching Panel 4 */}
            <View style={styles.planCard}>
              <View style={styles.planHeaderRow}>
                <Text style={styles.planTitle}>This Week's Plan</Text>
                <Text style={styles.planCounter}>Day {client.currentDayIndex || 3} of 7</Text>
              </View>

              {/* Day selector row matching Panel 4 (Mon ✓, Tue ✓, Wed active green) */}
              <View style={styles.daysRow}>
                {daysOfWeek.map((day, idx) => {
                  const isCurrentActive = selectedDay === day;
                  const isChecked = idx < 2; // Mon and Tue checked in screenshot!

                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() => setSelectedDay(day)}
                      style={[
                        styles.dayBox,
                        isCurrentActive ? styles.dayBoxActive : styles.dayBoxInactive,
                      ]}
                    >
                      <Text style={[styles.dayText, isCurrentActive && styles.dayTextActive]}>
                        {day}
                      </Text>
                      <View style={styles.checkSlot}>
                        {isChecked && (
                          <Ionicons 
                            name="checkmark" 
                            size={14} 
                            color={isCurrentActive ? COLORS.textDark : COLORS.primaryGreen} 
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Program notes & target preview */}
            <View style={styles.notesCard}>
              <Text style={styles.notesTitle}>Trainer Program Notes</Text>
              <Text style={styles.notesBody}>{client.notes}</Text>
            </View>
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* 2. WORKOUT TAB */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'workout' && (
          <View>
            <View style={styles.subHeaderRow}>
              <Text style={styles.subTitle}>{selectedDay}'s Exercises ({currentWorkouts.length})</Text>
              <TouchableOpacity
                onPress={() => setExerciseModalVisible(true)}
                style={styles.actionBtnSmall}
              >
                <Ionicons name="add" size={16} color={COLORS.textDark} />
                <Text style={styles.actionBtnSmallText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>

            {/* Weekday Switcher */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[styles.weekdayPill, selectedDay === day && styles.weekdayPillActive]}
                >
                  <Text style={[styles.weekdayPillText, selectedDay === day && styles.weekdayPillTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Exercise items list */}
            {currentWorkouts.map((ex) => (
              <ExerciseItem
                key={ex.id}
                exercise={ex}
                onToggleComplete={() => toggleExerciseCompleted(client.id, selectedDay, ex.id)}
                onDelete={() => deleteExercise(client.id, selectedDay, ex.id)}
              />
            ))}

            {currentWorkouts.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyCardText}>No exercises scheduled for {selectedDay}.</Text>
              </View>
            )}
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* 3. DIET TAB matching Panel 5 */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'diet' && (
          <View>
            {/* Header matching Panel 5: Diet Plan / Adithya R. • Muscle Gain • 2800 kcal/day */}
            <View style={styles.subHeaderRow}>
              <View>
                <Text style={styles.subTitle}>Diet Plan</Text>
                <Text style={styles.subDesc}>
                  {client.name} • {client.goal} • {client.targetCalories} kcal/day
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setMealModalVisible(true)}
                style={styles.actionBtnSmall}
              >
                <Ionicons name="add" size={16} color={COLORS.textDark} />
                <Text style={styles.actionBtnSmallText}>Add Meal</Text>
              </TouchableOpacity>
            </View>

            {/* Weekday selector matching Panel 5: Mon (active green), Tue, Wed, Thu, Fri, Sat, Sun */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[styles.weekdayPill, selectedDay === day && styles.weekdayPillActive]}
                >
                  <Text style={[styles.weekdayPillText, selectedDay === day && styles.weekdayPillTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Meals List matching Panel 5 */}
            {currentDiet.map((meal) => (
              <MealItem
                key={meal.id}
                meal={meal}
                onToggleEaten={() => toggleMealEaten(client.id, selectedDay, meal.id)}
                onDelete={() => deleteMeal(client.id, selectedDay, meal.id)}
              />
            ))}

            {/* Macro Summary Card */}
            <View style={styles.macroCard}>
              <Text style={styles.macroTitle}>Daily Macro Totals ({selectedDay})</Text>
              <View style={styles.macroRow}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>CALORIES</Text>
                  <Text style={[styles.macroVal, { color: COLORS.primaryGreen }]}>{totalCals}</Text>
                  <Text style={styles.macroTarget}>/{client.targetCalories} kcal</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>PROTEIN</Text>
                  <Text style={styles.macroVal}>{totalProtein}g</Text>
                  <Text style={styles.macroTarget}>/{client.targetProtein}g</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>CARBS</Text>
                  <Text style={styles.macroVal}>{totalCarbs}g</Text>
                  <Text style={styles.macroTarget}>/320g</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>FATS</Text>
                  <Text style={styles.macroVal}>{totalFats}g</Text>
                  <Text style={styles.macroTarget}>/75g</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* 4. PAYMENTS TAB matching Panel 6 */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'payments' && (
          <View>
            {/* Header */}
            <Text style={styles.subTitle}>Payment</Text>
            <Text style={[styles.subDesc, { marginBottom: 16 }]}>{client.name}</Text>

            {/* Next Payment Due Card matching Panel 6 */}
            <View style={styles.dueCard}>
              <View>
                <Text style={styles.dueLabel}>Next Payment Due</Text>
                <Text style={styles.dueAmount}>
                  {formatINR(client.remainingAmount)}
                </Text>
                <Text style={styles.dueDate}>Due on {client.nextPaymentDue}</Text>
              </View>

              {client.remainingAmount > 0 ? (
                <TouchableOpacity
                  onPress={() => markPaymentAsPaid(client.id)}
                  style={styles.markPaidBtn}
                >
                  <Ionicons name="checkmark-circle" size={17} color={COLORS.textDark} />
                  <Text style={styles.markPaidText}>Mark as Paid</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.miniBadge, { backgroundColor: COLORS.greenMuted }]}>
                  <Text style={{ color: COLORS.primaryGreen, fontWeight: '700', fontSize: 12 }}>Settled</Text>
                </View>
              )}
            </View>

            {/* Details List matching Panel 6 */}
            <View style={styles.detailsListCard}>
              {/* Course */}
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.primaryGreen} />
                  <Text style={styles.detailKey}>Course</Text>
                </View>
                <Text style={styles.detailValue}>{client.plan}</Text>
              </View>

              {/* Start Date */}
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.primaryGreen} />
                  <Text style={styles.detailKey}>Start Date</Text>
                </View>
                <Text style={styles.detailValue}>{client.startDate}</Text>
              </View>

              {/* End Date */}
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons name="flag-outline" size={16} color={COLORS.primaryGreen} />
                  <Text style={styles.detailKey}>End Date</Text>
                </View>
                <Text style={styles.detailValue}>{client.endDate}</Text>
              </View>

              <View style={styles.divider} />

              {/* Total Amount */}
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Text style={{ color: COLORS.primaryGreen, fontWeight: '800' }}>₹</Text>
                  <Text style={styles.detailKey}>Total Amount</Text>
                </View>
                <Text style={[styles.detailValue, { fontWeight: '800' }]}>
                  {formatINR(client.totalAmount)}
                </Text>
              </View>

              {/* Paid */}
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons name="card-outline" size={16} color={COLORS.primaryGreen} />
                  <Text style={styles.detailKey}>Paid</Text>
                </View>
                <Text style={[styles.detailValue, { color: COLORS.primaryGreen, fontWeight: '800' }]}>
                  {formatINR(client.paidAmount)}
                </Text>
              </View>

              {/* Remaining */}
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons name="hourglass-outline" size={16} color={COLORS.error} />
                  <Text style={styles.detailKey}>Remaining</Text>
                </View>
                <Text style={[styles.detailValue, { color: client.remainingAmount > 0 ? COLORS.error : COLORS.textMuted, fontWeight: '800' }]}>
                  {formatINR(client.remainingAmount)}
                </Text>
              </View>
            </View>

            {/* Renewal button */}
            <ActionButton
              title="Renew / Extend Plan"
              variant="secondary"
              icon="refresh"
              onPress={() => setRenewModalVisible(true)}
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* 5. PROGRESS TAB */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'progress' && (
          <View>
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>Weight Progression Log</Text>
              <Text style={styles.progressSubtitle}>Starting: 75.8 kg → Current: {client.weight} kg (Goal: {client.targetWeight} kg)</Text>

              <View style={styles.historyList}>
                {(client.weightHistory || []).map((w, idx) => (
                  <View key={idx} style={styles.historyRow}>
                    <Text style={styles.historyWeek}>{w.week}</Text>
                    <Text style={styles.historyWeight}>{w.weight} kg</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Exercise Modal */}
      <Modal visible={exerciseModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <Text style={styles.modalHeaderTitle}>Add Exercise ({selectedDay})</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Exercise Name (e.g. Incline Bench Press)"
              placeholderTextColor={COLORS.textMuted}
              value={newExName}
              onChangeText={setNewExName}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput style={[styles.modalInput, { flex: 1 }]} placeholder="Sets" placeholderTextColor={COLORS.textMuted} value={newExSets} onChangeText={setNewExSets} />
              <TextInput style={[styles.modalInput, { flex: 1 }]} placeholder="Reps" placeholderTextColor={COLORS.textMuted} value={newExReps} onChangeText={setNewExReps} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput style={[styles.modalInput, { flex: 1 }]} placeholder="Weight" placeholderTextColor={COLORS.textMuted} value={newExWeight} onChangeText={setNewExWeight} />
              <TextInput style={[styles.modalInput, { flex: 1 }]} placeholder="Rest" placeholderTextColor={COLORS.textMuted} value={newExRest} onChangeText={setNewExRest} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <ActionButton title="Cancel" variant="secondary" onPress={() => setExerciseModalVisible(false)} style={{ flex: 1 }} />
              <ActionButton title="Add" variant="primary" onPress={handleAddExerciseSubmit} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Meal Modal */}
      <Modal visible={mealModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <Text style={styles.modalHeaderTitle}>Add Meal ({selectedDay})</Text>
            <TextInput style={styles.modalInput} placeholder="Meal Type (e.g. Breakfast, Lunch)" placeholderTextColor={COLORS.textMuted} value={newMealName} onChangeText={setNewMealName} />
            <TextInput style={styles.modalInput} placeholder="Time (e.g. 7:30 AM)" placeholderTextColor={COLORS.textMuted} value={newMealTime} onChangeText={setNewMealTime} />
            <TextInput style={styles.modalInput} placeholder="Food Items & Quantity" placeholderTextColor={COLORS.textMuted} value={newMealItems} onChangeText={setNewMealItems} />
            <TextInput style={styles.modalInput} placeholder="Calories (kcal)" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" value={newMealCals} onChangeText={setNewMealCals} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <ActionButton title="Cancel" variant="secondary" onPress={() => setMealModalVisible(false)} style={{ flex: 1 }} />
              <ActionButton title="Add Meal" variant="primary" onPress={handleAddMealSubmit} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Renew Modal */}
      <Modal visible={renewModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <Text style={styles.modalHeaderTitle}>Renew Membership Plan</Text>
            <Text style={{ fontSize: SIZES.fontSm, color: COLORS.textSecondary, marginBottom: 14 }}>
              Extend course duration for {client.name} and unlock app access.
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <ActionButton title="Cancel" variant="secondary" onPress={() => setRenewModalVisible(false)} style={{ flex: 1 }} />
              <ActionButton 
                title="Renew (12 Wks)" 
                variant="primary" 
                onPress={() => {
                  renewMembership(client.id, 12, 12000);
                  setRenewModalVisible(false);
                }} 
                style={{ flex: 1 }} 
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingMd,
    paddingVertical: 8,
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.paddingMd,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 6,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1.5,
    borderColor: COLORS.greenBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.primaryGreen,
  },
  clientName: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  clientSubtitle: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.primaryGreen,
  },
  tabItemText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabItemTextActive: {
    color: COLORS.primaryGreen,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    padding: 12,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  metricValue: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  metricValueSmall: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  planCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 16,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  planCounter: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dayBox: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: SIZES.radiusSm,
    alignItems: 'center',
    borderWidth: 1,
  },
  dayBoxActive: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: COLORS.primaryGreen,
  },
  dayBoxInactive: {
    backgroundColor: COLORS.cardSurface,
    borderColor: COLORS.border,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dayTextActive: {
    color: COLORS.textDark,
  },
  checkSlot: {
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  notesCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
  },
  notesTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  notesBody: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subDesc: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: SIZES.radiusSm,
  },
  actionBtnSmallText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  pillScroll: {
    marginBottom: 12,
  },
  weekdayPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  weekdayPillActive: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: COLORS.primaryGreen,
  },
  weekdayPillText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  weekdayPillTextActive: {
    color: COLORS.textDark,
  },
  emptyCard: {
    padding: 24,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  emptyCardText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSm,
  },
  macroCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginTop: 8,
  },
  macroTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  macroVal: {
    fontSize: SIZES.fontMd,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  macroTarget: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  dueCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 14,
  },
  dueLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
  },
  dueAmount: {
    fontSize: SIZES.font2xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  dueDate: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
  },
  markPaidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: SIZES.radiusSm,
  },
  markPaidText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  detailsListCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailKey: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: SIZES.fontSm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  progressCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
  },
  progressTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  progressSubtitle: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  historyList: {
    gap: 6,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  historyWeek: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  historyWeight: {
    fontSize: SIZES.fontSm,
    color: COLORS.primaryGreen,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBody: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  modalHeaderTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.textPrimary,
    fontSize: SIZES.fontSm,
    marginBottom: 10,
  },
});

