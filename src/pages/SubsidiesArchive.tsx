import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { subsidies, type Subsidy } from '../data/db';

const SubsidiesArchive: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // URLクエリパラメータから検索キーワードを取得
        const params = new URLSearchParams(location.search);
        const query = params.get('q');
        if (query) {
            setSearchTerm(query);
        }
    }, [location.search]);


    // 締切日の降順（新しいものが上）にソート
    const allSubsidies: Subsidy[] = [...subsidies].sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    const currentDate = new Date('2025-08-20'); // 現在日付のシミュレーション

    const filteredSubsidies = useMemo(() => {
        if (!searchTerm) {
            return allSubsidies;
        }
        return allSubsidies.filter(subsidy => 
            subsidy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subsidy.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subsidy.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subsidy.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subsidy.industries.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
            subsidy.purposes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, allSubsidies]);


    const getStatusTag = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        if (deadlineDate >= currentDate) {
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">公募中</span>;
        } else {
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">締切</span>;
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold dark:text-white">補助金全件一覧（過去分含む）</h1>
                <button 
                    onClick={() => navigate(-1)} 
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                    戻る
                </button>
            </div>

            {/* 検索エリア */}
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                        type="text"
                        placeholder="キーワードで検索 (例: ものづくり, IT導入)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </div>

            {/* PC表示: テーブル */}
            <div className="hidden md:block bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">補助金名</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">タグ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ステータス</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">実施機関</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">補助額</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">締切日</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredSubsidies.map(subsidy => (
                            <tr key={subsidy.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    <Link to={`/subsidies/${subsidy.id}`} className="text-[#2B3467] hover:underline dark:text-blue-400">
                                        {subsidy.name}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-wrap gap-1">
                                        {[...subsidy.industries, ...subsidy.purposes].map(tag => (
                                            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {getStatusTag(subsidy.deadline)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{subsidy.agency}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{subsidy.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{subsidy.deadline}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* モバイル表示: カードリスト */}
            <div className="block md:hidden space-y-4">
                {filteredSubsidies.map(subsidy => (
                    <div key={subsidy.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                        <Link to={`/subsidies/${subsidy.id}`} className="block mb-2">
                            <h2 className="text-lg font-bold text-[#2B3467] dark:text-blue-400">{subsidy.name}</h2>
                        </Link>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <div><span className="font-semibold w-20 inline-block">ステータス:</span> {getStatusTag(subsidy.deadline)}</div>
                            <div><span className="font-semibold w-20 inline-block">締切日:</span> {subsidy.deadline}</div>
                            <div><span className="font-semibold w-20 inline-block">実施機関:</span> {subsidy.agency}</div>
                            <div><span className="font-semibold w-20 inline-block">補助額:</span> {subsidy.amount}</div>
                            <div>
                                <span className="font-semibold w-20 align-top inline-block">タグ:</span>
                                <div className="flex flex-wrap gap-1">
                                    {[...subsidy.industries, ...subsidy.purposes].map(tag => (
                                        <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubsidiesArchive;
