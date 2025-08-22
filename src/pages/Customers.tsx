import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customers as initialCustomers, updateCustomer, deleteCustomer, Customer } from '../data/db';

const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    
    useEffect(() => {
        // APIからデータをフェッチする代わりに、db.tsから読み込む
        setCustomers(initialCustomers);
    }, []);


    const handleDelete = (customerId: number) => {
        if (window.confirm('本当にこの顧客を削除しますか？')) {
            deleteCustomer(customerId);
            setCustomers(customers.filter(customer => customer.id !== customerId));
        }
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer({...customer}); // 編集用にコピーを作成
        setIsEditModalOpen(true);
    };

    const handleUpdateCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomer) {
            updateCustomer(editingCustomer);
            setCustomers(customers.map(c => c.id === editingCustomer.id ? editingCustomer : c));
            setIsEditModalOpen(false);
            setEditingCustomer(null);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold dark:text-white">顧客管理</h1>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#2B3467] text-white px-4 py-2 rounded hover:bg-opacity-80 w-full sm:w-auto"
                >
                    新規顧客を追加
                </button>
            </div>

            {/* 顧客一覧テーブル (PC用) */}
            <div className="hidden md:block bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">企業名</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">業種</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">規模</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">所在地</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">経営課題</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">アクション</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    <Link to={`/customers/${customer.id}`} className="text-[#2B3467] hover:underline dark:text-blue-400">
                                        {customer.name}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.industry}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.scale}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.issues}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(customer)} className="text-[#2B3467] hover:underline mr-4 dark:text-blue-400">編集</button>
                                    <button onClick={() => handleDelete(customer.id)} className="text-[#EB455F] hover:underline">削除</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 顧客一覧カード (モバイル用) */}
            <div className="block md:hidden space-y-4">
                {customers.map(customer => (
                    <div key={customer.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                        <Link to={`/customers/${customer.id}`} className="block mb-2">
                            <h2 className="text-lg font-bold text-[#2B3467] dark:text-blue-400">{customer.name}</h2>
                        </Link>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <div><span className="font-semibold">業種:</span> {customer.industry}</div>
                            <div><span className="font-semibold">規模:</span> {customer.scale}</div>
                            <div><span className="font-semibold">所在地:</span> {customer.location}</div>
                            <div><span className="font-semibold">経営課題:</span> {customer.issues}</div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
                            <button onClick={() => handleEdit(customer)} className="text-[#2B3467] hover:underline dark:text-blue-400 text-sm">編集</button>
                            <button onClick={() => handleDelete(customer.id)} className="text-[#EB455F] hover:underline ml-4 text-sm">削除</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 新規顧客追加モーダル */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">新規顧客追加</h2>
                        <form>
                            <div className="grid grid-cols-1 gap-6">
                                <input type="text" placeholder="企業名" className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="text" placeholder="業種" className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="text" placeholder="規模" className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="text" placeholder="所在地" className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <textarea placeholder="経営課題" className="border p-2 rounded w-full h-24 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-gray-200 dark:bg-gray-600 dark:text-gray-300 px-4 py-2 rounded mr-2">キャンセル</button>
                                <button type="submit" className="bg-[#2B3467] text-white px-4 py-2 rounded">保存</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* 編集モーダル */}
            {isEditModalOpen && editingCustomer && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">顧客情報編集</h2>
                        <form onSubmit={handleUpdateCustomer}>
                            <div className="grid grid-cols-1 gap-6">
                                <input type="text" placeholder="企業名" value={editingCustomer.name} onChange={e => setEditingCustomer({...editingCustomer, name: e.target.value})} className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="text" placeholder="業種" value={editingCustomer.industry} onChange={e => setEditingCustomer({...editingCustomer, industry: e.target.value})} className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="text" placeholder="規模" value={editingCustomer.scale} onChange={e => setEditingCustomer({...editingCustomer, scale: e.target.value})} className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="text" placeholder="所在地" value={editingCustomer.location} onChange={e => setEditingCustomer({...editingCustomer, location: e.target.value})} className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="text" placeholder="売上高" value={editingCustomer.sales} onChange={e => setEditingCustomer({...editingCustomer, sales: e.target.value})} className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <textarea placeholder="経営課題" value={editingCustomer.issues} onChange={e => setEditingCustomer({...editingCustomer, issues: e.target.value})} className="border p-2 rounded w-full h-24 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-200 dark:bg-gray-600 dark:text-gray-300 px-4 py-2 rounded mr-2">キャンセル</button>
                                <button type="submit" className="bg-[#2B3467] text-white px-4 py-2 rounded">保存</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
