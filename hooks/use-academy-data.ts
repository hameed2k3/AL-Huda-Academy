"use client";

import { useEffect, useState } from "react";
import type {
  AdminCertificate,
  AdminCourse,
  AdminStudent,
  CreateCourseInput,
  CreateStudentInput,
  UpdateCourseInput,
  UpdateStudentInput,
} from "@/lib/admin-types";

type AcademyState = {
  courses: AdminCourse[];
  students: AdminStudent[];
  certificates: AdminCertificate[];
  loading: boolean;
  error: string | null;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as {
    ok: boolean;
    data?: T;
    message?: string;
  };

  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload.data as T;
}

export function useAcademyData() {
  const [state, setState] = useState<AcademyState>({
    courses: [],
    students: [],
    certificates: [],
    loading: true,
    error: null,
  });

  async function loadAll() {
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const [courses, students, certificates] = await Promise.all([
        fetch("/api/admin/courses", { cache: "no-store" }).then((response) =>
          parseResponse<AdminCourse[]>(response),
        ),
        fetch("/api/admin/students", { cache: "no-store" }).then((response) =>
          parseResponse<AdminStudent[]>(response),
        ),
        fetch("/api/admin/certificates", { cache: "no-store" }).then((response) =>
          parseResponse<AdminCertificate[]>(response),
        ),
      ]);

      setState({
        courses,
        students,
        certificates,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load academy data.",
      }));
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  async function createCourse(input: CreateCourseInput) {
    await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then((response) => parseResponse<AdminCourse>(response));
    await loadAll();
  }

  async function updateCourse(id: string, input: UpdateCourseInput) {
    await fetch(`/api/admin/courses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then((response) => parseResponse<AdminCourse>(response));
    await loadAll();
  }

  async function deleteCourse(id: string) {
    await fetch(`/api/admin/courses/${id}`, {
      method: "DELETE",
    }).then((response) => parseResponse<void>(response));
    await loadAll();
  }

  async function createStudent(input: CreateStudentInput) {
    await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then((response) => parseResponse<AdminStudent>(response));
    await loadAll();
  }

  async function updateStudent(id: string, input: UpdateStudentInput) {
    await fetch(`/api/admin/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then((response) => parseResponse<AdminStudent>(response));
    await loadAll();
  }

  async function deleteStudent(id: string) {
    await fetch(`/api/admin/students/${id}`, {
      method: "DELETE",
    }).then((response) => parseResponse<void>(response));
    await loadAll();
  }

  async function completeCourseForStudent(id: string) {
    await fetch(`/api/admin/students/${id}/complete`, {
      method: "POST",
    }).then((response) => parseResponse<AdminCertificate>(response));
    await loadAll();
  }

  async function reopenStudentCourse(id: string) {
    await fetch(`/api/admin/students/${id}`, {
      method: "PUT",
    }).then((response) => parseResponse<void>(response));
    await loadAll();
  }

  async function resetDemoData() {
    await fetch("/api/admin/courses", {
      method: "DELETE",
    }).then((response) => parseResponse<void>(response));
    await loadAll();
  }

  return {
    ...state,
    createCourse,
    updateCourse,
    deleteCourse,
    createStudent,
    updateStudent,
    deleteStudent,
    completeCourseForStudent,
    reopenStudentCourse,
    resetDemoData,
    refresh: loadAll,
  };
}
