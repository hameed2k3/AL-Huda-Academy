import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth-crypto";
import { ensureSeedData } from "@/lib/admin-repository";
import type {
  PrayerItem,
  PrayerCompletion,
  DuaItem,
  StudentDuaAssignment,
  DuaCompletion,
  DhikrItem,
  StudentDhikrAssignment,
  DhikrCompletion,
  CreateDuaInput,
  UpdateDuaInput,
  CreateDhikrInput,
  UpdateDhikrInput,
  DayCompletionSummary,
} from "@/lib/ibadah-types";

export type UserDocument = {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  role: "admin" | "student";
  studentId?: string | null;
  status: "active" | "inactive";
  createdAt: string;
};

type PrayerDocument = Omit<PrayerItem, "id"> & { _id?: ObjectId };
type PrayerCompletionDoc = Omit<PrayerCompletion, "id"> & { _id?: ObjectId };
type DuaDocument = Omit<DuaItem, "id"> & { _id?: ObjectId };
type StudentDuaDoc = Omit<StudentDuaAssignment, "id"> & { _id?: ObjectId };
type DuaCompletionDoc = Omit<DuaCompletion, "id"> & { _id?: ObjectId };
type DhikrDocument = Omit<DhikrItem, "id"> & { _id?: ObjectId };
type StudentDhikrDoc = Omit<StudentDhikrAssignment, "id"> & { _id?: ObjectId };
type DhikrCompletionDoc = Omit<DhikrCompletion, "id"> & { _id?: ObjectId };

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function getIbadahCollections() {
  const db = await getMongoDb();

  return {
    users: db.collection<UserDocument>("users"),
    prayers: db.collection<PrayerDocument>("prayers"),
    prayerCompletions: db.collection<PrayerCompletionDoc>("prayer_completions"),
    duas: db.collection<DuaDocument>("duas"),
    studentDuas: db.collection<StudentDuaDoc>("student_duas"),
    duaCompletions: db.collection<DuaCompletionDoc>("dua_completions"),
    dhikrs: db.collection<DhikrDocument>("dhikrs"),
    studentDhikrs: db.collection<StudentDhikrDoc>("student_dhikrs"),
    dhikrCompletions: db.collection<DhikrCompletionDoc>("dhikr_completions"),
    students: db.collection("students"),
    courses: db.collection("courses"),
    certificates: db.collection("certificates"),
  };
}

let hasEnsuredIbadahSeed = false;
let ibadahSeedPromise: Promise<void> | null = null;

