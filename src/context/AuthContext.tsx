import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Order, User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  password?: string;
  studentId?: string;
  residence?: string;
  preferredStoreId?: string;
  rememberMe?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  rememberedAccount: User | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  authModalReason: string;
  openAuthModal: (reason?: string, initialMode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (identifier: string, password?: string, rememberMe?: boolean) => { success: boolean; error?: string };
  register: (payload: RegisterPayload) => { success: boolean; error?: string };
  oneTapLogin: () => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  orders: Order[];
  allOrders: Order[];
  addOrder: (order: Order) => void;
  findOrder: (orderNumber: string) => Order | undefined;
  failedAttempts: number;
  resetFailedAttempts: () => void;
}

const DEFAULT_SEED_USERS: (User & { password?: string })[] = [
  {
    id: 'usr-1',
    name: 'John Doe',
    email: 'john.doe@student.egerton.ac.ke',
    phone: '+254 712 345 678',
    whatsappNumber: '+254 712 345 678',
    residence: 'Mara Hall, Block C Room 14, Egerton Main Campus',
    studentId: 'EG/CO/2023/4819',
    preferredStoreId: 'store-1',
    registeredAt: '2026-09-01T10:00:00Z',
    password: 'SinatraUser123!',
  },
  {
    id: 'usr-2',
    name: 'Faith Chebet',
    email: 'faith.chebet@student.egerton.ac.ke',
    phone: '+254 700 987 654',
    whatsappNumber: '+254 700 987 654',
    residence: 'Taifa Hall, Egerton University',
    studentId: 'EG/AG/2024/1102',
    preferredStoreId: 'store-2',
    registeredAt: '2026-09-15T14:30:00Z',
    password: 'SinatraUser123!',
  },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'SN-94281',
    createdAt: '2026-10-29 14:15',
    customerName: 'John Doe',
    phone: '+254 712 345 678',
    email: 'john.doe@student.egerton.ac.ke',
    deliveryType: 'campus_pickup',
    pickupLocation: 'Sinatra Flagship Store (Egerton Student Centre, Rm 12)',
    notes: 'Please keep ready for 4:00 PM collection after lectures.',
    items: [
      {
        productId: 'prod-1',
        productName: 'Sinatra Classic Hoodie',
        selectedSize: 'L',
        selectedColor: 'Onyx Black',
        quantity: 1,
        unitPrice: 2500,
        image: '/images/sinatra-classic-hoodie.png',
      },
    ],
    subtotal: 2500,
    deliveryFee: 0,
    total: 2500,
    status: 'Ready for Collection',
    trackingStep: 3,
  },
  {
    id: 'ord-102',
    orderNumber: 'SN-88120',
    createdAt: '2026-10-14 09:30',
    customerName: 'John Doe',
    phone: '+254 712 345 678',
    email: 'john.doe@student.egerton.ac.ke',
    deliveryType: 'campus_pickup',
    pickupLocation: 'Sinatra Pavilion Store (Egerton Gate B Annex, Shop 4)',
    items: [
      {
        productId: 'prod-2',
        productName: 'Sinatra Oversized T-Shirt',
        selectedSize: 'M',
        selectedColor: 'Warm Cream',
        quantity: 2,
        unitPrice: 1500,
        image: '/images/sinatra-oversized-tshirt.png',
      },
    ],
    subtotal: 3000,
    deliveryFee: 0,
    total: 3000,
    status: 'Delivered',
    trackingStep: 4,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('sinatra_user');
      if (saved === 'null' || saved === 'guest') return null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name?.includes('Kiprop') || parsed?.email?.includes('kiprop')) {
          localStorage.setItem('sinatra_user', JSON.stringify(DEFAULT_SEED_USERS[0]));
          return DEFAULT_SEED_USERS[0];
        }
        return parsed;
      }
      // If no saved state, start as guest so guest homepage is displayed
      return null;
    } catch {
      return null;
    }
  });

  // Remembered account for 1-Tap quick login
  const [rememberedAccount, setRememberedAccount] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('sinatra_remembered_account');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name?.includes('Kiprop') || parsed?.email?.includes('kiprop')) {
          localStorage.setItem('sinatra_remembered_account', JSON.stringify(DEFAULT_SEED_USERS[0]));
          return DEFAULT_SEED_USERS[0];
        }
        return parsed;
      }
      return DEFAULT_SEED_USERS[0];
    } catch {
      return DEFAULT_SEED_USERS[0];
    }
  });

  // Repository of registered users
  const [usersRepository, setUsersRepository] = useState<(User & { password?: string })[]>(() => {
    try {
      const saved = localStorage.getItem('sinatra_users_repository');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((u: any) => u.name?.includes('Kiprop') || u.email?.includes('kiprop'))) {
          localStorage.setItem('sinatra_users_repository', JSON.stringify(DEFAULT_SEED_USERS));
          return DEFAULT_SEED_USERS;
        }
        return parsed;
      }
      return DEFAULT_SEED_USERS;
    } catch {
      return DEFAULT_SEED_USERS;
    }
  });

  // Orders store
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('sinatra_orders');
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalReason, setAuthModalReason] = useState<string>('');

  // Failed login attempts tracker (max 6, alert at 3)
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const saved = sessionStorage.getItem('sinatra_failed_attempts');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sinatra_user', JSON.stringify(user));
    } else {
      localStorage.setItem('sinatra_user', 'null');
    }
  }, [user]);

  useEffect(() => {
    if (rememberedAccount) {
      localStorage.setItem('sinatra_remembered_account', JSON.stringify(rememberedAccount));
    }
  }, [rememberedAccount]);

  useEffect(() => {
    localStorage.setItem('sinatra_users_repository', JSON.stringify(usersRepository));
  }, [usersRepository]);

  useEffect(() => {
    localStorage.setItem('sinatra_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    sessionStorage.setItem('sinatra_failed_attempts', failedAttempts.toString());
  }, [failedAttempts]);

  const openAuthModal = useCallback((reason = '', initialMode: 'login' | 'register' = 'login') => {
    setAuthModalReason(reason);
    setAuthModalMode(initialMode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalReason('');
  }, []);

  const resetFailedAttempts = useCallback(() => {
    setFailedAttempts(0);
  }, []);

  const login = useCallback(
    (identifier: string, password?: string, rememberMe = true): { success: boolean; error?: string } => {
      const cleanId = identifier.trim().toLowerCase();
      if (!cleanId) {
        return { success: false, error: 'Please enter your email, student ID, or phone number.' };
      }

      if (failedAttempts >= 6) {
        return {
          success: false,
          error: 'Maximum login attempts reached (6/6). Please wait or reset your account.',
        };
      }

      // Find user in repository
      const matched = usersRepository.find(
        (u) =>
          u.email.toLowerCase() === cleanId ||
          u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '') ||
          (u.studentId && u.studentId.toLowerCase() === cleanId)
      );

      // If matched and password provided, verify password (or accept demo default password)
      if (matched) {
        if (password && matched.password && matched.password !== password) {
          const nextFails = failedAttempts + 1;
          setFailedAttempts(nextFails);
          const remaining = 6 - nextFails;
          if (remaining <= 0) {
            return {
              success: false,
              error: 'Maximum login attempts reached (6/6). Account temporarily locked.',
            };
          }
          if (nextFails >= 3) {
            return {
              success: false,
              error: `Incorrect password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
            };
          }
          return { success: false, error: 'Incorrect email or password.' };
        }

        const activeUser: User = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          phone: matched.phone,
          whatsappNumber: matched.whatsappNumber || matched.phone,
          residence: matched.residence,
          studentId: matched.studentId,
          preferredStoreId: matched.preferredStoreId || 'store-1',
          lastLoginAt: new Date().toISOString(),
        };

        setUser(activeUser);
        setFailedAttempts(0);
        if (rememberMe) {
          setRememberedAccount(activeUser);
        }
        closeAuthModal();
        return { success: true };
      }

      // If no exact match found, but email looks valid, allow fast-boarding for demo
      if (cleanId.includes('@')) {
        const newUser: User = {
          id: `usr-${Date.now()}`,
          name: cleanId.split('@')[0].replace(/[._-]/g, ' '),
          email: cleanId,
          phone: '+254 712 000 000',
          whatsappNumber: '+254 712 000 000',
          residence: 'Egerton University Main Campus',
          studentId: 'EG/ST/2026/001',
          preferredStoreId: 'store-1',
          registeredAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        setUsersRepository((prev) => [...prev, { ...newUser, password: password || 'SinatraUser123!' }]);
        setUser(newUser);
        setFailedAttempts(0);
        if (rememberMe) {
          setRememberedAccount(newUser);
        }
        closeAuthModal();
        return { success: true };
      }

      const nextFails = failedAttempts + 1;
      setFailedAttempts(nextFails);
      return { success: false, error: 'No account found matching this identifier.' };
    },
    [failedAttempts, usersRepository, closeAuthModal]
  );

  const oneTapLogin = useCallback((): { success: boolean; error?: string } => {
    if (!rememberedAccount) {
      return { success: false, error: 'No saved account to restore.' };
    }
    const updated = {
      ...rememberedAccount,
      lastLoginAt: new Date().toISOString(),
    };
    setUser(updated);
    setRememberedAccount(updated);
    setFailedAttempts(0);
    closeAuthModal();
    return { success: true };
  }, [rememberedAccount, closeAuthModal]);

  const register = useCallback(
    (payload: RegisterPayload): { success: boolean; error?: string } => {
      const cleanEmail = payload.email.trim().toLowerCase();
      const cleanName = payload.name.trim();
      const cleanPhone = payload.phone.trim();

      if (!cleanName || !cleanEmail || !cleanPhone) {
        return { success: false, error: 'Name, email, and phone number are required.' };
      }

      const existing = usersRepository.find(
        (u) => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone
      );
      if (existing) {
        return {
          success: false,
          error: 'An account with this email or phone already exists. Please sign in.',
        };
      }

      const newUser: User & { password?: string } = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        whatsappNumber: payload.whatsappNumber?.trim() || cleanPhone,
        studentId: payload.studentId?.trim() || 'EG/2026/STU',
        residence: payload.residence?.trim() || 'Egerton University Campus',
        preferredStoreId: payload.preferredStoreId || 'store-1',
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        password: payload.password || 'SinatraUser123!',
      };

      setUsersRepository((prev) => [...prev, newUser]);
      setUser(newUser);
      setFailedAttempts(0);
      if (payload.rememberMe ?? true) {
        setRememberedAccount(newUser);
      }
      closeAuthModal();
      return { success: true };
    },
    [usersRepository, closeAuthModal]
  );

  const logout = useCallback(() => {
    setUser(null);
    closeAuthModal();
  }, [closeAuthModal]);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      setUsersRepository((all) => all.map((u) => (u.id === prev.id ? { ...u, ...updated } : u)));
      return updated;
    });
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const findOrder = useCallback(
    (orderNumber: string) => {
      const cleanQuery = orderNumber.trim().toUpperCase();
      return orders.find(
        (o) =>
          o.orderNumber.toUpperCase() === cleanQuery ||
          o.orderNumber.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
      );
    },
    [orders]
  );

  // Authenticated user's private orders
  const userOrders = user
    ? orders.filter(
        (o) =>
          o.email?.toLowerCase() === user.email.toLowerCase() ||
          o.customerName.toLowerCase() === user.name.toLowerCase()
      )
    : [];

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        rememberedAccount,
        isAuthModalOpen,
        authModalMode,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        oneTapLogin,
        logout,
        updateProfile,
        orders: user ? (userOrders.length > 0 ? userOrders : orders) : [],
        allOrders: orders,
        addOrder,
        findOrder,
        failedAttempts,
        resetFailedAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
