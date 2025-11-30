import { EmailWrapper } from './EmailWrapper';

interface RestockEmailProps {
  customerName: string;
  productName: string;
  productImage: string;
  productUrl: string;
  size?: string;
  price: number;
}

export const RestockEmail = ({ 
  customerName, 
  productName, 
  productImage,
  productUrl,
  size,
  price 
}: RestockEmailProps) => {
  return (
    <EmailWrapper previewText={`${productName} is back in stock!`}>
      <tr>
        <td style={{ padding: '40px', textAlign: 'center', backgroundColor: '#000' }}>
          <h1 style={{ color: '#fff', margin: 0, fontSize: '24px' }}>WE do.not CARE CLUB</h1>
        </td>
      </tr>
      <tr>
        <td style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block',
            backgroundColor: '#22c55e',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '24px'
          }}>
            BACK IN STOCK
          </div>
          
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Good news, {customerName}!</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
            The item you've been waiting for is back and ready to ship.
          </p>
          
          <img src={productImage} alt={productName} width="300" style={{ borderRadius: '8px', marginBottom: '24px' }} />
          
          <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>{productName}</h3>
          {size && <p style={{ fontSize: '16px', color: '#666', margin: '0 0 8px' }}>Size: {size}</p>}
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>${price.toFixed(2)}</p>
          
          <a href={productUrl} style={{ 
            display: 'inline-block',
            backgroundColor: '#000',
            color: '#fff',
            padding: '16px 48px',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Shop Now
          </a>
          
          <p style={{ fontSize: '14px', color: '#999', marginTop: '24px' }}>
            Hurry! Limited quantities available.
          </p>
        </td>
      </tr>
    </EmailWrapper>
  );
};
