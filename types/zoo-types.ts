export interface MedicalRecord {
  date: string
  type: string
  notes: string
  treatment?: string
}

export interface Animal {
  id: string
  name: string
  species: string
  gender: string
  age: number
  health_status: string
  location: string
  diet_requirements: string
  medical_history: MedicalRecord[]
  arrival_date: string
  image_url: string
  description?: string
  special_care_instructions?: string
}

export interface Resource {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  status: string
  last_restocked: string
  expiration_date?: string
  supplier?: string
}

export interface Report {
  id: string
  title: string
  category: string
  date: string
  author: string
  file_url: string
  content?: string
}

