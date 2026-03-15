import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import EquipmentCard from '../components/equipment/EquipmentCard';
import api from '../utils/api';
import './EquipmentListPage.css';

const CATEGORIES = ['Tractor', 'Harvester', 'Seeder', 'Water Pump', 'Plough', 'Thresher', 'Rotavator', 'Sprayer', 'Other'];

const EquipmentListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    district: searchParams.get('district') || '',
    state: searchParams.get('state') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const params = {};
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== '' && v !== 0) params[k] = v;
        });
        const { data } = await api.get('/equipment', { params });
        setEquipment(data.equipment);
        setTotal(data.total);
        setPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', district: '', state: '', minPrice: '', maxPrice: '', page: 1 });
  };

  const hasActiveFilters = filters.category || filters.district || filters.state || filters.minPrice || filters.maxPrice;

  return (
    <div className="equipment-list-page">
      <div className="container">
        {/* Header */}
        <div className="list-header">
          <div>
            <h1>Browse Equipment</h1>
            <p className="text-muted">{total} equipment listings available</p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
            {hasActiveFilters && <span className="filter-count">!</span>}
          </button>
        </div>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tractors, harvesters, pumps..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="form-control search-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Coimbatore"
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Tamil Nadu"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Min Price (₹/day)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Max Price (₹/day)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="5000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
            {hasActiveFilters && (
              <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                <FaTimes /> Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="spinner" />
        ) : equipment.length === 0 ? (
          <div className="empty-state">
            <FaSearch />
            <h3>No equipment found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid-3 equipment-grid">
              {equipment.map((eq) => (
                <EquipmentCard key={eq._id} equipment={eq} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                <button
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                >
                  ← Prev
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={filters.page === p ? 'active' : ''}
                    onClick={() => setFilters((f) => ({ ...f, page: p }))}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={filters.page >= pages}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EquipmentListPage;
