import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { subsidies } from '../data/db';

const Subsidies: React.FC = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
    const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
    const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
    const currentDate = new Date('2025-08-20'); // 現在日付のシミュレーション

    useEffect(() => {
        if (location.state && location.state.selectedCategory) {
            if (location.state.type === 'industry') {
                setSelectedIndustry(location.state.selectedCategory);
                setSelectedPurpose(null);
            } else if (location.state.type === 'purpose') {
                setSelectedPurpose(location.state.selectedCategory);
                setSelectedIndustry(null);
            }
        }
        // URLクエリパラメータからの都道府県指定をチェック（将来的な拡張用）
        // const queryParams = new URLSearchParams(location.search);
        // const prefecture = queryParams.get('prefecture');
        // if (prefecture) {
        //     setSelectedPrefecture(prefecture);
        // }
    }, [location.state, location.search]);

    const allIndustries = useMemo(() => {
        const industries = new Set<string>();
        subsidies.forEach(s => {
            s.industries.forEach(i => industries.add(i));
        });
        return Array.from(industries);
    }, []);

    const allPurposes = useMemo(() => {
        const purposes = new Set<string>();
        subsidies.forEach(s => {
            s.purposes.forEach(p => purposes.add(p));
        });
        return Array.from(purposes);
    }, []);

    const allPrefectures = useMemo(() => {
        const prefectureOrder = [
            '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
            '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
            '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
            '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
            '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
            '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
            '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
        ];
        const prefectures = new Set<string>();
        subsidies.forEach(s => {
            prefectures.add(s.prefecture);
        });
        return Array.from(prefectures).sort((a, b) => {
            const indexA = prefectureOrder.indexOf(a);
            const indexB = prefectureOrder.indexOf(b);
            // もしリストにない都道府県があった場合、リストの後ろに来るように調整
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }, []);

    const sortedAndFilteredSubsidies = useMemo(() => {
        let filteredItems = [...subsidies];

        // Prefecture filter
        if (selectedPrefecture) {
            filteredItems = filteredItems.filter(subsidy => 
                subsidy.prefecture === selectedPrefecture
            );
        }

        // Industry filter
        if (selectedIndustry) {
            filteredItems = filteredItems.filter(subsidy => 
                subsidy.industries.includes(selectedIndustry)
            );
        }

        // Purpose filter
        if (selectedPurpose) {
            filteredItems = filteredItems.filter(subsidy => 
                subsidy.purposes.includes(selectedPurpose)
            );
        }

        // Search term filter
        if (searchTerm) {
            filteredItems = filteredItems.filter(subsidy => 
                subsidy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                subsidy.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                subsidy.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                subsidy.industries.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
                subsidy.purposes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        filteredItems.sort((a, b) => {
            const aIsActive = new Date(a.deadline) >= currentDate || a.deadline === '予算上限まで';
            const bIsActive = new Date(b.deadline) >= currentDate || b.deadline === '予算上限まで';

            // アクティブなものを上に
            if (aIsActive && !bIsActive) return -1;
            if (!aIsActive && bIsActive) return 1;

            // 両方アクティブな場合：締切が近い順
            if (aIsActive) {
                // '予算上限まで' のような日付でないものは優先度を低く（リストの下の方に）
                const aDate = new Date(a.deadline);
                const bDate = new Date(b.deadline);

                if (isNaN(aDate.getTime())) return 1;
                if (isNaN(bDate.getTime())) return -1;

                return aDate.getTime() - bDate.getTime();
            }
            
            // 両方締め切り後の場合：締切が新しい順
            return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        });

        return filteredItems;
    }, [searchTerm, selectedIndustry, selectedPurpose, selectedPrefecture]);

    const getStatusTag = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const timeDiff = deadlineDate.getTime() - currentDate.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (isNaN(deadlineDate.getTime()) || deadlineDate >= currentDate) {
            // '予算上限まで' のような日付でない文字列、または締切が未来日の場合
            if (deadline === '予算上限まで') {
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">公募中</span>;
            }
            if (daysRemaining <= 30) {
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">締切間近</span>;
            }
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">公募中</span>;
        } else {
            // 締切が過去日の場合
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">締切</span>;
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold dark:text-white">補助金一覧</h1>
                <button className="bg-[#2B3467] text-white px-4 py-2 rounded hover:bg-opacity-80 w-full sm:w-auto">
                    新規補助金を追加
                </button>
            </div>

            {/* 検索・ソートエリア */}
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        type="text"
                        placeholder="キーワードで検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <select
                        value={selectedPrefecture || ''}
                        onChange={(e) => setSelectedPrefecture(e.target.value || null)}
                        className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">すべての都道府県</option>
                        {allPrefectures.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
                <div className="mt-4">
                    <div className="mb-2">
                        <span className="font-semibold dark:text-gray-200 mr-2">業界:</span>
                        <button 
                            onClick={() => setSelectedIndustry(null)}
                            className={`px-3 py-1 text-sm rounded-full mr-2 mb-2 ${!selectedIndustry ? 'bg-[#2B3467] text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}
                        >
                            すべて
                        </button>
                        {allIndustries.map(industry => (
                            <button 
                                key={industry}
                                onClick={() => { setSelectedIndustry(industry); setSelectedPurpose(null); }}
                                className={`px-3 py-1 text-sm rounded-full mr-2 mb-2 ${selectedIndustry === industry ? 'bg-[#2B3467] text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}
                            >
                                {industry}
                            </button>
                        ))}
                    </div>
                    <div>
                        <span className="font-semibold dark:text-gray-200 mr-2">目的:</span>
                        <button 
                            onClick={() => setSelectedPurpose(null)}
                            className={`px-3 py-1 text-sm rounded-full mr-2 mb-2 ${!selectedPurpose ? 'bg-[#2B3467] text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}
                        >
                            すべて
                        </button>
                        {allPurposes.map(purpose => (
                            <button 
                                key={purpose}
                                onClick={() => { setSelectedPurpose(purpose); setSelectedIndustry(null); }}
                                className={`px-3 py-1 text-sm rounded-full mr-2 mb-2 ${selectedPurpose === purpose ? 'bg-[#2B3467] text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}
                            >
                                {purpose}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* PC表示: テーブル */}
            <div className="hidden md:block bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                補助金名
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                都道府県
                            </th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                タグ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                ステータス
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                実施機関
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                補助額
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                応募期間
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">アクション</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedAndFilteredSubsidies.map(subsidy => (
                            <tr key={subsidy.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    <Link to={`/subsidies/${subsidy.id}`} className="text-[#2B3467] hover:underline dark:text-blue-400">
                                        {subsidy.name}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{subsidy.prefecture}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-wrap gap-1">
                                        {[...subsidy.industries, ...subsidy.purposes].map(tag => (
                                            <span key={tag} className={`px-2 py-1 text-xs rounded-full ${allIndustries.includes(tag) ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {getStatusTag(subsidy.deadline)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{subsidy.agency}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {subsidy.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {subsidy.startDate} ~ {subsidy.deadline}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/subsidies/${subsidy.id}`} className="text-[#2B3467] hover:underline dark:text-blue-400">詳細</Link>
                                    <button className="text-[#2B3467] hover:underline ml-4 dark:text-blue-400">編集</button>
                                    <button className="text-[#EB455F] hover:underline ml-4">削除</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* モバイル表示: カードリスト */}
            <div className="block md:hidden space-y-4">
                {sortedAndFilteredSubsidies.map(subsidy => (
                    <div key={subsidy.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                        <Link to={`/subsidies/${subsidy.id}`} className="block mb-2">
                            <h2 className="text-lg font-bold text-[#2B3467] dark:text-blue-400">{subsidy.name}</h2>
                        </Link>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <div className="flex items-center">
                                <span className="font-semibold w-20">ステータス:</span>
                                {getStatusTag(subsidy.deadline)}
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold w-20">都道府県:</span>
                                <span>{subsidy.prefecture}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold w-20">実施機関:</span>
                                <span>{subsidy.agency}</span>
                            </div>
                             <div className="flex items-start">
                                <span className="font-semibold w-20 flex-shrink-0">タグ:</span>
                                <div className="flex flex-wrap gap-1">
                                    {[...subsidy.industries, ...subsidy.purposes].map(tag => (
                                        <span key={tag} className={`px-2 py-1 text-xs rounded-full ${allIndustries.includes(tag) ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
                             <Link to={`/subsidies/${subsidy.id}`} className="text-[#2B3467] hover:underline dark:text-blue-400 text-sm">詳細</Link>
                             <button className="text-[#2B3467] hover:underline ml-4 dark:text-blue-400 text-sm">編集</button>
                             <button className="text-[#EB455F] hover:underline ml-4 text-sm">削除</button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Subsidies;
