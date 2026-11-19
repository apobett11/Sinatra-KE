// Centralized Design Tokens sampled directly from reference images
export const THEME_TOKENS = {
  dark: {
    pageBg: '#0b141f', // Deep navy/charcoal background
    headerBg: '#09121d', // Dark header surface
    announcementBg: '#0a131e', // Announcement bar background
    announcementBorder: '#1e293b',
    announcementText: '#f1f5f9',
    sectionBg: '#0e1825', // Slightly differentiated section background
    surfaceElevated: '#101b28', // Elevated dark cards/menus/drawers
    surfaceHover: '#162334',
    border: '#19273a',
    borderSubtle: '#141e2d',
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    
    // Standard Product Card (White surface matching reference)
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    cardTextPrimary: '#0f172a',
    cardTextSecondary: '#475569',
    cardTextMuted: '#94a3b8',
    cardImageBg: '#f8fafc',
    cardShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.25), 0 2px 6px -1px rgba(0, 0, 0, 0.15)',
    
    // Category chips
    chipBg: '#121c2a',
    chipBorder: '#1e2d40',
    chipText: '#ffffff',
    chipIcon: '#fe8547',
    
    // Bottom Nav
    bottomNavBg: '#09121d',
    bottomNavBorder: '#182433',
    bottomNavActive: '#ea580c',
    bottomNavInactive: '#f1f5f9',
    
    // Banners
    bannerBg: 'linear-gradient(90deg, #09121d 0%, #15202e 50%, #09121d 100%)',
    bannerBorder: '#f97316',
    
    // Gradients
    heroBg: 'linear-gradient(180deg, #09121d 0%, #0b141f 40%, #0d1826 100%)',
  },
  light: {
    pageBg: '#faf4ee', // Warm ivory/linen base
    headerBg: '#faf5f0', // Header surface
    announcementBg: '#f1dcc8', // Warm peach announcement bar
    announcementBorder: '#e8ceba',
    announcementText: '#18181b',
    sectionBg: '#f5efe8',
    surfaceElevated: '#ffffff',
    surfaceHover: '#f8f4ee',
    border: '#ede4d8',
    borderSubtle: '#f3ece3',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    
    // Standard Product Card
    cardBg: '#ffffff',
    cardBorder: '#ede4d8',
    cardTextPrimary: '#0f172a',
    cardTextSecondary: '#475569',
    cardTextMuted: '#94a3b8',
    cardImageBg: '#f8fafc',
    cardShadow: '0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
    
    // Category chips
    chipBg: '#f3eae0',
    chipBorder: '#e8dccf',
    chipText: '#18181b',
    chipIcon: '#18181b',
    
    // Bottom Nav
    bottomNavBg: '#f8f2ed',
    bottomNavBorder: '#ede4d8',
    bottomNavActive: '#c85428',
    bottomNavInactive: '#18181b',
    
    // Banners
    bannerBg: 'linear-gradient(90deg, #f5dfcd 0%, #eed2ba 100%)',
    bannerBorder: '#e5cdb9',
    
    // Gradients
    heroBg: 'linear-gradient(180deg, #faf5f0 0%, #faf4ee 50%, #f7efe6 100%)',
  },
  shared: {
    terracotta: '#c85428',
    terracottaLight: '#d95d34',
    terracottaDark: '#b3441e',
    terracottaGradient: 'linear-gradient(180deg, #d95d34 0%, #c14f29 100%)',
    gold: '#f59e0b',
    blueBadge: '#0d72ea',
    redBadge: '#dc2626',
    orangeBadge: '#ea580c',
    cartBadgeRed: '#ef4444',
  },
};