export async function ensureIbadahSeedData() {
  if (hasEnsuredIbadahSeed) return;
  if (!ibadahSeedPromise) {
    ibadahSeedPromise = (async () => {
      await ensureSeedData();
      const { prayers, duas, dhikrs, users, students } = await getIbadahCollections();

  // 1. Seed Prayers
  const prayerCount = await prayers.countDocuments();
  if (prayerCount === 0) {
    const defaultPrayers: Omit<PrayerDocument, "_id">[] = [
      { name: "Fajr", order: 1, active: true },
      { name: "Dhuhr", order: 2, active: true },
      { name: "Asr", order: 3, active: true },
      { name: "Maghrib", order: 4, active: true },
      { name: "Isha", order: 5, active: true },
    ];
    await prayers.insertMany(defaultPrayers);
  }

  // 2. Seed Duas
  const duaCount = await duas.countDocuments();
  if (duaCount === 0) {
    const defaultDuas: Omit<DuaDocument, "_id">[] = [
      {
        title: "Dua Before Eating",
        arabicText: "بِسْمِ اللَّهِ",
        transliteration: "Bismillah",
        translation: "In the name of Allah.",
        reference: "Sahih al-Bukhari 5376",
        category: "Daily Life",
        active: true,
        createdAt: "2026-01-01",
      },
      {
        title: "Dua After Eating",
        arabicText: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
        translation: "All praise is due to Allah Who gave me this food and provided it for me without any power or strength on my part.",
        reference: "Sunan Abi Dawud 4023",
        category: "Daily Life",
        active: true,
        createdAt: "2026-01-01",
      },
      {
        title: "Dua Before Sleeping",
        arabicText: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ",
        transliteration: "Bismika Rabbi wada'tu janbi wa bika arfa'uh",
        translation: "In Your name my Lord, I lie down and in Your name I rise.",
        reference: "Sahih al-Bukhari 6320",
        category: "Bedtime",
        active: true,
        createdAt: "2026-01-01",
      },
      {
        title: "Dua for Knowledge",
        arabicText: "رَّبِّ زِدْنِي عِلْمًا",
        transliteration: "Rabbi zidni 'ilma",
        translation: "My Lord, increase me in knowledge.",
        reference: "Surah Taha (20:114)",
        category: "Learning",
        active: true,
        createdAt: "2026-01-01",
      },
      {
        title: "Dua for Parents",
        arabicText: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        transliteration: "Rabbir-hamhuma kama rabbayani sagheera",
        translation: "My Lord, have mercy upon them as they brought me up when I was small.",
        reference: "Surah Al-Isra (17:24)",
        category: "Family",
        active: true,
        createdAt: "2026-01-01",
      },
    ];
    await duas.insertMany(defaultDuas);
  }

  // 3. Seed Dhikrs
  const dhikrCount = await dhikrs.countDocuments();
  if (dhikrCount === 0) {
    const defaultDhikrs: Omit<DhikrDocument, "_id">[] = [
      {
        title: "Astaghfirullah (Seeking Forgiveness)",
        arabicText: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
        transliteration: "Astaghfirullah wa atoobu ilayh",
        translation: "I seek forgiveness of Allah and repent to Him.",
        recommendedCount: 100,
        reference: "Sahih al-Bukhari 6307",
        category: "Daily Remembrance",
        active: true,
        createdAt: "2026-01-01",
      },
      {
        title: "SubhanAllah wa Bihamdihi",
        arabicText: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        transliteration: "Subhan Allahi wa bihamdihi, Subhan Allahil Azeem",
        translation: "Glory be to Allah and His is the praise, Glory be to Allah the Greatest.",
        recommendedCount: 33,
        reference: "Sahih Muslim 2691",
        category: "Morning / Evening",
        active: true,
        createdAt: "2026-01-01",
      },
      {
        title: "Ayat al-Kursi (After Obligatory Prayer)",
        arabicText: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
        transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum",
        translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence.",
        recommendedCount: 1,
        reference: "Sunan an-Nasa'i 9928",
        category: "Post Prayer",
        active: true,
        createdAt: "2026-01-01",
      },
    ];
    await dhikrs.insertMany(defaultDhikrs);
  }

  // 4. Ensure Admin User exists in DB if environment variables provided
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPass) {
    const existingAdmin = await users.findOne({ email: adminEmail, role: "admin" });
    if (!existingAdmin) {
      await users.insertOne({
        email: adminEmail,
        passwordHash: hashPassword(adminPass),
        role: "admin",
        studentId: null,
        status: "active",
        createdAt: todayDate(),
      });
    }
  }

  // 5. Ensure Student User Accounts exist for seeded students
  const studentDocs = await students.find().toArray();
  const defaultPasswordHash = hashPassword("student123");

  for (const s of studentDocs) {
    if (s.email) {
      const existingUser = await users.findOne({ email: s.email.toLowerCase() });
      if (!existingUser) {
        await users.insertOne({
          email: s.email.toLowerCase(),
          passwordHash: defaultPasswordHash,
          role: "student",
          studentId: s._id.toString(),
          status: "active",
          createdAt: todayDate(),
        });
      }
    }
  }

  // 5. Ensure default assignments for students
  const duaDocs = await duas.find({ active: true }).toArray();
  const dhikrDocs = await dhikrs.find({ active: true }).toArray();
  const { studentDuas, studentDhikrs } = await getIbadahCollections();

  for (const s of studentDocs) {
    const sId = s._id.toString();
    const assignedDuaCount = await studentDuas.countDocuments({ studentId: sId });
    if (assignedDuaCount === 0 && duaDocs.length > 0) {
      const initialDuaAssignments = duaDocs.slice(0, 3).map((d) => ({
        studentId: sId,
        duaId: d._id.toString(),
        assignedAt: todayDate(),
        active: true,
      }));
      await studentDuas.insertMany(initialDuaAssignments);
    }

    const assignedDhikrCount = await studentDhikrs.countDocuments({ studentId: sId });
    if (assignedDhikrCount === 0 && dhikrDocs.length > 0) {
      const initialDhikrAssignments = dhikrDocs.map((d) => ({
        studentId: sId,
        dhikrId: d._id.toString(),
        assignedAt: todayDate(),
        active: true,
      }));
      await studentDhikrs.insertMany(initialDhikrAssignments);
    }
  }
      hasEnsuredIbadahSeed = true;
    })();
  }
  return ibadahSeedPromise;
}

