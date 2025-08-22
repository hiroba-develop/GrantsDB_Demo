// src/data/db.ts

// --- 型定義 ---
export interface Customer {
  id: number;
  name: string;
  industry: string;
  employees: number;
  location: string;
  issues: string; // 経営課題
}

export interface Subsidy {
    id: number;
    name: string;
    agency: string;
    prefecture: string;
    amount: string;
    rate: string;
    target: string;
    overview: string;
    startDate: string;
    deadline: string;
    url: string;
    industries: string[];
    purposes: string[];
    conditions: string[]; // 申請要件
    documents: string[];
}

export interface CustomerSubsidyRelation {
    customerId: number;
    subsidyId: number;
    status: '提案済' | '申請準備中' | '未提案' | '申請済' | '採択' | '不採択';
    matchRate: number;
}


// --- マスターデータ ---

export let customers: Customer[] = [
  { id: 1, name: '株式会社A', industry: '製造業', employees: 50, location: '東京都', issues: '生産性向上と設備投資' },
  { id: 2, name: '株式会社B', industry: 'IT', employees: 20, location: '大阪府', issues: '新規事業開発と人材確保' },
  { id: 3, name: '株式会社C', industry: '小売業', employees: 100, location: '福岡県', issues: 'DX推進とECサイト強化' },
  { id: 4, name: '株式会社D', industry: '建設業', employees: 35, location: '北海道', issues: '後継者不足と技術継承' },
];

