export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export type PrayerItem = {
  id: string;
  name: PrayerName;
  order: number;
  active: boolean;
};

export type PrayerCompletion = {
  id: string;
  studentId: string;
  prayerId: string;
  prayerName: PrayerName;
  date: string; // YYYY-MM-DD
  completedAt: string;
};

export type DuaItem = {
  id: string;
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  reference: string;
  category: string;
  active: boolean;
  createdAt: string;
};

export type StudentDuaAssignment = {
  id: string;
  studentId: string;
  duaId: string;
  assignedAt: string;
  active: boolean;
};

export type DuaCompletion = {
  id: string;
  studentId: string;
  duaId: string;
  date: string; // YYYY-MM-DD
  completedAt: string;
};

export type DhikrItem = {
  id: string;
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  recommendedCount: number;
  reference: string;
  category: string;
  active: boolean;
  createdAt: string;
};

export type StudentDhikrAssignment = {
  id: string;
  studentId: string;
  dhikrId: string;
  assignedAt: string;
  active: boolean;
};

export type DhikrCompletion = {
  id: string;
  studentId: string;
  dhikrId: string;
  date: string; // YYYY-MM-DD
  completedAt: string;
};

export type StudentUserAccount = {
  id: string;
  email: string;
  studentId: string;
  fullName: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type CreateDuaInput = Omit<DuaItem, "id" | "createdAt">;
export type UpdateDuaInput = Partial<CreateDuaInput>;

export type CreateDhikrInput = Omit<DhikrItem, "id" | "createdAt">;
export type UpdateDhikrInput = Partial<CreateDhikrInput>;

export type DayCompletionSummary = {
  date: string;
  prayersTotal: number;
  prayersCompleted: number;
  duasTotal: number;
  duasCompleted: number;
  dhikrsTotal: number;
  dhikrsCompleted: number;
  totalTasks: number;
  totalCompleted: number;
  percentage: number;
};
