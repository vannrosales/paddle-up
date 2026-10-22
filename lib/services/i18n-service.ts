import { SupportedLanguage } from "@/lib/types";

export interface TranslationDictionary {
  navHome: string;
  navPlayers: string;
  navLeaderboard: string;
  navClubs: string;
  navTournaments: string;
  navPartners: string;
  navCompare: string;
  navDashboard: string;
  heroTagline: string;
  heroSubtitle: string;
  skillRating: string;
  playingRole: string;
  achievements: string;
  endorsements: string;
  matchesLogged: string;
  winRate: string;
  streak: string;
  partnerFinder: string;
  lookingToPlay: string;
  sharePass: string;
  printResume: string;
}

export const DICTIONARIES: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    navHome: "Home",
    navPlayers: "Players",
    navLeaderboard: "Leaderboard",
    navClubs: "Clubs",
    navTournaments: "Tournaments",
    navPartners: "Find Partner",
    navCompare: "Compare",
    navDashboard: "Dashboard",
    heroTagline: "Pickleball Profiling, Achievements & Playing Role.",
    heroSubtitle: "Your verified pickleball identity, declared playing style, tournament records, and community passport in one place.",
    skillRating: "Skill Rating",
    playingRole: "Playing Role",
    achievements: "Achievements & Medals",
    endorsements: "Peer Endorsements",
    matchesLogged: "Matches Logged",
    winRate: "Win Rate",
    streak: "Current Streak",
    partnerFinder: "Partner Finder",
    lookingToPlay: "Looking for Partner",
    sharePass: "Share Pass",
    printResume: "Print Player Resume",
  },
  fil: {
    navHome: "Tahanan",
    navPlayers: "Mga Manlalaro",
    navLeaderboard: "Ranggo",
    navClubs: "Mga Samahan",
    navTournaments: "Torneo",
    navPartners: "Kalaro",
    navCompare: "Paghambingin",
    navDashboard: "Dashboard",
    heroTagline: "Pagkakakilanlan, Medalya at Estilo sa Pickleball.",
    heroSubtitle: "Ang iyong opisyal na rekord, antas ng galing, mga napanalunang torneo, at pasaporte sa komunidad ng pickleball.",
    skillRating: "Antas ng Galing",
    playingRole: "Estilo ng Laro",
    achievements: "Mga Tagumpay at Medalya",
    endorsements: "Patotoo ng Kapwa Manlalaro",
    matchesLogged: "Nalarong Laban",
    winRate: "Porsyento ng Panalo",
    streak: "Kasalukuyang Sunod-sunod",
    partnerFinder: "Hanap Kalaro",
    lookingToPlay: "Naghahanap ng Makakalaro",
    sharePass: "Ibahagi ang Pasaporte",
    printResume: "I-print ang Resume ng Manlalaro",
  },
  zh: {
    navHome: "首页",
    navPlayers: "球员名录",
    navLeaderboard: "排行榜",
    navClubs: "俱乐部",
    navTournaments: "赛事",
    navPartners: "寻找搭档",
    navCompare: "球员对比",
    navDashboard: "个人中心",
    heroTagline: "匹克球球员档案、荣誉与打法定位",
    heroSubtitle: "一站式呈现您的匹克球认证身份、技术等级、赛事奖牌及社区护照。",
    skillRating: "技术等级",
    playingRole: "打法角色",
    achievements: "荣誉与奖牌",
    endorsements: "球友背书",
    matchesLogged: "比赛记录",
    winRate: "胜率",
    streak: "连胜记录",
    partnerFinder: "寻找搭档",
    lookingToPlay: "正在寻找球友",
    sharePass: "分享护照卡",
    printResume: "打印球员简历",
  },
};

export function getDictionary(lang: SupportedLanguage = "en"): TranslationDictionary {
  return DICTIONARIES[lang] || DICTIONARIES.en;
}

