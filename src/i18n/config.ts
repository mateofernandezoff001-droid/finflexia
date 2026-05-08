import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        welcome: 'Welcome',
        dashboard: 'Dashboard',
        investments: 'Investments',
        wallet: 'Wallet',
        ai_assistant: 'AI Assistant',
        admin: 'Admin',
        logout: 'Sign Out',
        search: 'Search assets...',
        buy: 'Buy',
        sell: 'Sell',
        balance: 'Total Balance',
        profit: 'Profit / Loss',
        equity: 'Equity',
        margin: 'Margin',
      },
      dashboard: {
        greeting: 'Good morning',
        summary: 'Here is your financial activity summary.',
        market_pulse: 'Market Pulse',
        activity_log: 'Activity Log',
      },
      nav: {
        features: 'Features',
        security: 'Security',
        developers: 'Developers',
        company: 'Company',
        signin: 'Sign In',
        get_started: 'Get Started'
      },
      features_page: {
        title: 'Platform Capabilities',
        subtitle: 'Everything you need to master your financial future.',
        ai: 'Gemini AI Intelligence',
        ai_desc: 'Deep financial analysis and projections powered by advanced neural architecture.',
        trading: 'Simulated Trading',
        trading_desc: 'Risk-free environment to practice strategies with real-time market feeds.',
        wallets: 'Unified Wallets',
        wallets_desc: 'Manage multiple currencies and sub-accounts with zero friction.',
        analytics: 'Visual Analytics',
        analytics_desc: 'Stunning data visualizations of your spending and asset performance.'
      },
      security_page: {
        title: 'Fortress-Grade Security',
        subtitle: 'Protecting your assets with industry-leading protocols.',
        jwt: 'JWT Authentication',
        jwt_desc: 'State-of-the-art tokenized sessions with automatic expiration and refresh cycles.',
        audit: 'Audit Capability',
        audit_desc: 'Full visibility into every transaction and security event across your account.',
        isolation: 'Data Isolation',
        isolation_desc: 'Cryptographic partitioning ensures your data remains exclusively yours.'
      },
      dev_page: {
        title: 'Developer Hub',
        subtitle: 'Build and integrate with the FinFlex ecosystem.',
        doc: 'API Reference',
        doc_desc: 'Comprehensive endpoints for balance queries, trades, and asset monitoring.',
        ws: 'Live WebSockets',
        ws_desc: 'Real-time event streams for market updates and transaction alerts.',
        keys: 'API Keys',
        keys_desc: 'Secure access controls for third-party integrations.'
      },
      company_page: {
        title: 'About FinFlex',
        subtitle: 'The mission to democratize financial intelligence.',
        mission: 'Our Mission',
        mission_desc: 'To provide sophisticated financial tools to everyone, regardless of capital or expertise.',
        roadmap: '2026 Roadmap',
        roadmap_desc: 'Expansion into crypto-native settlements and decentralized credit scoring.'
      }
    }
  },
  es: {
    translation: {
      common: {
        welcome: 'Bienvenido',
        dashboard: 'Panel de Control',
        investments: 'Inversiones',
        wallet: 'Billetera',
        ai_assistant: 'Asistente IA',
        admin: 'Admin',
        logout: 'Cerrar Sesión',
        search: 'Buscar activos...',
        buy: 'Comprar',
        sell: 'Vender',
        balance: 'Balance Total',
        profit: 'Ganancia / Pérdida',
        equity: 'Patrimonio',
        margin: 'Margen',
      },
      dashboard: {
        greeting: 'Buenos días',
        summary: 'Aquí tienes el resumen de tu actividad financiera.',
        market_pulse: 'Pulso del Mercado',
        activity_log: 'Registro de Actividad',
      },
      nav: {
        features: 'Funciones',
        security: 'Seguridad',
        developers: 'Desarrolladores',
        company: 'Empresa',
        signin: 'Iniciar Sesión',
        get_started: 'Empezar'
      },
      features_page: {
        title: 'Capacidades de la Plataforma',
        subtitle: 'Todo lo que necesitas para dominar tu futuro financiero.',
        ai: 'Inteligencia IA Gemini',
        ai_desc: 'Análisis financiero profundo y proyecciones impulsadas por arquitectura neuronal avanzada.',
        trading: 'Trading Simulado',
        trading_desc: 'Entorno sin riesgo para practicar estrategias con feeds de mercado en tiempo real.',
        wallets: 'Billeteras Unificadas',
        wallets_desc: 'Gestiona múltiples divisas y subcuentas sin fricciones.',
        analytics: 'Analítica Visual',
        analytics_desc: 'Visualizaciones de datos impresionantes de tus gastos y rendimiento de activos.'
      },
      security_page: {
        title: 'Seguridad de Grado Fortaleza',
        subtitle: 'Protegiendo tus activos con protocolos líderes en la industria.',
        jwt: 'Autenticación JWT',
        jwt_desc: 'Sesiones tokenizadas de última generación con ciclos automáticos de expiración y refresco.',
        audit: 'Capacidad de Auditoría',
        audit_desc: 'Visibilidad completa de cada transacción y evento de seguridad en tu cuenta.',
        isolation: 'Aislamiento de Datos',
        isolation_desc: 'Particionamiento criptográfico asegura que tus datos sigan siendo exclusivamente tuyos.'
      },
      dev_page: {
        title: 'Hub de Desarrolladores',
        subtitle: 'Construye e integra con el ecosistema FinFlex.',
        doc: 'Referencia de API',
        doc_desc: 'Endpoints completos para consultas de saldo, trades y monitoreo de activos.',
        ws: 'WebSockets en Vivo',
        ws_desc: 'Streams de eventos en tiempo real para actualizaciones de mercado y alertas de transacciones.',
        keys: 'Claves de API',
        keys_desc: 'Controles de acceso seguro para integraciones de terceros.'
      },
      company_page: {
        title: 'Acerca de FinFlex',
        subtitle: 'La misión de democratizar la inteligencia financiera.',
        mission: 'Nuestra Misión',
        mission_desc: 'Proporcionar herramientas financieras sofisticadas a todos, independientemente del capital o experiencia.',
        roadmap: 'Hoja de Ruta 2026',
        roadmap_desc: 'Expansión hacia liquidaciones cripto-nativas y calificación crediticia descentralizada.'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
