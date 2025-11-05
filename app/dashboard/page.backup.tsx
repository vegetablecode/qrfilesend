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
  const [orderTab, setOrderTab] = useState<'pending' | 'archived'>('pending');

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

  // Fetch orders for selected shop
  useEffect(() => {
    if (!selectedShop) return;

    const q = query(
      collection(db, 'orders'),
      where('shopId', '==', selectedShop.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Order[];
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [selectedShop]);

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
  const allOrders = orders;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange to-orange-dark rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">{user?.displayName || user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Tab Navigation */}
        <div className="flex items-center gap-3 mb-8 bg-white rounded-3xl p-2 shadow-lg border border-gray-100 w-fit">
          <button
            onClick={() => setMainTab('shops')}
            className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
              mainTab === 'shops'
                ? 'bg-orange text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Shops</span>
              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
                {shops.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setMainTab('uploads')}
            className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
              mainTab === 'uploads'
                ? 'bg-orange text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Uploads</span>
              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
                {allOrders.length}
              </span>
            </div>
          </button>
        </div>

        {/* Shops Tab */}
        {mainTab === 'shops' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Your Shops</h2>
                <Button onClick={() => setShowNewShopModal(true)}>
                  + Add Shop
                </Button>
              </div>

          {shops.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-20 h-20 bg-orange-50 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No shops yet</h3>
              <p className="text-gray-600 mb-6">Create your first shop to get started</p>
              <Button onClick={() => setShowNewShopModal(true)}>
                Create First Shop
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shops.map((shop) => (
                <Card
                  key={shop.id}
                  hover
                  className={`cursor-pointer ${selectedShop?.id === shop.id ? 'ring-2 ring-orange' : ''}`}
                  onClick={() => setSelectedShop(shop)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{shop.name}</h3>
                      <p className="text-sm text-gray-500">
                        {orders.filter(o => o.shopId === shop.id && (o.status === 'pending' || o.status === 'processing')).length} active orders
                      </p>
                    </div>
                    {shop.qrCodeUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadQR(shop);
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </Button>
                    )}
                  </div>
                  {shop.qrCodeUrl && (
                    <div className="bg-white p-4 rounded-2xl border border-gray-100">
                      <img src={shop.qrCodeUrl} alt={`${shop.name} QR Code`} className="w-full" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
            </div>
          </motion.div>
        )}

        {/* Uploads Tab */}
        {mainTab === 'uploads' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Shop Filter */}
            {shops.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Shop</label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedShop(null)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      !selectedShop
                        ? 'bg-orange text-white shadow-md'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange'
                    }`}
                  >
                    All Shops ({allOrders.length})
                  </button>
                  {shops.map((shop) => {
                    const shopOrders = orders.filter(o => o.shopId === shop.id);
                    return (
                      <button
                        key={shop.id}
                        onClick={() => setSelectedShop(shop)}
                        className={`px-4 py-2 rounded-full font-medium transition-all ${
                          selectedShop?.id === shop.id
                            ? 'bg-orange text-white shadow-md'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange'
                        }`}
                      >
                        {shop.name} ({shopOrders.length})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Status Tabs */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setOrderTab('pending')}
                className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                  orderTab === 'pending'
                    ? 'bg-orange text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange'
                }`}
              >
                Active ({pendingOrders.filter(o => !selectedShop || o.shopId === selectedShop.id).length})
              </button>
              <button
                onClick={() => setOrderTab('archived')}
                className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                  orderTab === 'archived'
                    ? 'bg-orange text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange'
                }`}
              >
                Archived ({archivedOrders.filter(o => !selectedShop || o.shopId === selectedShop.id).length})
              </button>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {(orderTab === 'pending' ? pendingOrders : archivedOrders)
                  .filter(o => !selectedShop || o.shopId === selectedShop.id)
                  .map((order) => {
                    const orderShop = shops.find(s => s.id === order.shopId);
                    return (
                      <OrderCard
                        key={order.id}
                        order={order}
                        shop={orderShop}
                        onUpdateStatus={handleUpdateOrderStatus}
                      />
                    );
                  })}
              </AnimatePresence>

              {(orderTab === 'pending' ? pendingOrders : archivedOrders)
                .filter(o => !selectedShop || o.shopId === selectedShop.id).length === 0 && (
                <Card className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">
                    {orderTab === 'pending' 
                      ? 'New uploads will appear here automatically' 
                      : 'Completed orders will be shown here'}
                  </p>
                </Card>
              )}
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewShopModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Create New Shop</h3>
                <input
                  type="text"
                  placeholder="Shop name"
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20 mb-4"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateShop()}
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
                    className="flex-1"
                    onClick={handleCreateShop}
                    isLoading={loading}
                  >
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
