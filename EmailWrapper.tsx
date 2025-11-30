interface EmailWrapperProps {
  children: React.ReactNode;
  previewText?: string;
}

export const EmailWrapper = ({ children, previewText }: EmailWrapperProps) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {previewText && (
          <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>
            {previewText}
          </div>
        )}
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#f4f4f4',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f4f4f4', padding: '40px 0' }}>
          <tr>
            <td align="center">
              <table width="600" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' }}>
                {children}
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};