// ----------------------------------------------------------------------
// Prayer Functions
// ----------------------------------------------------------------------

export async function listPrayers(): Promise<PrayerItem[]> {
  await ensureIbadahSeedData();
  const { prayers } = await getIbadahCollections();
  const docs = await prayers.find().sort({ order: 1 }).toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    name: d.name,
    order: d.order,
    active: d.active,
  }));
}

export async function getStudentPrayerCompletions(studentId: string, date: string): Promise<PrayerCompletion[]> {
  const { prayerCompletions } = await getIbadahCollections();
  const docs = await prayerCompletions.find({ studentId, date }).toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    studentId: d.studentId,
    prayerId: d.prayerId,
    prayerName: d.prayerName,
    date: d.date,
    completedAt: d.completedAt,
  }));
}

export async function togglePrayerCompletion(
  studentId: string,
  prayerId: string,
  date: string,
): Promise<{ completed: boolean }> {
  await ensureIbadahSeedData();
  const { prayers, prayerCompletions } = await getIbadahCollections();
  const prayer = await prayers.findOne({ _id: new ObjectId(prayerId) });
  if (!prayer) throw new Error("Prayer not found.");

  const existing = await prayerCompletions.findOne({ studentId, prayerId, date });

  if (existing) {
    await prayerCompletions.deleteOne({ _id: existing._id });
    return { completed: false };
  } else {
    await prayerCompletions.insertOne({
      studentId,
      prayerId,
      prayerName: prayer.name,
      date,
      completedAt: new Date().toISOString(),
    });
    return { completed: true };
  }
}

// ----------------------------------------------------------------------
// Dua Functions
// ----------------------------------------------------------------------

export async function listAllDuas(): Promise<DuaItem[]> {
  await ensureIbadahSeedData();
  const { duas } = await getIbadahCollections();
  const docs = await duas.find().sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    arabicText: d.arabicText,
    transliteration: d.transliteration,
    translation: d.translation,
    reference: d.reference,
    category: d.category,
    active: d.active,
    createdAt: d.createdAt,
  }));
}

export async function createDua(input: CreateDuaInput): Promise<DuaItem> {
  const { duas } = await getIbadahCollections();
  const res = await duas.insertOne({
    ...input,
    createdAt: todayDate(),
  });
  const doc = await duas.findOne({ _id: res.insertedId });
  if (!doc) throw new Error("Failed to create Dua.");
  return {
    id: doc._id.toString(),
    title: doc.title,
    arabicText: doc.arabicText,
    transliteration: doc.transliteration,
    translation: doc.translation,
    reference: doc.reference,
    category: doc.category,
    active: doc.active,
    createdAt: doc.createdAt,
  };
}

export async function updateDua(id: string, input: UpdateDuaInput): Promise<DuaItem> {
  const { duas } = await getIbadahCollections();
  const _id = new ObjectId(id);
  await duas.updateOne({ _id }, { $set: input });
  const doc = await duas.findOne({ _id });
  if (!doc) throw new Error("Dua not found.");
  return {
    id: doc._id.toString(),
    title: doc.title,
    arabicText: doc.arabicText,
    transliteration: doc.transliteration,
    translation: doc.translation,
    reference: doc.reference,
    category: doc.category,
    active: doc.active,
    createdAt: doc.createdAt,
  };
}

export async function deleteDua(id: string): Promise<void> {
  const { duas, studentDuas, duaCompletions } = await getIbadahCollections();
  const _id = new ObjectId(id);
  await studentDuas.deleteMany({ duaId: id });
  await duaCompletions.deleteMany({ duaId: id });
  await duas.deleteOne({ _id });
}

