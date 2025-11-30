import { EmailWrapper } from './EmailWrapper';

interface PostPurchaseEmailProps {
  customerName: string;
  orderNumber: string;
  productName: string;
  productImage: string;
  reviewUrl: string;
  shopUrl: string;
  recommendedProducts: Array<{
    name: string;
    price: number;
    image: string;
    url: string;
  }>;
}

export const PostPurchaseEmail = ({ 
  customerName, 
  orderNumber, 
  productName,
  productImage,
  reviewUrl,
  shopUrl,
  recommendedProducts 
}: PostPurchaseEmailProps) => {
  return (
    <EmailWrapper previewText={`How are you loving your ${productName}?`}>
      <tr>
        <td style={{ padding: '40px', textAlign: 'center', backgroundColor: '#000' }}>
          <h1 style={{ color: '#fff', margin: 0, fontSize: '24px' }}>WE do.not CARE CLUB</h1>
        </td>
      </tr>
      <tr>
        <td style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>How's it going, {customerName}?</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
            You've had your <strong>{productName}</strong> for a week now. We'd love to hear what you think!
          </p>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src={productImage} alt={productName} width="200" style={{ borderRadius: '8px' }} />
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <a href={reviewUrl} style={{ 
              display: 'inline-block',
              backgroundColor: '#000',
              color: '#fff',
              padding: '16px 48px',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Leave a Review
            </a>
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '40px 0' }} />
          
          <h3 style={{ fontSize: '20px', marginBottom: '24px', textAlign: 'center' }}>You Might Also Like</h3>
          
          <table width="100%" cellPadding="0" cellSpacing="0">
            <tr>
              {recommendedProducts.slice(0, 3).map((product, i) => (
                <td key={i} width="33%" style={{ padding: '8px', textAlign: 'center' }}>
                  <a href={product.url} style={{ textDecoration: 'none' }}>
                    <img src={product.image} alt={product.name} width="150" style={{ borderRadius: '8px', marginBottom: '8px' }} />
                    <p style={{ margin: '8px 0 4px', fontSize: '14px', color: '#000' }}>{product.name}</p>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#000' }}>${product.price.toFixed(2)}</p>
                  </a>
                </td>
              ))}
            </tr>
          </table>
          
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a href={shopUrl} style={{ color: '#000', fontSize: '14px' }}>Shop All Products →</a>
          </div>
        </td>
      </tr>
    </EmailWrapper>
  );
};
