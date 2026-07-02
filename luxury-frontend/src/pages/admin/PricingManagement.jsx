import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, DollarSign, X } from 'lucide-react';

export default function PricingManagement() {
  const { pricingRules, togglePricingRule, addPricingRule, deletePricingRule } = useData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'weekend',
    multiplier: '1.2',
    description: '',
    start_date: '',
    end_date: '',
    threshold: ''
  });

  function handleOpenAdd() {
    setNewRule({
      name: '',
      type: 'weekend',
      multiplier: '1.2',
      description: '',
      start_date: '',
      end_date: '',
      threshold: ''
    });
    setIsAddOpen(true);
  }

  function handleAddSubmit(e) {
    e.preventDefault();
    if (!newRule.name || !newRule.multiplier) return;
    addPricingRule({
      name: newRule.name,
      type: newRule.type,
      multiplier: parseFloat(newRule.multiplier) || 1.0,
      description: newRule.description,
      start_date: newRule.type === 'season' ? newRule.start_date : null,
      end_date: newRule.type === 'season' ? newRule.end_date : null,
      threshold: newRule.type === 'occupancy' ? parseInt(newRule.threshold) : null
    });
    setIsAddOpen(false);
  }

  return (
    <div>
      <div className="pms-header">
        <div>
          <h1 className="pms-header-title">Pricing Rules</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
            Manage dynamic pricing rules, high-occupancy surcharges, and seasonal rate adjustments
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Rule
        </button>
      </div>

      {/* Rules Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
        {pricingRules.map(rule => (
          <div key={rule.id} style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            border: `1px solid ${rule.active ? 'var(--color-gold)' : 'var(--color-gray-200)'}`,
            padding: 'var(--space-6)',
            opacity: rule.active ? 1 : 0.6,
            transition: 'all var(--transition-base)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-navy)' }}>
                  {rule.name}
                </h3>
                <span className={`badge ${rule.type === 'weekend' ? 'badge-info' : rule.type === 'season' ? 'badge-gold' : 'badge-warning'}`} style={{ marginTop: 'var(--space-1)' }}>
                  {rule.type}
                </span>
              </div>
              <button
                onClick={() => togglePricingRule(rule.id)}
                style={{ color: rule.active ? 'var(--color-success)' : 'var(--color-gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}
                title={rule.active ? 'Disable pricing rule' : 'Enable pricing rule'}
              >
                {rule.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginBottom: 'var(--space-4)' }}>
              {rule.description}
            </p>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: 'var(--space-3)', background: 'var(--color-cream)',
              borderRadius: 'var(--radius-md)'
            }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brown)' }}>Rate Multiplier</span>
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)',
                fontWeight: 700, color: rule.multiplier > 1 ? '#dc2626' : rule.multiplier < 1 ? '#16a34a' : 'var(--color-navy)'
              }}>
                {rule.multiplier > 1 ? '+' : ''}{Math.round((rule.multiplier - 1) * 100)}%
              </span>
            </div>

            {(rule.start_date || rule.threshold) && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginTop: 'var(--space-3)' }}>
                {rule.start_date && `Period: ${rule.start_date} to ${rule.end_date}`}
                {rule.threshold && `Threshold: ${rule.threshold}% occupancy`}
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-gray-100)', paddingTop: '12px' }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, color: 'var(--color-error)' }} onClick={() => deletePricingRule(rule.id)}><Trash2 size={14} /> Remove Rule</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Rule Modal Overlay */}
      {isAddOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)',
          zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="animate-fade-in-up" style={{
            background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '400px',
            boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--color-gray-200)', overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 24px', borderBottom: '1px solid var(--color-gray-200)', background: 'var(--color-gray-50)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-navy)' }}>
                📈 Add Pricing Rule
              </h3>
              <button onClick={() => setIsAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-500)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Rule Name *</label>
                  <input
                    className="form-input"
                    value={newRule.name}
                    onChange={e => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Monsoon Discount"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Trigger Type *</label>
                  <select
                    className="form-select"
                    value={newRule.type}
                    onChange={e => setNewRule(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="weekend">Weekend Rate</option>
                    <option value="season">Peak/Off Season</option>
                    <option value="occupancy">Occupancy Threshold</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Multiplier * (e.g. 1.25 for +25%, 0.8 for -20%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={newRule.multiplier}
                    onChange={e => setNewRule(prev => ({ ...prev, multiplier: e.target.value }))}
                    placeholder="e.g. 1.20"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <input
                    className="form-input"
                    value={newRule.description}
                    onChange={e => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g. 20% discount during monsoon season"
                    required
                  />
                </div>

                {newRule.type === 'season' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={newRule.start_date}
                        onChange={e => setNewRule(prev => ({ ...prev, start_date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={newRule.end_date}
                        onChange={e => setNewRule(prev => ({ ...prev, end_date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                )}

                {newRule.type === 'occupancy' && (
                  <div className="form-group">
                    <label className="form-label">Occupancy Percentage Threshold *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newRule.threshold}
                      onChange={e => setNewRule(prev => ({ ...prev, threshold: e.target.value }))}
                      placeholder="e.g. 80"
                      required
                    />
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px',
                paddingTop: '16px', borderTop: '1px solid var(--color-gray-200)'
              }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
