import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { customers, subsidies, customerSubsidyRelations, updateCustomer, Customer, Subsidy, CustomerSubsidyRelation } from '../data/db';

// 顧客に関連する補助金情報を取得するための型
interface MatchedSubsidy extends Subsidy {
    status: CustomerSubsidyRelation['status'];
    matchRate: number;
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = id ? Number(id) : undefined;

  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [matchedSubsidies, setMatchedSubsidies] = useState<MatchedSubsidy[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  
  useEffect(() => {
    if (customerId === undefined) {
        // idがない場合は何もしないか、エラーページに飛ばすなど
        return;
    }
    // APIフェッチのシミュレーション
    const currentCustomer = customers.find(c => c.id === customerId);
    setCustomer(currentCustomer);

    if (currentCustomer) {
        // 顧客に関連する補助金情報を取得
        const relations = customerSubsidyRelations.filter(r => r.customerId === currentCustomer.id);
        const subsidiesForCustomer = relations.map(relation => {
            const subsidy = subsidies.find(s => s.id === relation.subsidyId);
            return { ...subsidy, status: relation.status, matchRate: relation.matchRate } as MatchedSubsidy;
        }).filter(s => s.id); // 見つからなかったものは除外

        setMatchedSubsidies(subsidiesForCustomer);
    }
  }, [customerId]);

  const handleEdit = () => {
    if (customer) {
        setEditedCustomer({...customer});
        setIsModalOpen(true);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedCustomer) {
        updateCustomer(editedCustomer);
        setCustomer(editedCustomer);
        setIsModalOpen(false);
    }
  };


  if (customerId === undefined) {
    return <div>無効な顧客IDです。</div>;
  }

  if (!customer) {
    return <div>顧客が見つかりません。</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4 inline-flex items-center">
        戻る
      </button>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-[#2B3467] dark:text-gray-200">{customer.name}</h1>
        <button 
            onClick={handleEdit}
            className="bg-[#2B3467] text-white px-4 py-2 rounded hover:bg-opacity-80"
        >
            編集
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左側カラム (変更なし) */}
        <div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-200 dark:border-gray-700">企業情報</h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p><strong>業種:</strong> {customer.industry}</p>
              <p><strong>企業規模:</strong> {customer.scale}</p>
              <p><strong>所在地:</strong> {customer.location}</p>
              <p><strong>売上高:</strong> {customer.sales}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-gray-200 dark:border-gray-700">経営課題</h2>
            <p className="text-gray-700 dark:text-gray-300">{customer.issues}</p>
          </div>
        </div>

        {/* 右側カラム (関連補助金表示部分を修正) */}
        <div>
          <div className="bg-[#FCFFE7] dark:bg-gray-800 p-6 rounded-lg shadow-md border border-[#BAD7E9] dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-[#2B3467] dark:text-gray-200">関連補助金</h2>
            <div className="space-y-4">
              {matchedSubsidies.map(subsidy => (
                <div key={subsidy.id} className="bg-white dark:bg-gray-700 p-4 rounded-md shadow flex justify-between items-center">
                  <div>
                    <Link to={`/subsidies/${subsidy.id}`} className="font-bold dark:text-gray-200 hover:underline">{subsidy.name}</Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ステータス: {subsidy.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">適合率</p>
                    <p className="text-lg font-bold text-[#EB455F]">{subsidy.matchRate}%</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-[#2B3467] text-white px-4 py-2 rounded hover:bg-opacity-80">
                新規補助金提案
            </button>
          </div>
        </div>
      </div>

      {/* 編集モーダル (フォーム部分を修正) */}
      {isModalOpen && editedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">顧客情報編集</h2>
                <form onSubmit={handleUpdate}>
                    <div className="grid grid-cols-1 gap-6">
                        <input type="text" placeholder="企業名" value={editedCustomer.name} onChange={e => setEditedCustomer({...editedCustomer, name: e.target.value})} className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <input type="text" placeholder="業種" value={editedCustomer.industry} onChange={e => setEditedCustomer({...editedCustomer, industry: e.target.value})} className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <input type="text" placeholder="規模" value={editedCustomer.scale} onChange={e => setEditedCustomer({...editedCustomer, scale: e.target.value})} className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <input type="text" placeholder="所在地" value={editedCustomer.location} onChange={e => setEditedCustomer({...editedCustomer, location: e.target.value})} className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <input type="text" placeholder="売上高" value={editedCustomer.sales} onChange={e => setEditedCustomer({...editedCustomer, sales: e.target.value})} className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <textarea placeholder="経営課題" value={editedCustomer.issues} onChange={e => setEditedCustomer({...editedCustomer, issues: e.target.value})} className="border p-2 rounded w-full h-24 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 dark:bg-gray-600 dark:text-gray-300 px-4 py-2 rounded mr-2">キャンセル</button>
                        <button type="submit" className="bg-[#2B3467] text-white px-4 py-2 rounded">保存</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetail;