export async function getStudentAssignedDuas(studentId: string): Promise<DuaItem[]> {
  await ensureIbadahSeedData();
  const { studentDuas, duas } = await getIbadahCollections();
  const assignments = await studentDuas.find({ studentId, active: true }).toArray();
  const duaIds = assignments.map((a) => new ObjectId(a.duaId));

  if (duaIds.length === 0) return [];
  const duaDocs = await duas.find({ _id: { $in: duaIds }, active: true }).toArray();

  return duaDocs.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    arabicText: d.arabicText,
    transliteration: d.transliteration,
    translation: d.translation,
    reference: d.reference,
    category: d.category,
    active: d.active,
    createdAt: d.createdAt,
  }));
}

export async function getStudentDuaCompletions(studentId: string, date: string): Promise<DuaCompletion[]> {
  const { duaCompletions } = await getIbadahCollections();
  const docs = await duaCompletions.find({ studentId, date }).toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    studentId: d.studentId,
    duaId: d.duaId,
    date: d.date,
    completedAt: d.completedAt,
  }));
}

export async function toggleDuaCompletion(
  studentId: string,
  duaId: string,
  date: string,
): Promise<{ completed: boolean }> {
  const { duaCompletions } = await getIbadahCollections();
  const existing = await duaCompletions.findOne({ studentId, duaId, date });

  if (existing) {
    await duaCompletions.deleteOne({ _id: existing._id });
    return { completed: false };
  } else {
    await duaCompletions.insertOne({
      studentId,
      duaId,
      date,
      completedAt: new Date().toISOString(),
    });
    return { completed: true };
  }
}

// ----------------------------------------------------------------------
// Dhikr Functions
// ----------------------------------------------------------------------

export async function listAllDhikrs(): Promise<DhikrItem[]> {
  await ensureIbadahSeedData();
  const { dhikrs } = await getIbadahCollections();
  const docs = await dhikrs.find().sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    arabicText: d.arabicText,
    transliteration: d.transliteration,
    translation: d.translation,
    recommendedCount: d.recommendedCount,
    reference: d.reference,
    category: d.category,
    active: d.active,
    createdAt: d.createdAt,
  }));
}

export async function createDhikr(input: CreateDhikrInput): Promise<DhikrItem> {
  const { dhikrs } = await getIbadahCollections();
  const res = await dhikrs.insertOne({
    ...input,
    createdAt: todayDate(),
  });
  const doc = await dhikrs.findOne({ _id: res.insertedId });
  if (!doc) throw new Error("Failed to create Dhikr.");
  return {
    id: doc._id.toString(),
    title: doc.title,
    arabicText: doc.arabicText,
    transliteration: doc.transliteration,
    translation: doc.translation,
    recommendedCount: doc.recommendedCount,
    reference: doc.reference,
    category: doc.category,
    active: doc.active,
    createdAt: doc.createdAt,
  };
}

export async function updateDhikr(id: string, input: UpdateDhikrInput): Promise<DhikrItem> {
  const { dhikrs } = await getIbadahCollections();
  const _id = new ObjectId(id);
  await dhikrs.updateOne({ _id }, { $set: input });
  const doc = await dhikrs.findOne({ _id });
  if (!doc) throw new Error("Dhikr not found.");
  return {
    id: doc._id.toString(),
    title: doc.title,
    arabicText: doc.arabicText,
    transliteration: doc.transliteration,
    translation: doc.translation,
    recommendedCount: doc.recommendedCount,
    reference: doc.reference,
    category: doc.category,
    active: doc.active,
    createdAt: doc.createdAt,
  };
}

export async function deleteDhikr(id: string): Promise<void> {
  const { dhikrs, studentDhikrs, dhikrCompletions } = await getIbadahCollections();
  const _id = new ObjectId(id);
  await studentDhikrs.deleteMany({ dhikrId: id });
  await dhikrCompletions.deleteMany({ dhikrId: id });
  await dhikrs.deleteOne({ _id });
}

export async function getStudentAssignedDhikrs(studentId: string): Promise<DhikrItem[]> {
  await ensureIbadahSeedData();
  const { studentDhikrs, dhikrs } = await getIbadahCollections();
  const assignments = await studentDhikrs.find({ studentId, active: true }).toArray();
  const dhikrIds = assignments.map((a) => new ObjectId(a.dhikrId));

  if (dhikrIds.length === 0) return [];
  const dhikrDocs = await dhikrs.find({ _id: { $in: dhikrIds }, active: true }).toArray();

  return dhikrDocs.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    arabicText: d.arabicText,
    transliteration: d.transliteration,
    translation: d.translation,
    recommendedCount: d.recommendedCount,
    reference: d.reference,
    category: d.category,
    active: d.active,
    createdAt: d.createdAt,
  }));
}

