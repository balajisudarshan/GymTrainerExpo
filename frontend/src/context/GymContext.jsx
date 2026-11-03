import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_INITIAL_CLIENTS, INITIAL_TRAINER } from '../data/mockData';

const GymContext = createContext();

const STORAGE_KEY_CLIENTS = '@fitcoach_mobile_clients_v1';
const STORAGE_KEY_ROLE = '@fitcoach_mobile_role_v1';
const STORAGE_KEY_ACTIVE_CLIENT = '@fitcoach_mobile_active_client_v1';

export function GymProvider({ children }) {
  const [role, setRoleState] = useState('select'); // 'select' | 'trainer' | 'client'
  const [clients, setClients] = useState(ALL_INITIAL_CLIENTS);
  const [activeClientId, setActiveClientIdState] = useState('c1');
  const [selectedDay, setSelectedDay] = useState('Wed');
  const [trainer, setTrainer] = useState(INITIAL_TRAINER);
  const [toast, setToast] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted demo data on initial mount
  useEffect(() => {
    async function loadStorage() {
      try {
        const storedRole = await AsyncStorage.getItem(STORAGE_KEY_ROLE);
        const storedClients = await AsyncStorage.getItem(STORAGE_KEY_CLIENTS);
        const storedActiveClient = await AsyncStorage.getItem(STORAGE_KEY_ACTIVE_CLIENT);

        if (storedRole) setRoleState(storedRole);
        if (storedClients) {
          const parsed = JSON.parse(storedClients);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClients(parsed);
          }
        }
        if (storedActiveClient) setActiveClientIdState(storedActiveClient);
      } catch (e) {
        console.warn('Failed to load storage in mobile app', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadStorage();
  }, []);

  // Save changes to AsyncStorage
  const saveClientsToStorage = async (newClients) => {
    setClients(newClients);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(newClients));
    } catch (e) {
      console.warn('Error saving clients', e);
    }
  };

  const setRole = async (newRole) => {
    setRoleState(newRole);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ROLE, newRole);
    } catch (e) {
      console.warn('Error saving role', e);
    }
  };

  const setActiveClientId = async (newId) => {
    setActiveClientIdState(newId);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ACTIVE_CLIENT, newId);
    } catch (e) {
      console.warn('Error saving active client id', e);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Active client object
  const activeClient = clients.find((c) => c.id === activeClientId) || clients[0] || null;

  // Stats calculation matching reference panel 2
  const stats = {
    totalClients: clients.length,
    activePlans: clients.filter((c) => c.status === 'Active' || c.status === 'Ending').length,
    paymentsDue: clients.filter((c) => c.status === 'Due' || c.remainingAmount > 0).length,
    coursesEnding: clients.filter((c) => c.status === 'Ending' || c.week >= c.totalWeeks - 1).length,
    completedClients: clients.filter((c) => c.status === 'Completed' || c.isExpired).length,
  };

  // -------------------------------------------------------------
  // CLIENT CRUD
  // -------------------------------------------------------------
  const addClient = (formData) => {
    const id = 'c_' + Date.now();
    const initials = formData.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newClient = {
      id,
      name: formData.name,
      initials,
      avatarColor: '#8BFF36',
      age: Number(formData.age) || 24,
      gender: formData.gender || 'Male',
      weight: Number(formData.weight) || 75,
      targetWeight: Number(formData.targetWeight) || 72,
      height: formData.height || '178 cm',
      goal: formData.goal || 'Muscle Gain',
      plan: `${formData.totalWeeks || 12} Weeks Plan`,
      week: 1,
      totalWeeks: Number(formData.totalWeeks) || 12,
      currentDayIndex: 1,
      status: 'Active',
      progress: '+0.0%',
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      endDate: new Date(Date.now() + 84 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalAmount: Number(formData.totalAmount) || 12000,
      paidAmount: Number(formData.paidAmount) || 6000,
      remainingAmount: (Number(formData.totalAmount) || 12000) - (Number(formData.paidAmount) || 6000),
      nextPaymentDue: '30 Days',
      targetCalories: Number(formData.targetCalories) || 2500,
      targetProtein: Number(formData.targetProtein) || 150,
      targetCarbs: 260,
      targetFats: 65,
      workouts: clients[0]?.workouts || {},
      diet: clients[0]?.diet || {},
      weightHistory: [{ week: 'W1', weight: Number(formData.weight) || 75 }],
      paymentsHistory: [
        {
          id: 'pay_' + Date.now(),
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: Number(formData.paidAmount) || 6000,
          note: 'Deposit Advance',
          method: 'UPI',
          status: 'Paid',
        },
      ],
      notes: formData.notes || 'Newly registered client.',
      isExpired: false,
    };

    const updated = [newClient, ...clients];
    saveClientsToStorage(updated);
    setActiveClientId(id);
    showToast(`Client ${newClient.name} added successfully!`);
    return newClient;
  };

  const updateClient = (id, fields) => {
    const updated = clients.map((c) => (c.id === id ? { ...c, ...fields } : c));
    saveClientsToStorage(updated);
    showToast('Client details updated');
  };

  const deleteClient = (id) => {
    const target = clients.find((c) => c.id === id);
    const updated = clients.filter((c) => c.id !== id);
    saveClientsToStorage(updated);
    if (activeClientId === id) {
      setActiveClientId(updated[0]?.id || 'c1');
    }
    showToast(`Removed client ${target?.name || ''}`, 'error');
  };

  // -------------------------------------------------------------
  // WORKOUT ACTIONS
  // -------------------------------------------------------------
  const addExercise = (clientId, day, exercise) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const dayWorkouts = c.workouts[day] || [];
        const newEx = {
          id: 'ex_' + Date.now(),
          name: exercise.name,
          sets: Number(exercise.sets) || 4,
          reps: exercise.reps || '10-12',
          weight: exercise.weight || '30 kg',
          rest: exercise.rest || '60s',
          completed: false,
        };
        return {
          ...c,
          workouts: {
            ...c.workouts,
            [day]: [...dayWorkouts, newEx],
          },
        };
      }
      return c;
    });
    saveClientsToStorage(updated);
    showToast(`Added exercise to ${day}`);
  };

  const deleteExercise = (clientId, day, exerciseId) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          workouts: {
            ...c.workouts,
            [day]: (c.workouts[day] || []).filter((ex) => ex.id !== exerciseId),
          },
        };
      }
      return c;
    });
    saveClientsToStorage(updated);
    showToast('Exercise deleted', 'error');
  };

  const toggleExerciseCompleted = (clientId, day, exerciseId) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const updatedList = (c.workouts[day] || []).map((ex) => {
          if (ex.id === exerciseId) return { ...ex, completed: !ex.completed };
          return ex;
        });
        return {
          ...c,
          workouts: {
            ...c.workouts,
            [day]: updatedList,
          },
        };
      }
      return c;
    });
    saveClientsToStorage(updated);
  };

  // -------------------------------------------------------------
  // DIET ACTIONS
  // -------------------------------------------------------------
  const addMeal = (clientId, day, meal) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const dayMeals = c.diet[day] || [];
        const newMeal = {
          id: 'm_' + Date.now(),
          name: meal.name || 'Meal',
          time: meal.time || '12:00 PM',
          items: meal.items || 'Balanced meal',
          calories: Number(meal.calories) || 500,
          protein: Number(meal.protein) || 30,
          carbs: Number(meal.carbs) || 50,
          fats: Number(meal.fats) || 15,
          eaten: false,
          icon: 'food',
        };
        return {
          ...c,
          diet: {
            ...c.diet,
            [day]: [...dayMeals, newMeal],
          },
        };
      }
      return c;
    });
    saveClientsToStorage(updated);
    showToast(`Added meal to ${day}`);
  };

  const deleteMeal = (clientId, day, mealId) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          diet: {
            ...c.diet,
            [day]: (c.diet[day] || []).filter((m) => m.id !== mealId),
          },
        };
      }
      return c;
    });
    saveClientsToStorage(updated);
    showToast('Meal removed', 'error');
  };

  const toggleMealEaten = (clientId, day, mealId) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const updatedMeals = (c.diet[day] || []).map((m) => {
          if (m.id === mealId) return { ...m, eaten: !m.eaten };
          return m;
        });
        return {
          ...c,
          diet: {
            ...c.diet,
            [day]: updatedMeals,
          },
        };
      }
      return c;
    });
    saveClientsToStorage(updated);
  };

  // -------------------------------------------------------------
  // PAYMENT ACTIONS
  // -------------------------------------------------------------
  const markPaymentAsPaid = (clientId) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const due = c.remainingAmount;
        if (due <= 0) return c;

        const newPayRecord = {
          id: 'pay_' + Date.now(),
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: due,
          note: 'Balance Settled in FitCoach App',
          method: 'UPI / Razorpay',
          status: 'Paid',
        };

        return {
          ...c,
          paidAmount: c.totalAmount,
          remainingAmount: 0,
          status: c.status === 'Due' ? 'Active' : c.status,
          nextPaymentDue: 'Paid in Full',
          paymentsHistory: [newPayRecord, ...(c.paymentsHistory || [])],
        };
      }
      return c;
    });

    saveClientsToStorage(updated);
    showToast('Payment recorded! Balance cleared in INR (₹).');
  };

  const recordPayment = (clientId, amount, note, method = 'UPI') => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const numAmount = Number(amount);
        const newPaid = c.paidAmount + numAmount;
        const newRemaining = Math.max(0, c.totalAmount - newPaid);

        const newRecord = {
          id: 'pay_' + Date.now(),
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: numAmount,
          note: note || 'Installment Payment',
          method: method || 'UPI',
          status: 'Paid',
        };

        return {
          ...c,
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          status: newRemaining === 0 && c.status === 'Due' ? 'Active' : c.status,
          nextPaymentDue: newRemaining === 0 ? 'Paid in Full' : 'Next Month',
          paymentsHistory: [newRecord, ...(c.paymentsHistory || [])],
        };
      }
      return c;
    });

    saveClientsToStorage(updated);
    showToast(`Recorded payment of ₹${Number(amount).toLocaleString('en-IN')}`);
  };

  // -------------------------------------------------------------
  // MEMBERSHIP RENEWAL & EXPIRATION SIMULATION
  // -------------------------------------------------------------
  const renewMembership = (clientId, weeks = 12, fee = 12000) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          isExpired: false,
          status: 'Active',
          week: 1,
          totalWeeks: Number(weeks),
          startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          endDate: new Date(Date.now() + weeks * 7 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          totalAmount: Number(fee),
          paidAmount: Number(fee),
          remainingAmount: 0,
          nextPaymentDue: 'Paid in Full',
          progress: '+0.5%',
        };
      }
      return c;
    });

    saveClientsToStorage(updated);
    showToast(`Membership renewed for ${weeks} weeks! All access unlocked.`);
  };

  const toggleSimulateExpired = (clientId) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const next = !c.isExpired;
        return {
          ...c,
          isExpired: next,
          status: next ? 'Completed' : 'Active',
        };
      }
      return c;
    });

    saveClientsToStorage(updated);
    const target = clients.find((c) => c.id === clientId);
    const nextExpired = !target?.isExpired;
    showToast(
      nextExpired
        ? `${target?.name || 'Client'}: Course completed & locked!`
        : `${target?.name || 'Client'}: Access unlocked!`,
      nextExpired ? 'error' : 'success'
    );
  };

  const resetAllDemoData = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY_CLIENTS, STORAGE_KEY_ROLE, STORAGE_KEY_ACTIVE_CLIENT]);
    } catch (e) {
      console.warn('AsyncStorage clear error', e);
    }
    setClients(ALL_INITIAL_CLIENTS);
    setActiveClientIdState('c1');
    setRoleState('trainer');
    showToast('Demo data reset to initial defaults.');
  };

  return (
    <GymContext.Provider
      value={{
        isLoaded,
        role,
        setRole,
        clients,
        activeClientId,
        setActiveClientId,
        activeClient,
        selectedDay,
        setSelectedDay,
        trainer,
        stats,
        toast,
        showToast,
        // Actions
        addClient,
        updateClient,
        deleteClient,
        addExercise,
        deleteExercise,
        toggleExerciseCompleted,
        addMeal,
        deleteMeal,
        toggleMealEaten,
        markPaymentAsPaid,
        recordPayment,
        renewMembership,
        toggleSimulateExpired,
        resetAllDemoData,
      }}
    >
      {children}
    </GymContext.Provider>
  );
}

export function useGym() {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
}

