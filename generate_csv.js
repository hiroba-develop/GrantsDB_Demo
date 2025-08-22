const fs = require('fs');
const path = require('path');

// --- データ部分を db.ts から直接コピー ---
const subsidies = [
    { 
        id: 1, 
        name: 'ものづくり・商業・サービス生産性向上促進補助金', 
        agency: '全国中小企業団体中央会', 
        overview: '中小企業・小規模事業者等が取り組む革新的な製品・サービスの開発、生産プロセス等の省力化を行い、生産性を向上させるための設備投資等を支援します。',
        amount: '通常枠: 750万～1,250万円',
        rate: '1/2 (小規模・再生: 2/3)',
        deadline: '2025-11-20',
        target: '中小企業・小規模事業者等',
        conditions: ['事業計画期間において、給与支給総額を年率平均1.5%以上増加', '事業場内最低賃金を地域別最低賃金+30円以上に設定', '事業者全体の付か価値額を年率平均3%以上向上'],
        documents: ['事業計画書', '賃金引上計画の誓約書', '決算書（2期分）'],
    },
    { 
        id: 2, 
        name: 'IT導入補助金2025', 
        agency: 'IT導入補助金2025事務局', 
        overview: '中小企業・小規模事業者の労働生産性向上を目的とし、ITツール（ソフトウェア、アプリ、サービス等）の導入費用の一部を補助します。',
        amount: '通常枠: 5万円～150万円未満',
        rate: '1/2以内',
        deadline: '2025-07-31',
        target: '中小企業・小規模事業者等',
        conditions: ['IT導入支援事業者の選定および連携', 'SECURITY ACTIONの実施', 'gBizIDプライムアカウントの取得'],
        documents: ['申請書', '導入するITツールの見積書', '履歴事項全部証明書'],
    },
    { 
        id: 3, 
        name: '事業再構築補助金', 
        agency: '事業再構築補助金事務局', 
        overview: 'ポストコロナ・ウィズコロナ時代の経済社会の変化に対応するため、中小企業等の新分野展開、業態転換、事業・業種転換等を支援します。',
        amount: '成長枠: 最大7,000万円',
        rate: '1/2 (中小企業)',
        deadline: '2026-02-15',
        target: '中小企業等',
        conditions: ['売上高等減少要件を満たすこと', '認定経営革新等支援機関と事業計画を策定', '付加価値額の向上'],
        documents: ['事業計画書', '認定経営革新等支援機関による確認書', '決算書'],
    },
    { 
        id: 4, 
        name: '小規模事業者持続化補助金', 
        agency: '日本商工会議所', 
        overview: '小規模事業者が作成した経営計画に基づき、販路開拓等にかかる費用の一部を補助します。ウェブサイト作成、チラシ作成、店舗改装などが対象です。',
        amount: '通常枠: 最大50万円',
        rate: '2/3',
        deadline: '2025-08-30',
        target: '小規模事業者',
        conditions: ['商工会議所の管轄地域内で事業を営んでいること', '経営計画を策定し、商工会議所の支援を受けながら実施すること'],
        documents: ['経営計画書', '補助事業計画書', '事業支援計画書'],
    },
];
// --- データ部分ここまで ---

function escapeCsvField(field) {
    if (field === null || field === undefined) {
        return '';
    }
    const stringField = String(field);
    if (/[",\n]/.test(stringField)) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
}

const header = ['id', 'name', 'agency', 'overview', 'amount', 'rate', 'deadline', 'target', 'conditions', 'documents'];
const csvRows = [header.join(',')];

subsidies.forEach(subsidy => {
    const row = [
        subsidy.id,
        subsidy.name,
        subsidy.agency,
        subsidy.overview,
        subsidy.amount,
        subsidy.rate,
        subsidy.deadline,
        subsidy.target,
        subsidy.conditions.join('; '),
        subsidy.documents.join('; ')
    ].map(escapeCsvField);
    csvRows.push(row.join(','));
});

const csvContent = csvRows.join('\n');
const filePath = path.join(process.cwd(), 'public', 'subsidies_data.csv');

fs.writeFileSync(filePath, csvContent, 'utf-8');

console.log('CSV file has been created successfully at:', filePath);
