import React,{ useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Message from '../components/Message.jsx';
import StarRating from '../components/StarRating.jsx';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, [search, sort]);

  async function loadStores() {
    setIsLoading(true);
    try {
      const response = await api.get('/stores', { params: { search, ...sort } });
      setStores(response.data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not load stores.');
    } finally {
      setIsLoading(false);
    }
  }

  function changeSort(field) {
    setSort({
      sortBy: field,
      order: sort.sortBy === field && sort.order === 'asc' ? 'desc' : 'asc'
    });
  }

  async function submitRating(storeId, rating) {
    setMessage('');
    setError('');

    try {
      await api.post(`/stores/${storeId}/rating`, { rating: Number(rating) });
      setMessage('Rating saved.');
      loadStores();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not save rating.');
    }
  }

  return (
    <Layout title="Stores">
      <section className="store-toolbar">
        <div><p className="section-kicker">DISCOVER</p><h2>Find a store worth visiting</h2><p className="muted-text">Search local businesses and leave your honest rating.</p></div>
        <label className="search-field"><Search size={19} /><span className="sr-only">Search stores</span><input placeholder="Search by name or address" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
      </section>
      <section className="sort-bar" aria-label="Store sorting">
        <SlidersHorizontal size={17} /><span>Sort stores by</span>
        {['name', 'address', 'rating'].map((field) => <button key={field} type="button" className={sort.sortBy === field ? 'sort-pill active' : 'sort-pill'} onClick={() => changeSort(field)}>{field === 'rating' ? 'Rating' : field[0].toUpperCase() + field.slice(1)} {sort.sortBy === field ? (sort.order === 'asc' ? '↑' : '↓') : ''}</button>)}
      </section>
      <Message type="success">{message}</Message>
      <Message type="error">{error}</Message>

      <section className="store-grid">
        {isLoading ? Array.from({ length: 6 }).map((_, index) => <div className="store-card skeleton-card" key={index}><span /><span /><span /><span /></div>) : null}
        {!isLoading && stores.map((store) => (
          <article className="store-card" key={store.id}>
            <div className="store-card-top"><div className="store-avatar">{store.name.charAt(0)}</div><div><h2>{store.name}</h2><p className="store-address"><MapPin size={16} />{store.address}</p></div></div>
            <div className="rating-summary"><div><span className="rating-number">{store.overall_rating || '—'}</span><span className="rating-caption">Overall rating</span></div><StarRating value={Number(store.overall_rating)} label={`Overall rating for ${store.name}`} /></div>
            <div className="rate-store"><div><strong>Your rating</strong><p>{store.user_rating ? `${store.user_rating} out of 5` : 'Select a star to rate'}</p></div><StarRating value={store.user_rating} onChange={(rating) => submitRating(store.id, rating)} label={`Your rating for ${store.name}`} /></div>
          </article>
        ))}
        {!isLoading && stores.length === 0 ? <div className="empty-state"><Search size={28} /><h2>No stores found</h2><p>Try adjusting your search to find a store.</p></div> : null}
      </section>
    </Layout>
  );
}
