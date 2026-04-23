import { useMutation, useQuery } from '@tanstack/react-query'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('spark-token')
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Something went wrong')
  }
  return res.json()
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export function useLogin() {
  return useMutation({
    mutationFn: (creds) =>
      apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
  })
}

// ── Academic Mapper ───────────────────────────────────────────────────────────
export function useUploadTranscript() {
  return useMutation({
    mutationFn: (formData) =>
      apiFetch('/academic-mapper/upload', { method: 'POST', body: formData }),
  })
}

export function useAcademicMapperResult(documentId) {
  return useQuery({
    queryKey: ['academic-mapper', documentId],
    queryFn: () => apiFetch(`/academic-mapper/result/${documentId}`),
    enabled: !!documentId,
    refetchInterval: (data) => (data ? false : 2000),
  })
}

// ── Semester Planner ──────────────────────────────────────────────────────────
export function useSemesterPlanner() {
  return useMutation({
    mutationFn: (formData) =>
      apiFetch('/semester-planner/generate', { method: 'POST', body: formData }),
  })
}

// ── Opportunity Board ─────────────────────────────────────────────────────────
export function useOpportunities(filters = {}) {
  const params = new URLSearchParams(filters).toString()
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: () => apiFetch(`/opportunities?${params}`),
  })
}

export function useOpportunityDetail(id) {
  return useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => apiFetch(`/opportunities/${id}`),
    enabled: !!id,
  })
}

export function useToggleReminder() {
  return useMutation({
    mutationFn: ({ id, active }) =>
      apiFetch(`/opportunities/${id}/reminder`, {
        method: 'POST',
        body: JSON.stringify({ active }),
      }),
  })
}

// ── CV Reviewer ───────────────────────────────────────────────────────────────
export function useUploadCv() {
  return useMutation({
    mutationFn: (formData) =>
      apiFetch('/cv-reviewer/upload', { method: 'POST', body: formData }),
  })
}

export function useCvReviewResult(reviewId) {
  return useQuery({
    queryKey: ['cv-review', reviewId],
    queryFn: () => apiFetch(`/cv-reviewer/result/${reviewId}`),
    enabled: !!reviewId,
    refetchInterval: (data) => (data ? false : 2000),
  })
}

// ── SKS Chatbot ───────────────────────────────────────────────────────────────
export function useSksChat() {
  return useMutation({
    mutationFn: ({ sessionId, message, jalur }) =>
      apiFetch('/sks-chatbot/chat', {
        method: 'POST',
        body: JSON.stringify({ sessionId, message, jalur }),
      }),
  })
}

export function useSksSession() {
  return useMutation({
    mutationFn: (jalur) =>
      apiFetch('/sks-chatbot/session', {
        method: 'POST',
        body: JSON.stringify({ jalur }),
      }),
  })
}