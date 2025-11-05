'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  doc,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Shop, Order } from '@/lib/types';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showNewShopModal, setShowNewShopModal] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [loading, setLoading] = useState(false);
  const [mainTab, setMainTab] = useState<'shops' | 'uploads'>('shops');

  // Sync tab with URL
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === 'uploads') {
      setMainTab('uploads');
    } else if (hash === 'shops') {
      setMainTab('shops');
    }
  }, []);

  const handleTabChange = (tab: 'shops' | 'uploads') => {
    setMainTab(tab);
    window.history.pushState(null, '', `#${tab}`);
  };
  const [orderTab, setOrderTab] = useState<'pending' | 'archived'>('pending');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Fetch shops
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'shops'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shopsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Shop[];
      setShops(shopsData);
      
      if (shopsData.length > 0 && !selectedShop) {
        setSelectedShop(shopsData[0]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch all orders for all shops
  useEffect(() => {
    if (!user || shops.length === 0) return;

    const shopIds = shops.map(s => s.id);
    const q = query(
      collection(db, 'orders'),
      where('shopId', 'in', shopIds),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            completedAt: data.completedAt?.toDate(),
          };
        })
        .filter((order: any) => !order.deleted) as Order[];
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [user, shops]);

  const handleCreateShop = async () => {
    if (!newShopName.trim()) {
      toast.error('Please enter a shop name');
      return;
    }

    setLoading(true);
    try {
      const shopRef = await addDoc(collection(db, 'shops'), {
        name: newShopName,
        ownerId: user?.uid,
        createdAt: Timestamp.now(),
      });

      // Generate QR code
      const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/upload/${shopRef.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(uploadUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#ff6b35',
          light: '#ffffff',
        },
      });

      await updateDoc(doc(db, 'shops', shopRef.id), {
        qrCodeUrl: qrCodeDataUrl,
      });

      toast.success('Shop created! 🎉');
      setNewShopName('');
      setShowNewShopModal(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create shop');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completedAt = Timestamp.now();
      }
      
      await updateDoc(doc(db, 'orders', orderId), updateData);
      toast.success(status === 'completed' ? 'Order completed! ✓' : 'Status updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) {
      return;
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'archived'
      });
      toast.success('Order deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete order');
    }
  };

  const handleClearArchived = async () => {
    const archivedCount = orders.filter(o => o.status === 'archived' && (!selectedShop || o.shopId === selectedShop.id)).length;
    
    if (archivedCount === 0) {
      toast.error('No archived orders to clear');
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete ${archivedCount} archived order(s)? This cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const ordersToDelete = orders.filter(o => 
        o.status === 'archived' && (!selectedShop || o.shopId === selectedShop.id)
      );

      // Delete orders in batches
      const deletePromises = ordersToDelete.map(order => 
        updateDoc(doc(db, 'orders', order.id), { deleted: true })
      );

      await Promise.all(deletePromises);
      toast.success(`Cleared ${archivedCount} archived order(s)`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to clear archived orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = (shop: Shop) => {
    if (!shop.qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `${shop.name}-qr-code.png`;
    link.href = shop.qrCodeUrl;
    link.click();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign out');
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
  const archivedOrders = orders.filter(o => o.status === 'completed' || o.status === 'archived');
  const filteredOrders = selectedShop 
    ? orders.filter(o => o.shopId === selectedShop.id)
    : orders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Modern Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="QR File Send" className="h-10 w-auto" />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => handleTabChange('shops')}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  mainTab === 'shops'
                    ? 'bg-orange text-white shadow-lg shadow-orange/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>🏪</span>
                <span>Shops</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  mainTab === 'shops' ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {shops.length}
                </span>
              </button>
              <button
                onClick={() => handleTabChange('uploads')}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  mainTab === 'uploads'
                    ? 'bg-orange text-white shadow-lg shadow-orange/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>📤</span>
                <span>Uploads</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  mainTab === 'uploads' ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {orders.length}
                </span>
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.email?.[0].toUpperCase() || '👤'}
                </div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-purple-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user?.email?.[0].toUpperCase() || '👤'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {user?.displayName || 'User'}
                            </p>
                            <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors group"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2 mt-3">
            <button
              onClick={() => handleTabChange('shops')}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                mainTab === 'shops'
                  ? 'bg-orange text-white shadow-lg shadow-orange/30'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>🏪</span>
              <span>Shops</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                mainTab === 'shops' ? 'bg-white/20' : 'bg-gray-300'
              }`}>
                {shops.length}
              </span>
            </button>
            <button
              onClick={() => handleTabChange('uploads')}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                mainTab === 'uploads'
                  ? 'bg-orange text-white shadow-lg shadow-orange/30'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>📤</span>
              <span>Uploads</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                mainTab === 'uploads' ? 'bg-white/20' : 'bg-gray-300'
              }`}>
                {orders.length}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Shops Tab */}
        {mainTab === 'shops' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">🏪 Your Shops</h2>
                <p className="text-gray-600">Manage your print shops and generate QR codes</p>
              </div>
              <Button onClick={() => setShowNewShopModal(true)} className="shadow-lg shadow-orange/30">
                <span className="mr-2">✨</span>
                Add Shop
              </Button>
            </div>

            {shops.length === 0 ? (
              <Card className="text-center py-16 bg-gradient-to-br from-orange-50 to-purple-50 border-2 border-dashed border-orange-200">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No shops yet</h3>
                <p className="text-gray-600 mb-8 text-lg">Create your first shop to start receiving file uploads</p>
                <Button onClick={() => setShowNewShopModal(true)} className="shadow-lg shadow-orange/30">
                  <span className="mr-2">✨</span>
                  Create First Shop
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((shop) => (
                  <motion.div
                    key={shop.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🏪</span>
                            <h3 className="font-bold text-xl text-gray-900">{shop.name}</h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>📊</span>
                            <span className="font-medium">
                              {orders.filter(o => o.shopId === shop.id && (o.status === 'pending' || o.status === 'processing')).length}
                            </span>
                            <span>active orders</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {shop.qrCodeUrl && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/qr-designer/${shop.id}`);
                                }}
                                className="hover:bg-purple-100"
                                title="Design printable QR"
                              >
                                <span className="text-lg">🎨</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadQR(shop);
                                }}
                                className="hover:bg-orange-100"
                                title="Download QR code"
                              >
                                <span className="text-lg">⬇️</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      {shop.qrCodeUrl && (
                        <div className="bg-white p-4 rounded-xl border-2 border-orange-100 shadow-inner">
                          <img src={shop.qrCodeUrl} alt={`${shop.name} QR Code`} className="w-full" />
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Uploads Tab - Kanban View */}
        {mainTab === 'uploads' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">📤 File Uploads</h2>
              <p className="text-gray-600">Manage customer uploads across all your shops</p>
            </div>

            {/* Shop Filter */}
            {shops.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">🏪 Filter by Shop</label>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setSelectedShop(null)}
                    className={`px-6 py-3.5 rounded-2xl font-semibold transition-all shadow-md text-base ${
                      !selectedShop
                        ? 'bg-orange text-white shadow-lg shadow-orange/40 scale-105 ring-2 ring-orange/50'
                        : 'bg-white border-2 border-gray-300 text-gray-900 hover:border-orange hover:shadow-lg'
                    }`}
                  >
                    <span className="mr-2 text-xl">🌐</span>
                    <span>All Shops</span>
                    <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-bold ${
                      !selectedShop ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {orders.length}
                    </span>
                  </button>
                  {shops.map((shop) => {
                    const shopOrders = orders.filter(o => o.shopId === shop.id);
                    return (
                      <button
                        key={shop.id}
                        onClick={() => setSelectedShop(shop)}
                        className={`px-6 py-3.5 rounded-2xl font-semibold transition-all shadow-md text-base ${
                          selectedShop?.id === shop.id
                            ? 'bg-orange text-white shadow-lg shadow-orange/40 scale-105 ring-2 ring-orange/50'
                            : 'bg-white border-2 border-gray-300 text-gray-900 hover:border-orange hover:shadow-lg'
                        }`}
                      >
                        <span className="mr-2 text-xl">🏪</span>
                        <span>{shop.name}</span>
                        <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-bold ${
                          selectedShop?.id === shop.id ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {shopOrders.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pending Column */}
              <KanbanColumn
                title="⏰ Pending"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="yellow"
                orders={orders.filter(o => o.status === 'pending' && (!selectedShop || o.shopId === selectedShop.id))}
                shops={shops}
                onUpdateStatus={handleUpdateOrderStatus}
                onDeleteOrder={handleDeleteOrder}
              />

              {/* Processing Column */}
              <KanbanColumn
                title="⚡ Processing"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                color="blue"
                orders={orders.filter(o => o.status === 'processing' && (!selectedShop || o.shopId === selectedShop.id))}
                shops={shops}
                onUpdateStatus={handleUpdateOrderStatus}
                onDeleteOrder={handleDeleteOrder}
              />

              {/* Completed Column */}
              <KanbanColumn
                title="✅ Completed"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="green"
                orders={orders.filter(o => o.status === 'completed' && (!selectedShop || o.shopId === selectedShop.id))}
                shops={shops}
                onUpdateStatus={handleUpdateOrderStatus}
                onDeleteOrder={handleDeleteOrder}
              />

              {/* Archived Column */}
              <KanbanColumn
                title="📦 Archived"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                }
                color="gray"
                orders={orders.filter(o => o.status === 'archived' && (!selectedShop || o.shopId === selectedShop.id))}
                shops={shops}
                onUpdateStatus={handleUpdateOrderStatus}
                onDeleteOrder={handleDeleteOrder}
                onClearAll={handleClearArchived}
                isLoading={loading}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* New Shop Modal */}
      <AnimatePresence>
        {showNewShopModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewShopModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">🏪</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Shop</h3>
                  <p className="text-gray-600">Add a new shop and generate a QR code</p>
                </div>
                <input
                  type="text"
                  placeholder="Shop name (e.g., Downtown Print Shop)"
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none focus:ring-4 focus:ring-orange/20 mb-4 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateShop()}
                  autoFocus
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowNewShopModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 shadow-lg shadow-orange/30"
                    onClick={handleCreateShop}
                    isLoading={loading}
                  >
                    <span className="mr-2">✨</span>
                    Create Shop
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KanbanColumn({
  title,
  icon,
  color,
  orders,
  shops,
  onUpdateStatus,
  onDeleteOrder,
  onClearAll,
  isLoading,
}: {
  title: string;
  icon: React.ReactNode;
  color: 'yellow' | 'blue' | 'green' | 'gray';
  orders: Order[];
  shops: Shop[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder?: (id: string) => void;
  onClearAll?: () => void;
  isLoading?: boolean;
}) {
  const colorStyles = {
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      border: 'border-yellow-300',
      text: 'text-yellow-800',
      badge: 'bg-yellow-200 text-yellow-900',
      emptyBg: 'bg-yellow-50/50',
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      badge: 'bg-blue-200 text-blue-900',
      emptyBg: 'bg-blue-50/50',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-300',
      text: 'text-green-800',
      badge: 'bg-green-200 text-green-900',
      emptyBg: 'bg-green-50/50',
    },
    gray: {
      bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
      border: 'border-gray-300',
      text: 'text-gray-800',
      badge: 'bg-gray-200 text-gray-900',
      emptyBg: 'bg-gray-50/50',
    },
  };

  const styles = colorStyles[color];

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`${styles.bg} ${styles.border} border-2 rounded-2xl p-4 mb-3 shadow-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-lg ${styles.text}`}>{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${styles.badge} px-3 py-1.5 rounded-full text-sm font-bold shadow-sm`}>
              {orders.length}
            </span>
            {onClearAll && orders.length > 0 && (
              <button
                onClick={onClearAll}
                disabled={isLoading}
                className="p-2 text-red-500 hover:bg-red-50 disabled:opacity-50 rounded-xl transition-colors"
                title="Clear all archived orders"
              >
                <span className="text-lg">🗑️</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 space-y-3 min-h-[200px]">
        <AnimatePresence>
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${styles.emptyBg} ${styles.border} border-2 border-dashed rounded-2xl p-8 text-center`}
            >
              <div className="text-4xl mb-2 opacity-50">📭</div>
              <p className={`text-sm ${styles.text} opacity-70 font-medium`}>No orders</p>
            </motion.div>
          ) : (
            orders.map((order) => {
              const orderShop = shops.find(s => s.id === order.shopId);
              return (
                <KanbanCard
                  key={order.id}
                  order={order}
                  shop={orderShop}
                  onUpdateStatus={onUpdateStatus}
                  onDeleteOrder={onDeleteOrder}
                />
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function KanbanCard({
  order,
  shop,
  onUpdateStatus,
  onDeleteOrder,
}: {
  order: Order;
  shop?: Shop;
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder?: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">📋</span>
            <h4 className="font-bold text-gray-900 text-sm">
              #{order.orderNumber}
            </h4>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>🕐</span>
            <span>{formatDistanceToNow(order.createdAt, { addSuffix: true })}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {shop && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-orange-50 to-purple-50 text-orange-700 border border-orange-200">
              🏪 {shop.name}
            </span>
          )}
          {onDeleteOrder && (
            <button
              onClick={() => onDeleteOrder(order.id)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete order"
            >
              <span className="text-base">🗑️</span>
            </button>
          )}
        </div>
      </div>

      {/* Files */}
      <div className="space-y-2 mb-3">
        {order.files.map((file) => (
          <div key={file.id} className="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg border border-gray-100">
            <span className="text-lg flex-shrink-0">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <a
              href={file.url}
              download={file.name}
              className="p-1.5 text-orange hover:bg-orange-100 rounded-lg transition-colors flex-shrink-0"
              title="Download file"
            >
              <span className="text-base">⬇️</span>
            </a>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {order.status === 'pending' && (
        <button
          onClick={() => onUpdateStatus(order.id, 'processing')}
          className="w-full px-3 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span>⚡</span>
          <span>Start Processing</span>
        </button>
      )}
      {order.status === 'processing' && (
        <button
          onClick={() => onUpdateStatus(order.id, 'completed')}
          className="w-full px-3 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span>✅</span>
          <span>Mark Completed</span>
        </button>
      )}
      {order.status === 'completed' && (
        <button
          onClick={() => onUpdateStatus(order.id, 'archived')}
          className="w-full px-3 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span>📦</span>
          <span>Archive</span>
        </button>
      )}
    </motion.div>
  );
}

function OrderCard({ 
  order,
  shop,
  onUpdateStatus 
}: { 
  order: Order;
  shop?: Shop;
  onUpdateStatus: (id: string, status: Order['status']) => void;
}) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                {order.status}
              </span>
              {shop && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {shop.name}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {formatDistanceToNow(order.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {order.files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <a
                href={file.url}
                download={file.name}
                className="text-orange hover:text-orange-dark"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {order.status !== 'archived' && order.status !== 'completed' && (
          <div className="flex gap-2">
            {order.status === 'pending' && (
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => onUpdateStatus(order.id, 'processing')}
              >
                Start Processing
              </Button>
            )}
            {order.status === 'processing' && (
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => onUpdateStatus(order.id, 'completed')}
              >
                Mark as Completed
              </Button>
            )}
          </div>
        )}
        
        {order.status === 'completed' && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => onUpdateStatus(order.id, 'archived')}
          >
            Archive
          </Button>
        )}
      </Card>
    </motion.div>
  );
}
