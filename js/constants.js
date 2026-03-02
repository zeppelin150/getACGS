// js/constants.js
window.SITE = {
  company: 'Cambric AI',
  email: 'contact@cambricai.io',
  domain: 'cambricai.io',
};

window.PRODUCTS = [
  {
    id: 'harpax',
    name: 'Harpax',
    tagline: 'Continuous AI Security',
    summary: 'Proactive security monitoring for AI systems. Harpax watches your AI infrastructure continuously, identifying vulnerabilities and anomalous behavior before they become incidents.',
    icon: '\u26A1',
    iconClass: 'icon-harpax',
    features: ['Continuous security posture monitoring', 'Anomaly detection across AI workloads', 'Automated alerting and incident triage', 'Environment-aware adaptive baselines'],
    badges: ['Security', 'Monitoring'],
    description: 'Harpax provides always-on security monitoring purpose-built for AI infrastructure. It continuously scans your AI workloads for vulnerabilities, behavioral anomalies, and configuration drift \u2014 catching threats before they escalate into incidents. Unlike generic security tools, Harpax understands the unique attack surface of AI systems and adapts its baselines to your specific environment.',
    detailedFeatures: [
      { title: 'Continuous Posture Monitoring', description: 'Real-time visibility into the security state of every AI system in your environment. Know exactly where you stand at all times.' },
      { title: 'Anomaly Detection', description: 'ML-powered behavioral analysis that learns what normal looks like for your AI workloads and alerts on deviations before they become breaches.' },
      { title: 'Automated Alerting & Triage', description: 'Intelligent incident prioritization that cuts through noise. Get actionable alerts with full context, not just raw signals.' },
      { title: 'Adaptive Baselines', description: 'Environment-aware security models that evolve with your infrastructure. No more false positives from legitimate operational changes.' },
    ],
    pricing: [
      { tier: 'Free', price: '$0', period: '/mo', features: ['Up to 5 AI workloads', 'Basic anomaly detection', 'Email alerts', 'Community support'], cta: 'Get Started', featured: false },
      { tier: 'Pro', price: '$99', period: '/mo', features: ['Unlimited workloads', 'Advanced anomaly detection', 'Slack & webhook alerts', 'Adaptive baselines', 'Priority support'], cta: 'Start Trial', featured: true },
      { tier: 'Enterprise', price: 'Custom', period: '', features: ['Custom integrations', 'Dedicated security advisor', 'SLA guarantees', 'On-prem deployment', 'SSO & RBAC'], cta: 'Contact Sales', featured: false },
    ],
  },
  {
    id: 'revvit',
    name: 'Revvit',
    tagline: 'Operational Pattern Analytics',
    summary: 'Understand the patterns of life in your business operations. Revvit maps behavioral data across your organization to surface the trends, anomalies, and insights that drive better decisions.',
    icon: '\u25C9',
    iconClass: 'icon-revvit',
    features: ['Multi-source operational data fusion', 'Real-time pattern recognition', 'Anomaly and trend detection', 'Configurable dashboards and alerts'],
    badges: ['Analytics', 'SaaS'],
    description: 'Revvit connects to your operational data sources and maps the behavioral patterns that define how your organization actually works. It surfaces trends, anomalies, and correlations that would be invisible to manual analysis \u2014 giving decision-makers the insight they need to act on what matters.',
    detailedFeatures: [
      { title: 'Multi-Source Data Fusion', description: 'Connect any operational data source \u2014 from APIs to databases to event streams. Revvit normalizes and correlates data automatically.' },
      { title: 'Real-Time Pattern Recognition', description: 'Continuously identifies recurring behavioral patterns, seasonal trends, and emerging anomalies across your entire data landscape.' },
      { title: 'Anomaly & Trend Detection', description: 'Statistical and ML-based detection that distinguishes meaningful signals from noise. Catch what matters, ignore what doesn\u2019t.' },
      { title: 'Configurable Dashboards', description: 'Build dashboards tailored to your operations. Share insights across teams with role-based views and automated reporting.' },
    ],
    pricing: [
      { tier: 'Starter', price: '$0', period: '/mo', features: ['Up to 3 data sources', 'Basic dashboards', 'Daily digest reports', 'Community support'], cta: 'Get Started', featured: false },
      { tier: 'Pro', price: '$149', period: '/mo', features: ['Unlimited data sources', 'Real-time dashboards', 'Custom alerts', 'API access', 'Priority support'], cta: 'Start Trial', featured: true },
      { tier: 'Enterprise', price: 'Custom', period: '', features: ['Custom integrations', 'Dedicated analyst', 'SLA guarantees', 'On-prem option', 'SSO & RBAC'], cta: 'Contact Sales', featured: false },
    ],
  },
  {
    id: 'quinte',
    name: 'Quinte',
    tagline: 'Dynamic & Integrated Neural Networks and Personality Constructs',
    summary: 'Tooling for consolidating and managing AI personality constructs. Quinte helps organizations integrate, audit, and govern the behavioral layer of their AI systems.',
    icon: '\u29BF',
    iconClass: 'icon-quinte',
    features: [],
    badges: ['AI Governance', 'Research'],
    description: 'Quinte is our research-stage platform for managing the behavioral and personality layers of AI systems. As AI agents become more autonomous, organizations need tools to define, audit, and govern how those agents behave. Quinte provides that governance infrastructure.',
    detailedFeatures: [],
    pricing: [],
  }
];

window.BLOG_POSTS = [
  {
    title: 'Why AI Security Monitoring Needs a New Approach',
    date: 'February 2025',
    excerpt: 'Traditional security tools weren\u2019t built for AI workloads. We explore why continuous, adaptive monitoring is essential for the AI era.',
    url: 'https://cambricai.substack.com',
  },
  {
    title: 'Introducing Operational Pattern Analytics',
    date: 'January 2025',
    excerpt: 'How behavioral data analysis can transform the way organizations understand their operations \u2014 and why existing BI tools fall short.',
    url: 'https://cambricai.substack.com',
  },
  {
    title: 'The Case for AI Governance Infrastructure',
    date: 'January 2025',
    excerpt: 'As AI systems become more autonomous, the need for governance tooling grows. Here\u2019s why we\u2019re building it now.',
    url: 'https://cambricai.substack.com',
  },
];

window.TESTIMONIALS = [
  {
    quote: 'Harpax gave us visibility into our AI security posture that we simply didn\u2019t have before. The adaptive baselines alone saved our team hours of false-positive triage every week.',
    name: 'Sarah Chen',
    role: 'CISO',
    company: 'Meridian Systems',
  },
  {
    quote: 'Revvit surfaced operational patterns we had no idea existed. Within the first month, we identified three process bottlenecks that were costing us real money.',
    name: 'Marcus Webb',
    role: 'VP of Operations',
    company: 'Vantage Analytics',
  },
  {
    quote: 'The team at Cambric AI understands the problem space deeply. Their tools are practical, well-engineered, and built for production \u2014 not just demos.',
    name: 'Dr. Anya Patel',
    role: 'Head of AI',
    company: 'Northbridge Labs',
  },
  {
    quote: 'We evaluated half a dozen security monitoring solutions before choosing Harpax. Nothing else understood the AI-specific attack surface the way Cambric does.',
    name: 'James Okafor',
    role: 'Engineering Director',
    company: 'Stratos Cloud',
  },
];
