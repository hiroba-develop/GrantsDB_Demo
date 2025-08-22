import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { subsidies, customers, customerSubsidyRelations } from '../data/db';
import { generateProposalPDFfromHTML } from '../utils/pdfGenerator';

const SubsidyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const subsidyId = id ? Number(id) : undefined;
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);


  const currentDate = new Date('2025-08-20'); // 現在日付のシミュレーション

  // 実際にはAPIからidを使ってデータを取得する
  const subsidy = subsidyId !== undefined ? subsidies.find(s => s.id === subsidyId) : undefined;
  
  const isExpired = useMemo(() => {
    if (!subsidy) return false;
    // '予算上限まで' のような日付でない文字列は締切ではないと判断
    if (isNaN(new Date(subsidy.deadline).getTime())) {
        return false;
    }
    return new Date(subsidy.deadline) < currentDate;
  }, [subsidy, currentDate]);

  if (subsidyId === undefined) {
    return <div>無効な補助金IDです。</div>;
  }

  if (!subsidy) {
    return <div>補助金が見つかりません。</div>;
  }
  
  const getStatusTag = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (isNaN(deadlineDate.getTime()) || deadlineDate >= currentDate) {
        if (deadline === '予算上限まで') {
            return <span className="ml-4 px-3 py-1 text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">公募中</span>;
        }
        if (daysRemaining <= 30) {
            return <span className="ml-4 px-3 py-1 text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">締切間近</span>;
        }
        return <span className="ml-4 px-3 py-1 text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">公募中</span>;
    } else {
        return <span className="ml-4 px-3 py-1 text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">締切</span>;
    }
  };

  // この補助金に関連する顧客を取得
  const relatedRelations = customerSubsidyRelations.filter(r => r.subsidyId === subsidy.id);
  const matchedCustomers = relatedRelations
    .map(relation => {
        const customer = customers.find(c => c.id === relation.customerId);
        // customerが見つからない場合は、後続のfilterで除外するためにnullを返す
        if (!customer) {
            return null;
        }
        // customerの全プロパティとmatchRateを結合して新しいオブジェクトを返す
        return {
            ...customer,
            matchRate: relation.matchRate,
        };
    })
    .filter((customer): customer is import('../data/db').Customer & { matchRate: number } => customer !== null);


  const handleGeneratePdf = async () => {
    if (!selectedCustomerId) {
        alert('顧客を選択してください。');
        return;
    }
    const selectedCustomer = customers.find(c => c.id === Number(selectedCustomerId));
    if (!selectedCustomer || !subsidy) {
        alert('選択された顧客または補助金が見つかりません。');
        return;
    }

    try {
        const doc = await generateProposalPDFfromHTML(selectedCustomer, subsidy);
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        setIsPreviewOpen(true);
    } catch (error) {
        console.error("PDF generation failed:", error);
        alert('PDFの生成に失敗しました。');
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4 inline-flex items-center">
        戻る
      </button>
      <div className="flex items-center mb-2">
        <h1 className="text-3xl font-bold text-[#2B3467] dark:text-gray-200">{subsidy.name}</h1>
        {getStatusTag(subsidy.deadline)}
      </div>
      {isExpired && (
        <p className="text-red-600 font-bold text-lg mb-4">この補助金は応募を終了しています。</p>
      )}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600 dark:text-gray-400">{subsidy.agency}</p>
        {subsidy.url && (
            <a 
                href={subsidy.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
                公式サイトを見る
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左側カラム */}
        <div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-200 dark:border-gray-700">基本情報</h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p><strong>概要:</strong> {subsidy.overview}</p>
              <p><strong>補助額:</strong> {subsidy.amount}</p>
              <p><strong>補助率:</strong> {subsidy.rate}</p>
              <p><strong>対象者:</strong> {subsidy.target}</p>
              <p><strong>応募期間:</strong> <span className="font-bold">{subsidy.startDate} ~ {subsidy.deadline}</span></p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-200 dark:border-gray-700">申請要件</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {subsidy.conditions.map((cond, i) => <li key={i}>{cond}</li>)}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-200 dark:border-gray-700">必要書類</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {subsidy.documents.map((doc, i) => <li key={i}>{doc}</li>)}
            </ul>
          </div>
        </div>

        {/* 右側カラム */}
        <div>
          <div className="bg-[#FCFFE7] dark:bg-gray-800 p-6 rounded-lg shadow-md border border-[#BAD7E9] dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-[#2B3467] dark:text-gray-200">顧客マッチング</h2>
            <div className="space-y-4">
              {matchedCustomers.map(customer => (
                <div key={customer.id} className="bg-white dark:bg-gray-700 p-4 rounded-md shadow flex justify-between items-center">
                  <div>
                    <Link to={`/customers/${customer.id}`} className="font-bold dark:text-gray-200 hover:underline">{customer.name}</Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{customer.industry}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">適合率</p>
                    <p className="text-lg font-bold text-[#EB455F]">{customer.matchRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4 text-[#2B3467] dark:text-gray-200">提案資料生成</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">顧客を選択して提案資料を生成します。</p>
            <select 
                className="w-full border p-2 rounded mb-4 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
                <option value="">顧客を選択...</option>
                {matchedCustomers.map(c => c && <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="flex space-x-4">
              <button 
                onClick={handleGeneratePdf}
                className="flex-1 bg-[#2B3467] text-white px-4 py-2 rounded hover:bg-opacity-80 disabled:bg-gray-400"
                disabled={!selectedCustomerId}
              >
                提案資料(PDF)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDFプレビューモーダル */}
      {isPreviewOpen && pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full h-full flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold dark:text-white">PDFプレビュー</h2>
                    <div>
                        <a 
                            href={pdfUrl} 
                            download={`${customers.find(c => c.id === Number(selectedCustomerId))?.name}_${subsidy?.name}_提案資料.pdf`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            ダウンロード
                        </a>
                        <button onClick={() => setIsPreviewOpen(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                            閉じる
                        </button>
                    </div>
                </div>
                <div className="flex-grow p-4">
                    <iframe src={pdfUrl} width="100%" height="100%" title="PDF Preview"></iframe>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SubsidyDetail;
