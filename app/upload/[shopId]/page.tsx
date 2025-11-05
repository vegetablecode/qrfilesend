'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Shop } from '@/lib/types';
import Button from '@/components/Button';
import Card from '@/components/Card';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const params = useParams();
  const shopId = params.shopId as string;
  
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopDoc = await getDoc(doc(db, 'shops', shopId));
        if (shopDoc.exists()) {
          setShop({
            id: shopDoc.id,
            ...shopDoc.data(),
            createdAt: shopDoc.data().createdAt?.toDate() || new Date(),
          } as Shop);
        }
      } catch (error) {
        console.error(error);
        toast.error('Shop not found');
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const lastFourDigits = timestamp.toString().slice(-4);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${lastFourDigits}${random}`;
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const orderNum = generateOrderNumber();
      const uploadedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `uploads/${shopId}/${orderNum}/${file.name}`);
        
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        uploadedFiles.push({
          id: `${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: downloadURL,
          path: storageRef.fullPath,
        });

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // Create order in Firestore
      await addDoc(collection(db, 'orders'), {
        shopId,
        orderNumber: orderNum,
        files: uploadedFiles,
        status: 'pending',
        createdAt: Timestamp.now(),
      });

      setOrderNumber(orderNum);
      toast.success('Files uploaded successfully! 🎉');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-3xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Not Found</h1>
          <p className="text-gray-600">This QR code may be invalid or expired.</p>
        </Card>
      </div>
    );
  }

  if (orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-50 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Successful!</h1>
            <p className="text-gray-600 mb-6">Your files have been uploaded to {shop.name}</p>
            
            <div className="bg-orange-50 rounded-2xl p-6 mb-6">
              <p className="text-sm text-orange-700 font-medium mb-2">Your Order Number</p>
              <p className="text-3xl font-bold text-orange">{orderNumber}</p>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Please save this number or take a screenshot. You can use it to track your order.
            </p>
            
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                setFiles([]);
                setOrderNumber(null);
              }}
            >
              Upload More Files
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-orange to-orange-dark rounded-3xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Files</h1>
          <p className="text-xl text-gray-600">to {shop.name}</p>
        </motion.div>

        <Card>
          <div className="mb-6">
            <label className="block">
              <div className="border-3 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-orange hover:bg-orange-50/50 transition-all cursor-pointer">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Click to select files
                </p>
                <p className="text-sm text-gray-500">
                  or drag and drop them here
                </p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              />
            </label>
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 mb-6"
              >
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl"
                  >
                    <svg className="w-6 h-6 text-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {uploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm font-medium text-orange">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-gradient-to-r from-orange to-orange-light"
                />
              </div>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            isLoading={uploading}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} ${files.length === 1 ? 'File' : 'Files'}`}
          </Button>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your files will be securely uploaded and the shop owner will be notified.
        </p>
      </div>
    </div>
  );
}
