import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, Plus, Minus, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ProductSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (product: Product, size: string, color: string, quantity: number) => void;
}

export const ProductSpecsModal: React.FC<ProductSpecsModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
}) => {
  const { isDark } = useTheme();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0]?.name || 'Onyx Black');
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const currentVariantImage =
    product.colors.find((c) => c.name.toLowerCase() === selectedColor.toLowerCase())?.image ||
    product.images[0];

  const handleConfirm = () => {
    onConfirm(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md my-auto rounded-3xl p-5 sm:p-6 shadow-2xl border transition-all z-10 ${
          isDark
            ? 'bg-[#0f1926] border-[#1e2e42] text-white shadow-black/80'
            : 'bg-white border-[#ede4d8] text-gray-900 shadow-xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 mb-4 border-b border-gray-200/40 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 p-1 overflow-hidden shrink-0 border border-gray-200/50">
              <img
                src={currentVariantImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#c85028]">
                {product.categoryLabel}
              </span>
              <h3 className="text-sm font-black tracking-tight line-clamp-1">{product.name}</h3>
              <p className="text-sm font-black text-[#c85028]">
                KSh {product.price.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-gray-400">Select Fit Size</label>
            <span className="text-[11px] font-bold text-[#c85028]">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`w-10 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedSize === sz
                    ? 'bg-[#c85028] text-white border-[#c85028] shadow-sm'
                    : isDark
                    ? 'border-gray-700 bg-gray-800/40 text-gray-300 hover:border-gray-500'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-gray-400">Select Colour</label>
            <span className="text-[11px] font-bold text-gray-300">{selectedColor}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedColor === c.name
                    ? 'border-[#c85028] bg-[#c85028]/15 text-[#c85028]'
                    : isDark
                    ? 'border-gray-700 bg-gray-800/40 text-gray-400 hover:border-gray-500'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center justify-between p-3 rounded-2xl border border-gray-200/50 dark:border-gray-800 mb-5 text-xs">
          <span className="font-bold text-gray-400">Order Quantity</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold hover:bg-[#c85028] hover:text-white transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-black text-sm w-5 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
              className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold hover:bg-[#c85028] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Add to Bag Action */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9532f] to-[#b3441e] hover:brightness-110 text-white font-black uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            Add to Bag • KSh {(product.price * quantity).toLocaleString()}
          </span>
        </button>
      </div>
    </div>
  );
};
