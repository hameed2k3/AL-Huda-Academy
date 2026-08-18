import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { courseCatalog } from "@/lib/site-data";
import type {
  AdminCertificate,
  AdminCourse,
  AdminStudent,
  CreateCourseInput,
  CreateStudentInput,
  UpdateCourseInput,
  UpdateStudentInput,
} from "@/lib/admin-types";

type CourseDocument = Omit<AdminCourse, "id"> & { _id?: ObjectId };
type StudentDocument = Omit<AdminStudent, "id"> & { _id?: ObjectId };
type CertificateDocument = Omit<AdminCertificate, "id"> & { _id?: ObjectId };

function today() {
  return new Date().toISOString().slice(0, 10);
}

function toAdminCourse(document: CourseDocument): AdminCourse {
  return {
    id: document._id!.toString(),
    title: document.title,
    duration: document.duration,
    description: document.description,
    certificateAvailable: document.certificateAvailable,
    createdAt: document.createdAt,
  };
}

function toAdminStudent(document: StudentDocument): AdminStudent {
  return {
    id: document._id!.toString(),
    fullName: document.fullName,
    guardianName: document.guardianName,
    email: document.email,
    phone: document.phone,
    courseId: document.courseId,
    status: document.status,
    createdAt: document.createdAt,
    completedAt: document.completedAt,
    certificateId: document.certificateId,
    instructorName: document.instructorName,
  };
}

function toAdminCertificate(document: CertificateDocument): AdminCertificate {
  return {
    id: document._id!.toString(),
    certificateNumber: document.certificateNumber,
    studentId: document.studentId,
    studentName: document.studentName,
    courseId: document.courseId,
    courseTitle: document.courseTitle,
    issueDate: document.issueDate,
    completionDate: document.completionDate,
    instructorName: document.instructorName,
    grade: document.grade,
    generatedAt: document.generatedAt,
  };
}

async function getCollections() {
  const db = await getMongoDb();

  return {
    courses: db.collection<CourseDocument>("courses"),
    students: db.collection<StudentDocument>("students"),
    certificates: db.collection<CertificateDocument>("certificates"),
  };
}

function createCertificateNumber(sequence: number) {
  const year = new Date().getFullYear();
  return `AHQA-${year}-${String(sequence).padStart(4, "0")}`;
}

export async function ensureSeedData() {
  const { courses, students, certificates } = await getCollections();

  const courseCount = await courses.countDocuments();

  if (courseCount > 0) {
    return;
  }

  const seededCourses = courseCatalog.map((course) => ({
    title: course.title,
    duration: course.duration,
    description: course.description,
    certificateAvailable: course.certificateAvailable,
    createdAt: "2026-07-18",
  }));

  const insertedCourses = await courses.insertMany(seededCourses as Omit<CourseDocument, "_id">[]);
  const courseEntries = Object.entries(insertedCourses.insertedIds);
  const courseIds = courseEntries.map(([, value]) => value.toString());

  const seededStudents: Omit<StudentDocument, "_id">[] = [
    {
      fullName: "Amina Rahman",
      guardianName: "Abdul Rahman",
      email: "amina@example.com",
      phone: "+91 9000000001",
      courseId: courseIds[0] ?? null,
      status: "completed",
      createdAt: "2026-04-01",
      completedAt: "2026-04-08",
      certificateId: null,
      instructorName: "Ustadha Maryam Siddiqui",
    },
    {
      fullName: "Yusuf Kareem",
      guardianName: "Kareem Ahmed",
      email: "yusuf@example.com",
      phone: "+91 9000000002",
      courseId: courseIds[1] ?? null,
      status: "completed",
      createdAt: "2026-05-01",
      completedAt: "2026-05-18",
      certificateId: null,
      instructorName: "Qari Abdul Basit",
    },
    {
      fullName: "Safiya Ahmed",
      guardianName: "Imran Ahmed",
      email: "safiya@example.com",
      phone: "+91 9000000003",
      courseId: courseIds[2] ?? null,
      status: "completed",
      createdAt: "2026-05-25",
      completedAt: "2026-06-09",
      certificateId: null,
      instructorName: "Ustadha Hiba Noor",
    },
    {
      fullName: "Maryam Ali",
      guardianName: "Sajid Ali",
      email: "maryam@example.com",
      phone: "+91 9000000004",
      courseId: courseIds[3] ?? null,
      status: "active",
      createdAt: "2026-07-10",
      completedAt: null,
      certificateId: null,
      instructorName: "Ustadha Hiba Noor",
    },
  ];

  const insertedStudents = await students.insertMany(seededStudents);
  const studentIds = Object.values(insertedStudents.insertedIds).map((value) =>
    value.toString(),
  );

  const seededCertificates: Omit<CertificateDocument, "_id">[] = seededStudents
    .map((student, index) => {
      if (student.status !== "completed" || !student.courseId) {
        return null;
      }

      const course = seededCourses.find((_, courseIndex) => courseIds[courseIndex] === student.courseId);

      if (!course) {
        return null;
      }

      return {
        certificateNumber: createCertificateNumber(index + 1),
        studentId: studentIds[index] ?? "",
        studentName: student.fullName,
        courseId: student.courseId,
        courseTitle: course.title,
        issueDate: student.completedAt ?? today(),
        completionDate: student.completedAt ?? today(),
        instructorName: student.instructorName,
        grade: index === 1 ? "Distinction" : "Excellent",
        generatedAt: student.completedAt ?? today(),
      };
    })
    .filter((certificate): certificate is Omit<CertificateDocument, "_id"> => Boolean(certificate));

  const insertedCertificates = await certificates.insertMany(seededCertificates);
  const certificateIds = Object.values(insertedCertificates.insertedIds).map((value) =>
    value.toString(),
  );

  await Promise.all(
    certificateIds.map((certificateId, index) =>
      students.updateOne(
        { _id: new ObjectId(studentIds[index] ?? "") },
        { $set: { certificateId } },
      ),
    ),
  );
}

