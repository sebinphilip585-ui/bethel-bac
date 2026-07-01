import { useData } from '../../contexts/DataContext';
import { X, Printer, Download } from 'lucide-react';

export default function InvoiceModal({ bookingId, onClose }) {
  const { generateInvoice } = useData();
  const invoice = generateInvoice(bookingId);

  if (!invoice) return null;

  function handlePrint() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; padding: 40px; color: #1c1917; max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #c9a96e; padding-bottom: 20px; margin-bottom: 30px; }
        .hotel-name { font-family: Georgia, serif; font-size: 28px; color: #0a1628; font-weight: 700; }
        .hotel-sub { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #c9a96e; }
        .invoice-title { font-size: 24px; font-weight: 700; color: #0a1628; text-align: right; }
        .invoice-num { font-size: 14px; color: #78716c; text-align: right; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #c9a96e; font-weight: 600; margin-bottom: 8px; }
        .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; border-bottom: 1px solid #f5f5f4; }
        .row-label { color: #78716c; }
        .row-value { font-weight: 500; color: #1c1917; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #f5f0e8; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #4a3728; }
        td { padding: 10px; border-bottom: 1px solid #e7e5e4; font-size: 14px; }
        .total-row { border-top: 2px solid #c9a96e; }
        .total-row td { font-weight: 700; font-size: 16px; color: #0a1628; padding-top: 12px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e7e5e4; font-size: 12px; color: #a8a29e; text-align: center; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-pending { background: #fffbeb; color: #92400e; }
        .badge-paid { background: #f0fdf4; color: #166534; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header">
        <div>
          <div class="hotel-name">Bethel Meadows</div>
          <div class="hotel-sub">Hotel & Suites</div>
          <div style="margin-top:10px;font-size:13px;color:#78716c;">
            ${invoice.hotel.address}<br/>
            ${invoice.hotel.phone} | ${invoice.hotel.email}
          </div>
        </div>
        <div>
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-num">${invoice.invoiceNumber}</div>
          <div style="font-size:13px;color:#78716c;text-align:right;margin-top:8px;">Date: ${invoice.date}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Guest Details</div>
        <div class="row"><span class="row-label">Name</span><span class="row-value">${invoice.guest.name}</span></div>
        <div class="row"><span class="row-label">Email</span><span class="row-value">${invoice.guest.email}</span></div>
        <div class="row"><span class="row-label">Phone</span><span class="row-value">${invoice.guest.phone}</span></div>
        <div class="row"><span class="row-label">ID</span><span class="row-value">${invoice.guest.id_type || ''} - ${invoice.guest.id_number || 'N/A'}</span></div>
      </div>

      <div class="section">
        <div class="section-title">Booking Details</div>
        <div class="row"><span class="row-label">Booking ID</span><span class="row-value">${invoice.booking.id}</span></div>
        <div class="row"><span class="row-label">Room</span><span class="row-value">${invoice.booking.roomType} — Room ${invoice.booking.roomNumber}</span></div>
        <div class="row"><span class="row-label">Check-in</span><span class="row-value">${invoice.booking.checkIn}</span></div>
        <div class="row"><span class="row-label">Check-out</span><span class="row-value">${invoice.booking.checkOut}</span></div>
        <div class="row"><span class="row-label">Duration</span><span class="row-value">${invoice.booking.nights} night(s)</span></div>
        <div class="row"><span class="row-label">Guests</span><span class="row-value">${invoice.booking.guests}</span></div>
      </div>

      <table>
        <thead><tr><th>Description</th><th>Rate</th><th>Nights</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>
          <tr>
            <td>${invoice.booking.roomType} — Room ${invoice.booking.roomNumber}</td>
            <td>₹${invoice.booking.pricePerNight?.toLocaleString()}</td>
            <td>${invoice.booking.nights}</td>
            <td style="text-align:right">₹${invoice.subtotal?.toLocaleString()}</td>
          </tr>
          <tr><td colspan="3" style="text-align:right;color:#78716c">Subtotal</td><td style="text-align:right">₹${invoice.subtotal?.toLocaleString()}</td></tr>
          <tr><td colspan="3" style="text-align:right;color:#78716c">GST (12%)</td><td style="text-align:right">₹${invoice.tax?.toLocaleString()}</td></tr>
          <tr class="total-row"><td colspan="3" style="text-align:right">Grand Total</td><td style="text-align:right">₹${invoice.total?.toLocaleString()}</td></tr>
        </tbody>
      </table>

      <div style="margin-top:20px;padding:15px;background:#fdfcfb;border:1px solid #e7e5e4;border-radius:6px;font-size:14px;line-height:1.6;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span><strong>Payment Status:</strong> <span class="badge ${invoice.paymentStatus === 'paid' ? 'badge-paid' : 'badge-pending'}">${invoice.paymentStatus?.toUpperCase()}</span></span>
          <span><strong>Amount Paid:</strong> ₹${invoice.amountPaid?.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span><strong>Payment Method:</strong> ${invoice.paymentMethod}</span>
          <span><strong>Payment Source/Reference:</strong> ${invoice.paymentSource || 'N/A'}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:700;border-top:1px solid #e7e5e4;padding-top:6px;margin-top:6px;color:#0a1628;">
          <span>Balance Due:</span>
          <span>₹${invoice.balance?.toLocaleString()}</span>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for choosing Bethel Meadows Hotel & Suites</p>
        <p>This is a computer-generated invoice and does not require a signature.</p>
      </div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Invoice — {invoice.invoiceNumber}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Hotel Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            paddingBottom: 'var(--space-4)', borderBottom: '3px solid var(--color-gold)',
            marginBottom: 'var(--space-6)'
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-navy)' }}>
                Bethel Meadows
              </div>
              <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                Hotel & Suites
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginTop: 'var(--space-2)' }}>
                {invoice.hotel.address}<br />
                {invoice.hotel.phone} | {invoice.hotel.email}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-navy)' }}>INVOICE</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{invoice.invoiceNumber}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginTop: '4px' }}>Date: {invoice.date}</div>
            </div>
          </div>

          {/* Guest & Booking */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Guest Details
              </div>
              <div style={{ fontSize: 'var(--text-sm)', lineHeight: '1.8', color: 'var(--color-gray-600)' }}>
                <strong>{invoice.guest.name}</strong><br />
                {invoice.guest.email}<br />
                {invoice.guest.phone}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Stay Details
              </div>
              <div style={{ fontSize: 'var(--text-sm)', lineHeight: '1.8', color: 'var(--color-gray-600)' }}>
                Booking: <strong>{invoice.booking.id}</strong><br />
                {invoice.booking.roomType} — Room {invoice.booking.roomNumber}<br />
                {invoice.booking.checkIn} → {invoice.booking.checkOut} ({invoice.booking.nights} nights)
              </div>
            </div>
          </div>

          {/* Charges Table */}
          <table className="table" style={{ marginBottom: 'var(--space-4)' }}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Rate</th>
                <th>Nights</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{invoice.booking.roomType}</td>
                <td>₹{invoice.booking.pricePerNight?.toLocaleString()}</td>
                <td>{invoice.booking.nights}</td>
                <td style={{ textAlign: 'right' }}>₹{invoice.subtotal?.toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', color: 'var(--color-gray-500)' }}>Subtotal</td>
                <td style={{ textAlign: 'right' }}>₹{invoice.subtotal?.toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', color: 'var(--color-gray-500)' }}>GST (12%)</td>
                <td style={{ textAlign: 'right' }}>₹{invoice.tax?.toLocaleString()}</td>
              </tr>
              <tr style={{ borderTop: '2px solid var(--color-gold)' }}>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-navy)' }}>
                  Grand Total
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-navy)' }}>
                  ₹{invoice.total?.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Details Card */}
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--color-gray-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-gray-200)',
            fontSize: 'var(--text-sm)',
            lineHeight: '1.8'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Payment Status: <strong className={`badge ${invoice.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>{invoice.paymentStatus?.toUpperCase()}</strong></span>
              <span>Amount Paid: <strong>₹{invoice.amountPaid?.toLocaleString()}</strong></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Method: <strong>{invoice.paymentMethod}</strong></span>
              <span>Source/Ref: <strong>{invoice.paymentSource || 'N/A'}</strong></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--color-gray-200)', paddingTop: '8px', marginTop: '8px' }}>
              <span>Balance Due:</span>
              <span style={{ color: invoice.balance > 0 ? '#b91c1c' : 'var(--color-success)' }}>₹{invoice.balance?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} /> Print Invoice
          </button>
          <button onClick={onClose} className="btn btn-ghost">Close</button>
        </div>
      </div>
    </div>
  );
}
