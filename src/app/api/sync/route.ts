import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client for sync operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not configured - sync will use anon key (limited functionality)')
}

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

class PlantaApiClient {
  private baseUrl = 'https://public.planta-api.com/v1'
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getAllPlants() {
    const response = await fetch(`${this.baseUrl}/addedPlants`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Planta API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

export async function POST() {
  try {
    const accessToken = process.env.PLANTA_ACCESS_TOKEN
    if (!accessToken) {
      throw new Error('Planta API token not configured')
    }

    const client = new PlantaApiClient(accessToken)
    const response = await client.getAllPlants()
    const plantaPlants = response.data

    let syncedCount = 0
    let newPlantsCount = 0
    let newPhotosCount = 0

    for (const plantaPlant of plantaPlants) {
      // Check if plant exists
      const { data: existingPlant } = await supabaseAdmin
        .from('plants')
        .select('id')
        .eq('planta_id', plantaPlant.id)
        .single()

      if (existingPlant) {
        // Check for new photos
        const { data: currentPhoto } = await supabaseAdmin
          .from('plant_photos')
          .select('url')
          .eq('plant_id', existingPlant.id)
          .eq('is_current', true)
          .single()

        if (!currentPhoto || currentPhoto.url !== plantaPlant.image.url) {
          // Mark all photos as not current
          await supabaseAdmin
            .from('plant_photos')
            .update({ is_current: false })
            .eq('plant_id', existingPlant.id)

          // Add new photo
          await supabaseAdmin
            .from('plant_photos')
            .insert({
              plant_id: existingPlant.id,
              url: plantaPlant.image.url,
              date_taken: plantaPlant.image.lastUpdated,
              caption: 'From Planta API',
              is_current: true
            })

          // Update thumbnail
          await supabaseAdmin
            .from('plants')
            .update({ thumbnail_url: plantaPlant.image.url })
            .eq('id', existingPlant.id)

          newPhotosCount++
        }
        syncedCount++
      } else {
        // Add new plant
        const { data: newPlant } = await supabaseAdmin
          .from('plants')
          .insert({
            name: plantaPlant.names.localizedName || plantaPlant.names.custom || 'Unknown Plant',
            scientific_name: plantaPlant.names.scientific,
            thumbnail_url: plantaPlant.image.url,
            planta_id: plantaPlant.id
          })
          .select()
          .single()

        // Add initial photo
        await supabaseAdmin
          .from('plant_photos')
          .insert({
            plant_id: newPlant.id,
            url: plantaPlant.image.url,
            date_taken: plantaPlant.image.lastUpdated,
            caption: 'From Planta API',
            is_current: true
          })

        newPlantsCount++
        syncedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync completed successfully`,
      stats: {
        totalPlants: plantaPlants.length,
        syncedPlants: syncedCount,
        newPlants: newPlantsCount,
        newPhotos: newPhotosCount
      }
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Sync failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}