export const subsidies: Subsidy[] = [
    {
        id: 1,
        name: '【北海道根室市】ものづくり補助金',
        agency: '根室市',
        prefecture: '北海道',
        amount: '最大50万円',
        rate: '1/2以内',
        target: '根室市内に事業所を持つ中小企業者',
        overview: '新製品の開発や販路の開拓、既存製品の改良などを行う市内事業者を支援し、地域産業の振興及び雇用の拡大を図る補助金です。',
        startDate: '2025-04-01',
        deadline: '2026-01-30',
        url: 'https://www.city.nemuro.hokkaido.jp/lifeinfo/kakuka/suisankeizaibu/shoukoukankou/gyoumuannai/6/1294.html',
        industries: ['製造業'],
        purposes: ['製品開発', '販路開拓'],
        conditions: ['市内に事業所、店舗を構える中小企業者であること','市税を滞納していないこと','新製品開発、市場開拓、既存製品の改良のいずれかに関する事業であること'],
        documents: ['交付申請書', '事業計画書', '収支予算書', '市税の納税証明書']
    },
    {
        id: 2,
        name: '【東京都北区】IT・IoT導入支援事業補助金',
        agency: '東京都北区',
        prefecture: '東京都',
        amount: '最大100万円',
        rate: '1/2以内',
        target: '北区内に主たる事業所を有する中小企業者',
        overview: '区内中小企業が、生産性向上や経営基盤強化等を図ることを目的として、IT・IoT等のツールを導入する経費の一部を補助します。',
        startDate: '2025-04-01',
        deadline: '2026-02-27',
        url: 'https://www.city.kita.lg.jp/business/industry/1011356/1011509/1011519.html',
        industries: ['全業種'],
        purposes: ['IT化', '生産性向上', 'DX'],
        conditions: ['北区内に主たる事業所を有し、引き続き事業を営む意思があること','法人都民税または特別区民税・都民税を滞納していないこと','IT・IoT相談員との事前相談が必須'],
        documents: ['交付申請書', '企業概要', '導入システムの概要', '納税証明書', '経費の支出明細書']
    },
    {
        id: 3,
        name: '【神奈川県横浜市】中小企業の設備投資（簡易手続き）',
        agency: '横浜市',
        prefecture: '神奈川県',
        amount: '最大100万円',
        rate: '3/4以内',
        target: '横浜市内に事業所を有する中小企業',
        overview: '脱炭素化の取組（省エネ・再エne設備の導入）と併せて、付加価値額（給与総額）を増加させる計画の中小企業を支援します。',
        startDate: '2025-07-01',
        deadline: '2025-10-31',
        url: 'https://www.city.yokohama.lg.jp/business/kigyoshien/keieishien/capex/carbon-kani.html',
        industries: ['全業種'],
        purposes: ['設備投資', '脱炭素', '省エネ'],
        conditions: ['横浜市内に事業所を有すること','脱炭素化と付加価値額増加の両方の目標を達成する計画であること'],
        documents: ['申請書','事業計画書','見積書']
    },
    {
        id: 4,
        name: '【愛知県名古屋市】子ども・子育て支援センター補助金',
        agency: '名古屋市',
        prefecture: '愛知県',
        amount: '事業費による',
        rate: '事業費による',
        target: '名古屋市内において地域子育て支援拠点を運営する法人',
        overview: '地域における子育て支援機能の充実を図るため、子ども・子育て支援センターの運営にかかる経費を補助します。',
        startDate: '2025-04-01',
        deadline: '2025-09-30',
        url: 'https://www.city.nagoya.jp/kodomoseishonen/page/0000163327.html',
        industries: ['福祉', '教育'],
        purposes: ['子育て支援', '地域貢献'],
        conditions: ['市内で地域子育て支援拠点を運営する法人であること','市の定める基準を満たす事業内容であること'],
        documents: ['申請書','事業計画書','収支予算書','法人登記事項証明書']
    },
    {
        id: 5,
        name: '【大阪府】新法民泊施設の環境整備促進事業補助金',
        agency: '大阪府',
        prefecture: '大阪府',
        amount: '最大40万円',
        rate: '1/2以内',
        target: '大阪府内の新法民泊施設の届出事業者及び届出予定事業者',
        overview: '府内の新法民泊施設における、来阪旅行者の利便性や快適性を向上させるための受入対応強化の取組みを支援します。',
        startDate: '2025-07-07',
        deadline: '2026-02-27',
        url: 'https://www.pref.osaka.lg.jp/o070070/toshimiryoku/syukuhaku_hojyo/r7shinpou_hojyo.html',
        industries: ['宿泊業', '観光業'],
        purposes: ['インバウンド', '環境整備'],
        conditions: ['インバウンド受入対応、宿泊客の利便性・満足度向上、災害時対応等に係る事業であること'],
        documents: ['交付申請書','事業計画書','収支予算書']
    },
    {
        id: 6,
        name: '【京都府宇治市】宇治NEXT ACTION 補助金',
        agency: '宇治市',
        prefecture: '京都府',
        amount: '最大50万円',
        rate: '2/3',
        target: '宇治市内に事業所を有する中小企業、小規模事業者等',
        overview: '新たな需要の獲得や、働き方改革・生産性向上など、多様な社会経済活動に対応するための前向きなアクション（取組）を総合的に支援します。',
        startDate: '2025-06-23',
        deadline: '2025-10-31',
        url: 'https://www.city.uji.kyoto.jp/site/ujinext/91170.html',
        industries: ['全業種'],
        purposes: ['経営改善', '生産性向上', '働き方改革'],
        conditions: ['市内に事業所を有すること','新たな取り組みに関する具体的な計画があること'],
        documents: ['申請書','事業計画書','収支予算書']
    },
    {
        id: 7,
        name: '【兵庫県姫路市】中小企業チャレンジ応援事業補助金',
        agency: '姫路市',
        prefecture: '兵庫県',
        amount: '最大100万円',
        rate: '1/2',
        target: '姫路市内に主たる事業所を有する中小企業者',
        overview: '新製品・新技術・新サービスの開発や新たな販路開拓、DXの推進など、新たな事業展開に挑戦する中小企業を支援します。',
        startDate: '2025-04-21',
        deadline: '予算上限まで',
        url: 'https://www.city.himeji.lg.jp/sangyo/0000009322.html',
        industries: ['全業種'],
        purposes: ['新事業展開', 'DX', '販路開拓', '製品開発'],
        conditions: ['市内に主たる事業所があること','新たな事業展開への具体的な計画があること'],
        documents: ['申請書','事業計画書','市税の完納証明書']
    },
    {
        id: 8,
        name: '【広島県広島市】地域防犯カメラ設置補助制度',
        agency: '広島市',
        prefecture: '広島県',
        amount: '1台につき最大30万円',
        rate: '3/4以内',
        target: '町内会・自治会、連合町内会、防犯組合等の地域団体',
        overview: '地域の自主的な防犯活動を促進し、安全で安心なまちづくりを推進するため、地域団体が設置する防犯カメラの経費の一部を補助します。',
        startDate: '2025-04-01',
        deadline: '2025-06-30',
        url: 'https://www.city.hiroshima.lg.jp/living/1035962/1021171/1025679/1020493.html',
        industries: ['地域団体'],
        purposes: ['防犯', '安全対策', '地域貢献'],
        conditions: ['道路、公園等の公共空間を撮影対象とすること'],
        documents: ['事前協議申請書', '補助金交付申請書', '実績報告書']
    },
    {
        id: 9,
        name: '【福岡県福岡市】福岡市ステップアップ助成事業',
        agency: '福岡市',
        prefecture: '福岡県',
        amount: '最大100万円',
        rate: '対象経費による',
        target: '福岡市内に本社を置く創業10年未満の中小企業者等',
        overview: '成長性の高いビジネスプランを持つ創業者に対して、成長のための課題改善に要する資金として補助金を交付する事業です。',
        startDate: '2025-07-16',
        deadline: '2025-09-11',
        url: 'https://www.city.fukuoka.lg.jp/keizai/r-support/sougyou/012_2_2.html',
        industries: ['全業種'],
        purposes: ['創業支援'],
        conditions: ['福岡市内に本社を置く創業10年未満の中小企業者','成長性の高いビジネスプランを持つこと'],
        documents: ['申請書','事業計画書','決算書']
    },
    {
        id: 10,
        name: '【沖縄県那覇市】新商品開発支援事業補助金',
        agency: '那覇市',
        prefecture: '沖縄県',
        amount: '最大50万円',
        rate: '2/3以内',
        target: '那覇市内に主たる事業所を有する中小企業者等',
        overview: '那覇市の地域資源を活用した新商品や新サービスの開発、改良に係る経費の一部を補助します。',
        startDate: '2025-07-01',
        deadline: '2025-09-10',
        url: 'https://www.city.naha.okinawa.jp/business/touroku/nyuusatukoukoku/r7/R7shinshohinhojyo.html',
        industries: ['全業種'],
        purposes: ['製品開発', '地域資源活用'],
        conditions: ['市内に主たる事業所があること','地域資源を活用した開発であること'],
        documents: ['申請書','事業計画書','市税の納税証明書']
    }
];

