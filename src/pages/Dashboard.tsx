import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { subsidies, customerSubsidyRelations } from '../data/db';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    // APIフェッチのシミュレーション
    const [newSubsidies, setNewSubsidies] = useState<any[]>([]);
    const [expiringSubsidies, setExpiringSubsidies] = useState<any[]>([]);
    const [recentViewed, setRecentViewed] = useState<any[]>([]);

    useEffect(() => {
        const currentDate = new Date('2025-08-20'); // 現在日付のシミュレーション

        // 新着補助金：単純にIDが大きい順で未来のもの
        const sortedSubsidies = [...subsidies].sort((a, b) => b.id - a.id);
        const futureSubsidies = sortedSubsidies.filter(s => {
            const deadlineDate = new Date(s.deadline);
            return isNaN(deadlineDate.getTime()) || deadlineDate >= currentDate;
        });
        setNewSubsidies(futureSubsidies.slice(0, 2));

        // 締切が近いものをフィルタリングして「締切間近」とする
        const upcoming = subsidies.filter(s => {
            const deadline = new Date(s.deadline);
            if (isNaN(deadline.getTime())) return false; // 日付でないものは除外
            const diffDays = Math.ceil((deadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays < 90; // 90日以内に締切のものを対象
        }).map(s => {
            const deadline = new Date(s.deadline);
            const diffDays = Math.ceil((deadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            return { ...s, daysLeft: diffDays, urgency: diffDays < 30 ? 'high' : 'medium' };
        }).sort((a, b) => a.daysLeft - b.daysLeft);
        setExpiringSubsidies(upcoming.slice(0, 2));

        // IDが大きいものを「最近見た」とする（仮）
        setRecentViewed(sortedSubsidies.slice(2, 4));

    }, []);

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

    const proposableCounts = useMemo(() => {
        const counts: { [key: string]: { count: number; type: 'industry' | 'purpose' } } = {};
        // 提案可能な補助金（マッチングレートが高いものなど）をカテゴリ別に集計
        customerSubsidyRelations.forEach(relation => {
            if (relation.matchRate > 70) { // 例：適合率70%以上
                const subsidy = subsidies.find(s => s.id === relation.subsidyId);
                if (subsidy) {
                    subsidy.industries.forEach(cat => {
                        counts[cat] = { count: (counts[cat]?.count || 0) + 1, type: 'industry' };
                    });
                    subsidy.purposes.forEach(cat => {
                        counts[cat] = { count: (counts[cat]?.count || 0) + 1, type: 'purpose' };
                    });
                }
            }
        });
        return Object.entries(counts)
            .map(([category, data]) => ({ category, count: data.count, type: data.type }))
            .sort((a, b) => b.count - a.count);
    }, []);
    
    const handleCategoryClick = (category: string, type: 'industry' | 'purpose') => {
        navigate('/subsidies', { state: { selectedCategory: category, type } });
    };

    const getStatusTag = (deadline: string) => {
        const currentDate = new Date('2025-08-20');
        const deadlineDate = new Date(deadline);
        if (deadlineDate >= currentDate) {
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">公募中</span>;
        } else {
            return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">締切</span>;
        }
    };

  // ダミーデータ（一部残す）
  const quickSearches = ['製造業向け', 'IT導入', '東京都限定'];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 dark:text-white">ダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* 新着補助金情報 */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#2B3467]">新着補助金</h2>
          <div className="space-y-3">
            {newSubsidies.map(s => (
              <div key={s.id} className="p-3 rounded-md bg-blue-100 dark:bg-blue-900/50">
                <Link to={`/subsidies/${s.id}`} className="font-semibold text-[#2B3467] hover:underline dark:text-blue-400">{s.name}</Link>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    締切: {s.deadline}
                    <span className="ml-2">{getStatusTag(s.deadline)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link to="/subsidies" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              補助金一覧を見る &rarr;
            </Link>
          </div>
        </div>

        {/* 締切間近の補助金 */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#EB455F]">締切間近の補助金</h2>
          <div className="space-y-3">
            {expiringSubsidies.map(s => (
              <div key={s.id} className={`p-3 rounded-md ${s.urgency === 'high' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-yellow-100 dark:bg-yellow-900/50'}`}>
                <Link to={`/subsidies/${s.id}`} className="font-semibold text-[#2B3467] hover:underline dark:text-blue-400">{s.name}</Link>
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mt-1">
                    締切: {s.deadline} (あと{s.daysLeft}日)
                    <span className="ml-2">{getStatusTag(s.deadline)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 提案可能な補助金 */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#2B3467]">提案可能な補助金</h2>
          <div className="space-y-2">
            {proposableCounts.slice(0, 5).map(p => ( // 上位5件表示
              <div key={p.category} className="flex justify-between items-center">
                <button 
                  onClick={() => handleCategoryClick(p.category, p.type)}
                  className="text-gray-600 hover:underline text-left"
                >
                  {p.category}
                </button>
                <span className="font-bold text-lg text-[#2B3467]">{p.count}件</span>
              </div>
            ))}
          </div>
        </div>

        {/* クイックアクセス */}
        <div className="md:col-span-2 lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#2B3467]">クイックアクセス</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <div>
              <h3 className="font-semibold mb-2 dark:text-gray-200">業界から探す</h3>
              <div className="flex flex-wrap gap-2">
                {allIndustries.map(c => (
                    <button 
                        key={c} 
                        onClick={() => handleCategoryClick(c, 'industry')}
                        className="bg-[#BAD7E9] text-[#2B3467] px-3 py-1 text-sm rounded-full hover:bg-opacity-80 dark:bg-blue-900/50 dark:text-blue-300"
                    >
                        {c}
                    </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 dark:text-gray-200">目的から探す</h3>
              <div className="flex flex-wrap gap-2">
                {allPurposes.map(c => (
                    <button 
                        key={c} 
                        onClick={() => handleCategoryClick(c, 'purpose')}
                        className="bg-[#BAD7E9] text-[#2B3467] px-3 py-1 text-sm rounded-full hover:bg-opacity-80 dark:bg-blue-900/50 dark:text-blue-300"
                    >
                        {c}
                    </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-2 dark:text-gray-200">最近見た補助金</h3>
              <ul className="list-disc list-inside dark:text-gray-400">
                {recentViewed.map(r => <li key={r.id}><Link to={`/subsidies/${r.id}`} className="text-[#2B3467] hover:underline dark:text-blue-400">{r.name}</Link></li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
