import React from 'react';
import { type Customer, type Subsidy } from '../data/db';

interface ProposalDocumentProps {
  customer: Customer;
  subsidy: Subsidy;
}

// PDFとして出力するためのコンポーネント
// このコンポーントは画面には表示されず、html2canvasで画像に変換するためだけに使用される
export const ProposalDocument: React.FC<ProposalDocumentProps> = ({ customer, subsidy }) => {
  return (
    <div
      id="proposal-document"
      style={{
        width: '800px', // A4サイズに近い幅
        padding: '40px',
        backgroundColor: 'white',
        fontFamily: 'sans-serif',
        color: 'black',
      }}
    >
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        {subsidy.name}のご提案
      </h1>
      <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
        {customer.name} 様
      </h2>
      <hr style={{ margin: '20px 0' }} />

      <h3 style={{ fontSize: '20px', marginTop: '30px' }}>1. 提案概要</h3>
      <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
        貴社の経営課題である「{customer.issues}」に対し、本補助金の活用をご提案いたします。
        この補助金は「{subsidy.overview}」であり、貴社の課題解決に大きく貢献する可能性がございます。
      </p>

      <h3 style={{ fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>2. 補助金詳細</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <tbody>
          <tr style={{ border: '1px solid #ddd' }}>
            <td style={{ padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>補助金額</td>
            <td style={{ padding: '8px' }}>{subsidy.amount}</td>
          </tr>
          <tr style={{ border: '1px solid #ddd' }}>
            <td style={{ padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>補助率</td>
            <td style={{ padding: '8px' }}>{subsidy.rate}</td>
          </tr>
          <tr style={{ border: '1px solid #ddd' }}>
            <td style={{ padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>対象者</td>
            <td style={{ padding: '8px' }}>{subsidy.target}</td>
          </tr>
          <tr style={{ border: '1px solid #ddd' }}>
            <td style={{ padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>公募締切</td>
            <td style={{ padding: '8px' }}>{subsidy.deadline}</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>3. 主な申請要件</h3>
      <ul style={{ fontSize: '14px', paddingLeft: '20px' }}>
        {subsidy.conditions.map((condition, index) => (
          <li key={index} style={{ marginBottom: '8px' }}>{condition}</li>
        ))}
      </ul>
    </div>
  );
};