export async function getStudentDhikrCompletions(studentId: string, date: string): Promise<DhikrCompletion[]> {
  const { dhikrCompletions } = await getIbadahCollections();
  const docs = await dhikrCompletions.find({ studentId, date }).toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    studentId: d.studentId,
    dhikrId: d.dhikrId,
    date: d.date,
    completedAt: d.completedAt,
  }));
}

export async function toggleDhikrCompletion(
  studentId: string,
  dhikrId: string,
  date: string,
): Promise<{ completed: boolean }> {
  const { dhikrCompletions } = await getIbadahCollections();
  const existing = await dhikrCompletions.findOne({ studentId, dhikrId, date });

  if (existing) {
    await dhikrCompletions.deleteOne({ _id: existing._id });
    return { completed: false };
  } else {
    await dhikrCompletions.insertOne({
      studentId,
      dhikrId,
      date,
      completedAt: new Date().toISOString(),
    });
    return { completed: true };
  }
}

// ----------------------------------------------------------------------
// Assignment Management for Admin
// ----------------------------------------------------------------------

export async function setStudentDuaAssignments(studentId: string, duaIds: string[]): Promise<void> {
  const { studentDuas } = await getIbadahCollections();
  await studentDuas.deleteMany({ studentId });
  if (duaIds.length > 0) {
    const docs = duaIds.map((duaId) => ({
      studentId,
      duaId,
      assignedAt: todayDate(),
      active: true,
    }));
    await studentDuas.insertMany(docs);
  }
}

export async function setStudentDhikrAssignments(studentId: string, dhikrIds: string[]): Promise<void> {
  const { studentDhikrs } = await getIbadahCollections();
  await studentDhikrs.deleteMany({ studentId });
  if (dhikrIds.length > 0) {
    const docs = dhikrIds.map((dhikrId) => ({
      studentId,
      dhikrId,
      assignedAt: todayDate(),
      active: true,
    }));
    await studentDhikrs.insertMany(docs);
  }
}

// ----------------------------------------------------------------------
// Daily Summaries & History Engine
// ----------------------------------------------------------------------

export async function getStudentDaySummary(studentId: string, date: string): Promise<DayCompletionSummary> {
  const [prayers, prayerCompletions, assignedDuas, duaCompletions, assignedDhikrs, dhikrCompletions] =
    await Promise.all([
      listPrayers(),
      getStudentPrayerCompletions(studentId, date),
      getStudentAssignedDuas(studentId),
      getStudentDuaCompletions(studentId, date),
      getStudentAssignedDhikrs(studentId),
      getStudentDhikrCompletions(studentId, date),
    ]);

  const prayersTotal = prayers.length;
  const prayersCompleted = prayerCompletions.length;
  const duasTotal = assignedDuas.length;
  const duasCompleted = duaCompletions.length;
  const dhikrsTotal = assignedDhikrs.length;
  const dhikrsCompleted = dhikrCompletions.length;

  const totalTasks = prayersTotal + duasTotal + dhikrsTotal;
  const totalCompleted = prayersCompleted + duasCompleted + dhikrsCompleted;
  const percentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return {
    date,
    prayersTotal,
    prayersCompleted,
    duasTotal,
    duasCompleted,
    dhikrsTotal,
    dhikrsCompleted,
    totalTasks,
    totalCompleted,
    percentage,
  };
}

export async function getStudentHistoryDays(studentId: string, daysCount = 14): Promise<DayCompletionSummary[]> {
  const summaries: DayCompletionSummary[] = [];
  const now = new Date();

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const summary = await getStudentDaySummary(studentId, dateStr);
    summaries.push(summary);
  }

  return summaries;
}

export async function getStudentStreak(studentId: string): Promise<number> {
  let streak = 0;
  const now = new Date();

  // Check up to past 60 days
  for (let i = 0; i < 60; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const summary = await getStudentDaySummary(studentId, dateStr);

    if (i === 0 && summary.totalCompleted === 0) {
      // Today not completed yet, keep checking yesterday
      continue;
    }

    if (summary.percentage >= 60) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}
