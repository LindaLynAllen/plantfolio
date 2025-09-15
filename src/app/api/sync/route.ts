import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PlantaPlant, PlantaPlantsResponse } from '@/types/planta-api'

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
    let allPlants: PlantaPlant[] = []
    let nextPage: string | null = null
    let pageCount = 0

    do {
      const url = nextPage ? `${this.baseUrl}/addedPlants?cursor=${nextPage}` : `${this.baseUrl}/addedPlants`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Planta API error: ${response.status} ${response.statusText}`)
      }

      const data: PlantaPlantsResponse = await response.json()
      allPlants = allPlants.concat(data.data)
      nextPage = data.pagination?.nextPage || null
      pageCount++

      console.log(`Fetched page ${pageCount}, ${data.data.length} plants, total: ${allPlants.length}`)
      
      // Safety check to prevent infinite loops
      if (pageCount > 50) {
        console.warn('Stopping pagination after 50 pages to prevent infinite loop')
        break
      }
    } while (nextPage)

    return {
      data: allPlants,
      pagination: { totalPages: pageCount, totalPlants: allPlants.length }
    }
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
        totalPlantsFromAPI: plantaPlants.length,
        totalPagesFetched: response.pagination.totalPages,
        syncedPlants: syncedCount,
        newPlants: newPlantsCount,
        newPhotos: newPhotosCount,
        existingPlants: syncedCount - newPlantsCount
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