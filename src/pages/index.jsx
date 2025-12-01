import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Home from "./Home";

import Features from "./Features";

import Agencies from "./Agencies";

import Resources from "./Resources";

import GeneralLedger from "./GeneralLedger";

import AccountsPayable from "./AccountsPayable";

import AccountsReceivable from "./AccountsReceivable";

import BankReconciliation from "./BankReconciliation";

import GSTReports from "./GSTReports";

import AIInsights from "./AIInsights";

import Payments from "./Payments";

import CashflowForecast from "./CashflowForecast";

import ClientManagement from "./ClientManagement";

import Settings from "./Settings";

import MobileApp from "./MobileApp";

import Blog from "./Blog";

import UserDashboard from "./UserDashboard";

import CRM from "./CRM";

import Inventory from "./Inventory";

import WalletManagement from "./WalletManagement";

import SuperAdmin from "./SuperAdmin";

import POS from "./POS";

import BlockchainAudit from "./BlockchainAudit";

import ESGDashboard from "./ESGDashboard";

import PDPACompliance from "./PDPACompliance";

import Sales from "./Sales";

import Marketing from "./Marketing";

import Procurement from "./Procurement";

import ProjectManagement from "./ProjectManagement";

import Documents from "./Documents";

import Cybersecurity from "./Cybersecurity";

import WebBuilder from "./WebBuilder";

import Affiliate from "./Affiliate";

import VendorManagement from "./VendorManagement";

import QuotationManagement from "./QuotationManagement";

import GRN from "./GRN";

import Calendar from "./Calendar";

import Workflows from "./Workflows";

import ServiceDesk from "./ServiceDesk";

import HRManagement from "./HRManagement";

import AssetManagement from "./AssetManagement";

import ContractManagement from "./ContractManagement";

import BudgetPlanning from "./BudgetPlanning";

import HRKPIDashboard from "./HRKPIDashboard";

import KPIAdminDashboard from "./KPIAdminDashboard";

import ARKSchedule from "./ARKSchedule";

import ProjectHub from "./ProjectHub";

import DynamicDashboard from "./DynamicDashboard";

import QuantumCredits from "./QuantumCredits";

import UserManagement from "./UserManagement";

import SalesQuotation from "./SalesQuotation";

import SalesOrder from "./SalesOrder";

import SalesDelivery from "./SalesDelivery";

import SalesInvoice from "./SalesInvoice";

import SalesPayment from "./SalesPayment";

import Landing from "./Landing";

import InvoiceNow from "./InvoiceNow";

import InvoiceNowSettings from "./InvoiceNowSettings";

import InvoiceNowCounterparties from "./InvoiceNowCounterparties";

import RWADashboard from "./RWADashboard";

import RWABlockchain from "./RWABlockchain";

import RWAWallets from "./RWAWallets";

import RWAMembership from "./RWAMembership";

import RWADistribution from "./RWADistribution";

import RWAWeights from "./RWAWeights";

import RWAAIModules from "./RWAAIModules";

import RWAShield from "./RWAShield";

import RWAPartnerIntegrations from "./RWAPartnerIntegrations";

import RWAReports from "./RWAReports";

import InvestorDashboard from "./InvestorDashboard";

import RWATokenisation from "./RWATokenisation";

import AIPerformanceDashboard from "./AIPerformanceDashboard";

import RWASettings from "./RWASettings";

import Customers from "./Customers";

import SalesDashboard from "./SalesDashboard";

import Invoices from "./Invoices";

import Clients from "./Clients";

import Opportunities from "./Opportunities";

import Projects from "./Projects";

import ProjectReports from "./ProjectReports";

import GovIntegration from "./GovIntegration";

import HighValueDealFlow from "./HighValueDealFlow";

import AppInstaller from "./AppInstaller";

import AppManager from "./AppManager";

import AuditLogs from "./AuditLogs";

import SmartDMS from "./SmartDMS";

import Payroll from "./Payroll";

import BlockchainAuditDetail from "./BlockchainAuditDetail";

import MarketingDashboard from "./MarketingDashboard";

import CustomerProfile360 from "./CustomerProfile360";

import CampaignBuilder from "./CampaignBuilder";

import GiftManager from "./GiftManager";

import CSRPortal from "./CSRPortal";

import SystemArtifacts from "./SystemArtifacts";

import SMEOnboarding from "./SMEOnboarding";

import CrowdfundProject from "./CrowdfundProject";

import AdCampaigns from "./AdCampaigns";

import AffiliateCenter from "./AffiliateCenter";

import WorkflowAutomation from "./WorkflowAutomation";

