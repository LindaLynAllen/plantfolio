export interface Database {
  public: {
    Tables: {
      plants: {
        Row: {
          id: string
          name: string
          scientific_name: string | null
          thumbnail_url: string | null
          planta_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          scientific_name?: string | null
          thumbnail_url?: string | null
          planta_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          scientific_name?: string | null
          thumbnail_url?: string | null
          planta_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plant_photos: {
        Row: {
          id: string
          plant_id: string
          url: string
          date_taken: string
          caption: string | null
          is_current: boolean
          created_at: string
        }
        Insert: {
          id?: string
          plant_id: string
          url: string
          date_taken: string
          caption?: string | null
          is_current?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          plant_id?: string
          url?: string
          date_taken?: string
          caption?: string | null
          is_current?: boolean
          created_at?: string
        }
      }
    }
  }
}
