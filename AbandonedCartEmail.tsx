import { EmailWrapper } from './EmailWrapper';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

interface AbandonedCartEmailProps {
  customerName: string;
  cartItems: CartItem[];
  cartTotal: number;
  checkoutUrl: string;
  discountCode?: string;
}

export const AbandonedCartEmail = ({ 
  customerName, 
  cartItems, 
  cartTotal, 
  checkoutUrl,
  discountCode 
}: AbandonedCartEmailProps) => {
  return (
    <EmailWrapper previewText={`${customerName}, you left ${cartItems.length} item(s) in your cart`}>
      <tr>
        <td style={{ padding: '40px', textAlign: 'center', backgroundColor: '#000' }}>
          <h1 style={{ color: '#fff', margin: 0, fontSize: '24px' }}>WE do.not CARE CLUB</h1>
        </td>
      </tr>
      <tr>
        <td style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>You left something behind...</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
            Hey {customerName}, looks like you got distracted. Your cart is waiting.
          </p>
          
          {cartItems.map((item, i) => (
            <table key={i} width="100%" style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '24px' }}>
              <tr>
                <td width="100">
                  <img src={item.image} alt={item.name} width="80" style={{ borderRadius: '8px' }} />
                </td>
                <td style={{ paddingLeft: '16px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{item.name}</p>
                  {item.size && <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>Size: {item.size}</p>}
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>Qty: {item.quantity}</p>
                </td>
                <td align="right">
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>${item.price.toFixed(2)}</p>
                </td>
              </tr>
            </table>
          ))}
          
          <p style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'right', marginTop: '24px' }}>
            Total: ${cartTotal.toFixed(2)}
          </p>
          
          {discountCode && (
            <div style={{ backgroundColor: '#f8f8f8', padding: '20px', borderRadius: '8px', margin: '24px 0', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Use code</p>
              <p style={{ margin: '8px 0', fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px' }}>{discountCode}</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>for 10% off your order</p>
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a href={checkoutUrl} style={{ 
              display: 'inline-block',
              backgroundColor: '#000',
              color: '#fff',
              padding: '16px 48px',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Complete Your Order
            </a>
          </div>
        </td>
      </tr>
    </EmailWrapper>
  );
};
