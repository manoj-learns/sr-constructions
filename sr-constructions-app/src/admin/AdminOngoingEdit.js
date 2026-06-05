import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOngoingById, addOngoing, updateOngoing } from '../services/db';
import OngoingForm from './OngoingForm';

export default function AdminOngoingEdit() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      getOngoingById(id)
        .then((data) => { setInitial(data); setLoading(false); })
        .catch((e) => { setError('Failed to load project: ' + e.message); setLoading(false); });
    }
  }, [id, isNew]);

  const handleSave = async (data) => {
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await addOngoing(data);
      } else {
        await updateOngoing(id, data);
      }
      navigate('/admin/ongoing');
    } catch (e) {
      setError('Failed to save: ' + e.message + '. Check your Firestore rules in Firebase Console.');
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: '#888', padding: 40 }}>Loading…</p>;

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.heading}>{isNew ? 'Add Ongoing Project' : `Edit: ${initial?.name}`}</h1>
      </div>
      {error && <div style={s.error}><i className="fa fa-exclamation-triangle" style={{ marginRight: 8 }}></i>{error}</div>}
      <OngoingForm
        initial={initial || {}}
        onSave={handleSave}
        onCancel={() => navigate('/admin/ongoing')}
        saving={saving}
      />
    </div>
  );
}

const s = {
  header: { marginBottom: 24 },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#fff' },
  error: { background: 'rgba(232,118,118,.1)', border: '1px solid rgba(232,118,118,.4)', color: '#e87676', padding: '14px 20px', marginBottom: 24, fontSize: 14 },
};