export let customerSubsidyRelations: CustomerSubsidyRelation[] = [
    // 株式会社A (製造業, 東京都)
    { customerId: 1, subsidyId: 2, status: '提案済', matchRate: 85 },
    { customerId: 1, subsidyId: 3, status: '未提案', matchRate: 70 },

    // 株式会社B (IT, 大阪府)
    { customerId: 2, subsidyId: 5, status: '申請準備中', matchRate: 95 },
    { customerId: 2, subsidyId: 8, status: '未提案', matchRate: 65 },

    // 株式会社C (小売業, 福岡県)
    { customerId: 3, subsidyId: 9, status: '申請済', matchRate: 90 },

    // 株式会社D (建設業, 北海道)
    { customerId: 4, subsidyId: 1, status: '提案済', matchRate: 90 }
];

// --- データ操作関数 (シミュレーション用) ---

export const updateCustomer = (updatedCustomer: Customer) => {
    const index = customers.findIndex(c => c.id === updatedCustomer.id);
    if (index !== -1) {
        customers[index] = updatedCustomer;
    }
    return true;
}

export const deleteCustomer = (customerId: number) => {
    customers = customers.filter(c => c.id !== customerId);
    customerSubsidyRelations = customerSubsidyRelations.filter(r => r.customerId !== customerId);
    return true;
}