export async function listCourses() {
  await ensureSeedData();
  const { courses } = await getCollections();
  const documents = await courses.find().sort({ createdAt: 1 }).toArray();
  return documents.map(toAdminCourse);
}

export async function createCourse(input: CreateCourseInput) {
  await ensureSeedData();
  const { courses } = await getCollections();
  const result = await courses.insertOne({
    ...input,
    createdAt: today(),
  } as Omit<CourseDocument, "_id">);
  const document = await courses.findOne({ _id: result.insertedId });
  if (!document) throw new Error("Failed to create course.");
  return toAdminCourse(document);
}

export async function updateCourse(id: string, input: UpdateCourseInput) {
  const { courses, certificates } = await getCollections();
  const _id = new ObjectId(id);

  await courses.updateOne({ _id }, { $set: input });

  if (input.title) {
    await certificates.updateMany({ courseId: id }, { $set: { courseTitle: input.title } });
  }

  const document = await courses.findOne({ _id });
  if (!document) throw new Error("Course not found.");
  return toAdminCourse(document);
}

export async function deleteCourse(id: string) {
  const { courses, students } = await getCollections();
  await students.updateMany(
    { courseId: id, status: { $ne: "completed" } },
    { $set: { courseId: null } },
  );
  await courses.deleteOne({ _id: new ObjectId(id) });
}

export async function listStudents() {
  await ensureSeedData();
  const { students } = await getCollections();
  const documents = await students.find().sort({ fullName: 1 }).toArray();
  return documents.map(toAdminStudent);
}

export async function createStudent(input: CreateStudentInput) {
  await ensureSeedData();
  const { students } = await getCollections();
  const result = await students.insertOne({
    ...input,
    createdAt: today(),
    completedAt: null,
    certificateId: null,
  } as Omit<StudentDocument, "_id">);
  const document = await students.findOne({ _id: result.insertedId });
  if (!document) throw new Error("Failed to create student.");
  return toAdminStudent(document);
}

export async function updateStudent(id: string, input: UpdateStudentInput) {
  const { students, certificates } = await getCollections();
  const _id = new ObjectId(id);
  await students.updateOne({ _id }, { $set: input });

  const student = await students.findOne({ _id });
  if (!student) throw new Error("Student not found.");

  const certificateUpdate: Partial<CertificateDocument> = {};
  if (input.fullName) certificateUpdate.studentName = input.fullName;
  if (input.instructorName) certificateUpdate.instructorName = input.instructorName;

  if (Object.keys(certificateUpdate).length > 0) {
    await certificates.updateMany({ studentId: id }, { $set: certificateUpdate });
  }

  return toAdminStudent(student);
}

export async function deleteStudent(id: string) {
  const { students, certificates } = await getCollections();
  await certificates.deleteMany({ studentId: id });
  await students.deleteOne({ _id: new ObjectId(id) });
}

export async function listCertificates() {
  await ensureSeedData();
  const { certificates } = await getCollections();
  const documents = await certificates.find().sort({ generatedAt: -1 }).toArray();
  return documents.map(toAdminCertificate);
}

export async function completeStudentCourse(id: string) {
  const { students, courses, certificates } = await getCollections();
  const _id = new ObjectId(id);
  const student = await students.findOne({ _id });

  if (!student) throw new Error("Student not found.");
  if (!student.courseId) throw new Error("Student has no assigned course.");
  if (student.status === "completed") {
    const existing = await certificates.findOne({ studentId: id });
    if (!existing) throw new Error("Completed student has no certificate record.");
    return toAdminCertificate(existing);
  }

  const course = await courses.findOne({ _id: new ObjectId(student.courseId) });
  if (!course) throw new Error("Assigned course not found.");

  const sequence = (await certificates.countDocuments()) + 1;
  const completionDate = today();
  const insert = await certificates.insertOne({
    certificateNumber: createCertificateNumber(sequence),
    studentId: id,
    studentName: student.fullName,
    courseId: student.courseId,
    courseTitle: course.title,
    issueDate: completionDate,
    completionDate,
    instructorName: student.instructorName,
    grade: "Excellent",
    generatedAt: completionDate,
  });

  await students.updateOne(
    { _id },
    {
      $set: {
        status: "completed",
        completedAt: completionDate,
        certificateId: insert.insertedId.toString(),
      },
    },
  );

  const certificate = await certificates.findOne({ _id: insert.insertedId });
  if (!certificate) throw new Error("Failed to generate certificate.");
  return toAdminCertificate(certificate);
}

export async function reopenStudentCourse(id: string) {
  const { students, certificates } = await getCollections();
  const existing = await certificates.findOne({ studentId: id });
  if (existing) {
    await certificates.deleteOne({ _id: existing._id });
  }

  await students.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: "active",
        completedAt: null,
        certificateId: null,
      },
    },
  );
}

export async function resetSeedData() {
  const { courses, students, certificates } = await getCollections();
  await Promise.all([
    courses.deleteMany({}),
    students.deleteMany({}),
    certificates.deleteMany({}),
  ]);
  await ensureSeedData();
}

export async function findCertificateByNumber(certificateNumber: string) {
  const { certificates } = await getCollections();
  const document = await certificates.findOne({
    certificateNumber: certificateNumber.trim().toUpperCase(),
  });
  return document ? toAdminCertificate(document) : null;
}

export async function getAdminSummary() {
  const [courses, students, certificates] = await Promise.all([
    listCourses(),
    listStudents(),
    listCertificates(),
  ]);

  return { courses, students, certificates };
}
