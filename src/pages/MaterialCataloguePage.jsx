import React, { useState, useMemo } from 'react';
import { Search, Filter, Scale, Check, BookOpen, Layers } from 'lucide-react';
import MaterialCard from '../components/catalogue/MaterialCard.jsx';
import MaterialDetailModal from '../components/catalogue/MaterialDetailModal.jsx';
import ProductCompareModal from '../components/catalogue/ProductCompareModal.jsx';
import { initialCategories, initialMaterials } from '../../server/src/seedData.js';
import { useProject } from '../context/ProjectContext.jsx';

export default function MaterialCataloguePage() {
  const { materials, selectMaterial } = useProject();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [activeMaterialDetail, setActiveMaterialDetail] = useState(null);
  const [comparedProducts, setComparedProducts] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Filter & Sort Logic
  const selectedCount = Object.keys(materials).length;

  const filteredMaterials = useMemo(() => {
    return initialMaterials.filter((m) => {
      if (activeCategory === 'selected') {
        const isSelected = Object.values(materials).includes(m.name);
        if (!isSelected) return false;
      } else if (activeCategory !== 'all' && m.category_id !== activeCategory) {
        return false;
      }
      if (selectedQuality !== 'all' && m.quality_grade !== selectedQuality) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesBrand = m.brand.toLowerCase().includes(q);
        const matchesDesc = (m.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOrder === 'price_asc') return a.price_inr - b.price_inr;
      if (sortOrder === 'price_desc') return b.price_inr - a.price_inr;
      if (sortOrder === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [activeCategory, searchQuery, selectedQuality, sortOrder, materials]);

  const handleToggleCompare = (material) => {
    setComparedProducts((prev) => {
      const exists = prev.find((p) => p.name === material.name);
      if (exists) {
        return prev.filter((p) => p.name !== material.name);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 products simultaneously.');
          return prev;
        }
        return [...prev, material];
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0E8DC] text-[#52634A] rounded-full text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" /> Comprehensive Modular Material Library
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#292929]">
            Materials & Accessories Catalogue
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6862] max-w-xl">
            Explore certified architectural materials with real Indian market rates in INR, manufacturer warranties, and durability grades.
          </p>
        </div>

        {/* Floating Compare Counter Pill */}
        {comparedProducts.length > 0 && (
          <button
            onClick={() => setCompareModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#B69A65] hover:bg-[#9B804E] text-white rounded-2xl text-xs font-bold shadow-lg transition-all animate-bounce"
          >
            <Scale className="w-4 h-4" /> Compare Selected ({comparedProducts.length})
          </button>
        )}
      </div>

      {/* 10 Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-[#52634A] text-white shadow-md'
              : 'bg-white text-[#292929] hover:bg-[#F8F5EF] border border-[#D9C8AE]/50'
          }`}
        >
          All Categories ({initialMaterials.length})
        </button>
        <button
          onClick={() => setActiveCategory('selected')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'selected'
              ? 'bg-[#B69A65] text-white shadow-md'
              : 'bg-white text-[#52634A] hover:bg-[#F8F5EF] border border-[#52634A]/40'
          }`}
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" /> Selected in Project ({selectedCount})
        </button>
        {initialCategories.map((cat) => {
          const count = initialMaterials.filter((m) => m.category_id === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#52634A] text-white shadow-md'
                  : 'bg-white text-[#292929] hover:bg-[#F8F5EF] border border-[#D9C8AE]/50'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D9C8AE]/50 card-shadow flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#6B6862] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by material name, brand (Hettich, Blum, Bosch...), or finish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl text-xs text-[#292929] placeholder-gray-400 focus:outline-none focus:border-[#52634A]"
          />
        </div>

        {/* Quality Filter & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6B6862]">Quality:</span>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#292929] focus:outline-none"
            >
              <option value="all">All Grades</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6B6862]">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#292929] focus:outline-none"
            >
              <option value="default">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-[#D9C8AE]/50 space-y-3">
          <h4 className="font-serif font-bold text-xl text-[#292929]">No materials matched your search</h4>
          <p className="text-xs text-[#6B6862]">Try clearing filters or searching for another term like "plywood", "quartz", or "acrylic".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setSelectedQuality('all');
            }}
            className="px-4 py-2 bg-[#52634A] text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.name}
              material={material}
              isSelected={materials[material.category_id] === material.name}
              onSelect={() => selectMaterial(material.category_id, material.name)}
              onViewDetails={(m) => setActiveMaterialDetail(m)}
              onToggleCompare={handleToggleCompare}
              isCompared={Boolean(comparedProducts.find((p) => p.name === material.name))}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <MaterialDetailModal
        material={activeMaterialDetail}
        isOpen={Boolean(activeMaterialDetail)}
        onClose={() => setActiveMaterialDetail(null)}
      />

      {/* Product Compare Modal */}
      <ProductCompareModal
        products={comparedProducts}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onClear={() => {
          setComparedProducts([]);
          setCompareModalOpen(false);
        }}
      />
    </div>
  );
}