import Gamification from "./Gamification";

import SystemHealth from "./SystemHealth";

import AIReporting from "./AIReporting";

import PaymentSimulator from "./PaymentSimulator";

import AIInsightDetail from "./AIInsightDetail";

import TransactionDetail from "./TransactionDetail";

import WorkflowNodeDetail from "./WorkflowNodeDetail";

import NotificationSettings from "./NotificationSettings";

import PredictiveAnalytics from "./PredictiveAnalytics";

import AdsManager from "./AdsManager";

import AdvertiserPortal from "./AdvertiserPortal";

import AdAnalyticsDashboard from "./AdAnalyticsDashboard";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Home: Home,
    
    Features: Features,
    
    Agencies: Agencies,
    
    Resources: Resources,
    
    GeneralLedger: GeneralLedger,
    
    AccountsPayable: AccountsPayable,
    
    AccountsReceivable: AccountsReceivable,
    
    BankReconciliation: BankReconciliation,
    
    GSTReports: GSTReports,
    
    AIInsights: AIInsights,
    
    Payments: Payments,
    
    CashflowForecast: CashflowForecast,
    
    ClientManagement: ClientManagement,
    
    Settings: Settings,
    
    MobileApp: MobileApp,
    
    Blog: Blog,
    
    UserDashboard: UserDashboard,
    
    CRM: CRM,
    
    Inventory: Inventory,
    
    WalletManagement: WalletManagement,
    
    SuperAdmin: SuperAdmin,
    
    POS: POS,
    
    BlockchainAudit: BlockchainAudit,
    
    ESGDashboard: ESGDashboard,
    
    PDPACompliance: PDPACompliance,
    
    Sales: Sales,
    
    Marketing: Marketing,
    
    Procurement: Procurement,
    
    ProjectManagement: ProjectManagement,
    
    Documents: Documents,
    
    Cybersecurity: Cybersecurity,
    
    WebBuilder: WebBuilder,
    
    Affiliate: Affiliate,
    
    VendorManagement: VendorManagement,
    
    QuotationManagement: QuotationManagement,
    
    GRN: GRN,
    
    Calendar: Calendar,
    
    Workflows: Workflows,
    
    ServiceDesk: ServiceDesk,
    
    HRManagement: HRManagement,
    
    AssetManagement: AssetManagement,
    
    ContractManagement: ContractManagement,
    
    BudgetPlanning: BudgetPlanning,
    
    HRKPIDashboard: HRKPIDashboard,
    
    KPIAdminDashboard: KPIAdminDashboard,
    
    ARKSchedule: ARKSchedule,
    
    ProjectHub: ProjectHub,
    
    DynamicDashboard: DynamicDashboard,
    
    QuantumCredits: QuantumCredits,
    
    UserManagement: UserManagement,
    
    SalesQuotation: SalesQuotation,
    
    SalesOrder: SalesOrder,
    
    SalesDelivery: SalesDelivery,
    
    SalesInvoice: SalesInvoice,
    
    SalesPayment: SalesPayment,
    
    Landing: Landing,
    
    InvoiceNow: InvoiceNow,
    
    InvoiceNowSettings: InvoiceNowSettings,
    
    InvoiceNowCounterparties: InvoiceNowCounterparties,
    
    RWADashboard: RWADashboard,
    
    RWABlockchain: RWABlockchain,
    
    RWAWallets: RWAWallets,
    
    RWAMembership: RWAMembership,
    
    RWADistribution: RWADistribution,
    
    RWAWeights: RWAWeights,
    
    RWAAIModules: RWAAIModules,
    
    RWAShield: RWAShield,
    
    RWAPartnerIntegrations: RWAPartnerIntegrations,
    
    RWAReports: RWAReports,
    
    InvestorDashboard: InvestorDashboard,
    
    RWATokenisation: RWATokenisation,
    
    AIPerformanceDashboard: AIPerformanceDashboard,
    
    RWASettings: RWASettings,
    
    Customers: Customers,
    
    SalesDashboard: SalesDashboard,
    
    Invoices: Invoices,
    
    Clients: Clients,
    
    Opportunities: Opportunities,
    
    Projects: Projects,
    
    ProjectReports: ProjectReports,
    
    GovIntegration: GovIntegration,
    
    HighValueDealFlow: HighValueDealFlow,
    
    AppInstaller: AppInstaller,
    
    AppManager: AppManager,
    
    AuditLogs: AuditLogs,
    
    SmartDMS: SmartDMS,
    
    Payroll: Payroll,
    
    BlockchainAuditDetail: BlockchainAuditDetail,
    
    MarketingDashboard: MarketingDashboard,
    
    CustomerProfile360: CustomerProfile360,
    
    CampaignBuilder: CampaignBuilder,
    
    GiftManager: GiftManager,
    
    CSRPortal: CSRPortal,
    
    SystemArtifacts: SystemArtifacts,
    
    SMEOnboarding: SMEOnboarding,
    
    CrowdfundProject: CrowdfundProject,
    
    AdCampaigns: AdCampaigns,
    
    AffiliateCenter: AffiliateCenter,
    
    WorkflowAutomation: WorkflowAutomation,
    
    Gamification: Gamification,
    
    SystemHealth: SystemHealth,
    
    AIReporting: AIReporting,
    
    PaymentSimulator: PaymentSimulator,
    
    AIInsightDetail: AIInsightDetail,
    
    TransactionDetail: TransactionDetail,
    
    WorkflowNodeDetail: WorkflowNodeDetail,
    
    NotificationSettings: NotificationSettings,
    
    PredictiveAnalytics: PredictiveAnalytics,
    
    AdsManager: AdsManager,
    
    AdvertiserPortal: AdvertiserPortal,
    
    AdAnalyticsDashboard: AdAnalyticsDashboard,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Features" element={<Features />} />
                
                <Route path="/Agencies" element={<Agencies />} />
                
                <Route path="/Resources" element={<Resources />} />
                
                <Route path="/GeneralLedger" element={<GeneralLedger />} />
                
                <Route path="/AccountsPayable" element={<AccountsPayable />} />
                
                <Route path="/AccountsReceivable" element={<AccountsReceivable />} />
                
                <Route path="/BankReconciliation" element={<BankReconciliation />} />
                
                <Route path="/GSTReports" element={<GSTReports />} />
                
                <Route path="/AIInsights" element={<AIInsights />} />
                
                <Route path="/Payments" element={<Payments />} />
                
                <Route path="/CashflowForecast" element={<CashflowForecast />} />
                
                <Route path="/ClientManagement" element={<ClientManagement />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/MobileApp" element={<MobileApp />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/UserDashboard" element={<UserDashboard />} />
                
                <Route path="/CRM" element={<CRM />} />
                
                <Route path="/Inventory" element={<Inventory />} />
                
                <Route path="/WalletManagement" element={<WalletManagement />} />
                
                <Route path="/SuperAdmin" element={<SuperAdmin />} />
                
                <Route path="/POS" element={<POS />} />
                
                <Route path="/BlockchainAudit" element={<BlockchainAudit />} />
                
                <Route path="/ESGDashboard" element={<ESGDashboard />} />
                
                <Route path="/PDPACompliance" element={<PDPACompliance />} />
                
                <Route path="/Sales" element={<Sales />} />
                
                <Route path="/Marketing" element={<Marketing />} />
                
                <Route path="/Procurement" element={<Procurement />} />
                
                <Route path="/ProjectManagement" element={<ProjectManagement />} />
                
                <Route path="/Documents" element={<Documents />} />
                
                <Route path="/Cybersecurity" element={<Cybersecurity />} />
                
                <Route path="/WebBuilder" element={<WebBuilder />} />
                
                <Route path="/Affiliate" element={<Affiliate />} />
                
                <Route path="/VendorManagement" element={<VendorManagement />} />
                
                <Route path="/QuotationManagement" element={<QuotationManagement />} />
                
                <Route path="/GRN" element={<GRN />} />
                
                <Route path="/Calendar" element={<Calendar />} />
                
                <Route path="/Workflows" element={<Workflows />} />
                
                <Route path="/ServiceDesk" element={<ServiceDesk />} />
                
                <Route path="/HRManagement" element={<HRManagement />} />
                
                <Route path="/AssetManagement" element={<AssetManagement />} />
                
                <Route path="/ContractManagement" element={<ContractManagement />} />
                
                <Route path="/BudgetPlanning" element={<BudgetPlanning />} />
                
                <Route path="/HRKPIDashboard" element={<HRKPIDashboard />} />
                
                <Route path="/KPIAdminDashboard" element={<KPIAdminDashboard />} />
                
                <Route path="/ARKSchedule" element={<ARKSchedule />} />
                
                <Route path="/ProjectHub" element={<ProjectHub />} />
                
                <Route path="/DynamicDashboard" element={<DynamicDashboard />} />
                
                <Route path="/QuantumCredits" element={<QuantumCredits />} />
                
                <Route path="/UserManagement" element={<UserManagement />} />
                
                <Route path="/SalesQuotation" element={<SalesQuotation />} />
                
                <Route path="/SalesOrder" element={<SalesOrder />} />
                
                <Route path="/SalesDelivery" element={<SalesDelivery />} />
                
                <Route path="/SalesInvoice" element={<SalesInvoice />} />
                
                <Route path="/SalesPayment" element={<SalesPayment />} />
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/InvoiceNow" element={<InvoiceNow />} />
                
                <Route path="/InvoiceNowSettings" element={<InvoiceNowSettings />} />
                
                <Route path="/InvoiceNowCounterparties" element={<InvoiceNowCounterparties />} />
                
                <Route path="/RWADashboard" element={<RWADashboard />} />
                
                <Route path="/RWABlockchain" element={<RWABlockchain />} />
                
                <Route path="/RWAWallets" element={<RWAWallets />} />
                
                <Route path="/RWAMembership" element={<RWAMembership />} />
                
                <Route path="/RWADistribution" element={<RWADistribution />} />
                
                <Route path="/RWAWeights" element={<RWAWeights />} />
                
                <Route path="/RWAAIModules" element={<RWAAIModules />} />
                
                <Route path="/RWAShield" element={<RWAShield />} />
                
                <Route path="/RWAPartnerIntegrations" element={<RWAPartnerIntegrations />} />
                
                <Route path="/RWAReports" element={<RWAReports />} />
                
                <Route path="/InvestorDashboard" element={<InvestorDashboard />} />
                
                <Route path="/RWATokenisation" element={<RWATokenisation />} />
                
                <Route path="/AIPerformanceDashboard" element={<AIPerformanceDashboard />} />
                
                <Route path="/RWASettings" element={<RWASettings />} />
                
                <Route path="/Customers" element={<Customers />} />
                
                <Route path="/SalesDashboard" element={<SalesDashboard />} />
                
                <Route path="/Invoices" element={<Invoices />} />
                
                <Route path="/Clients" element={<Clients />} />
                
                <Route path="/Opportunities" element={<Opportunities />} />
                
                <Route path="/Projects" element={<Projects />} />
                
                <Route path="/ProjectReports" element={<ProjectReports />} />
                
                <Route path="/GovIntegration" element={<GovIntegration />} />
                
                <Route path="/HighValueDealFlow" element={<HighValueDealFlow />} />
                
                <Route path="/AppInstaller" element={<AppInstaller />} />
                
                <Route path="/AppManager" element={<AppManager />} />
                
                <Route path="/AuditLogs" element={<AuditLogs />} />
                
                <Route path="/SmartDMS" element={<SmartDMS />} />
                
                <Route path="/Payroll" element={<Payroll />} />
                
                <Route path="/BlockchainAuditDetail" element={<BlockchainAuditDetail />} />
                
                <Route path="/MarketingDashboard" element={<MarketingDashboard />} />
                
                <Route path="/CustomerProfile360" element={<CustomerProfile360 />} />
                
                <Route path="/CampaignBuilder" element={<CampaignBuilder />} />
                
                <Route path="/GiftManager" element={<GiftManager />} />
                
                <Route path="/CSRPortal" element={<CSRPortal />} />
                
                <Route path="/SystemArtifacts" element={<SystemArtifacts />} />
                
                <Route path="/SMEOnboarding" element={<SMEOnboarding />} />
                
                <Route path="/CrowdfundProject" element={<CrowdfundProject />} />
                
                <Route path="/AdCampaigns" element={<AdCampaigns />} />
                
                <Route path="/AffiliateCenter" element={<AffiliateCenter />} />
                
                <Route path="/WorkflowAutomation" element={<WorkflowAutomation />} />
                
                <Route path="/Gamification" element={<Gamification />} />
                
                <Route path="/SystemHealth" element={<SystemHealth />} />
                
                <Route path="/AIReporting" element={<AIReporting />} />
                
                <Route path="/PaymentSimulator" element={<PaymentSimulator />} />
                
                <Route path="/AIInsightDetail" element={<AIInsightDetail />} />
                
                <Route path="/TransactionDetail" element={<TransactionDetail />} />
                
                <Route path="/WorkflowNodeDetail" element={<WorkflowNodeDetail />} />
                
                <Route path="/NotificationSettings" element={<NotificationSettings />} />
                
                <Route path="/PredictiveAnalytics" element={<PredictiveAnalytics />} />
                
                <Route path="/AdsManager" element={<AdsManager />} />
                
                <Route path="/AdvertiserPortal" element={<AdvertiserPortal />} />
                
                <Route path="/AdAnalyticsDashboard" element={<AdAnalyticsDashboard />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}